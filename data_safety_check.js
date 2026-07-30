const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  host: 'aws-0-eu-central-1.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.jyqaidoamiskfbanawhl',
  password: 'Dd8Kydb7rkjWrmyl',
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 15000,
});

const outputPath = __dirname + '/data_safety_check.json';
const tables = [
  'categories', 'content_types', 'domains', 'permissions',
  'progress_status', 'role_permissions', 'roles', 'tracks'
];

async function run() {
  const result = { inspected_at: new Date().toISOString(), tables: {} };

  try {
    const client = await pool.connect();

    for (const table of tables) {
      const info = {};

      // 1. Row count
      const countRes = await client.query(`SELECT count(*) as cnt FROM public."${table}"`);
      info.row_count = parseInt(countRes.rows[0].cnt);

      // 2. Sample rows (up to 10)
      if (info.row_count > 0) {
        const sample = await client.query(`SELECT * FROM public."${table}" ORDER BY 1 LIMIT 10`);
        info.sample_rows = sample.rows;
        info.sample_count = sample.rows.length;

        // 3. Check for created_at / timestamps
        const colsRes = await client.query(`
          SELECT column_name, data_type
          FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = $1
          ORDER BY ordinal_position
        `, [table]);
        info.columns = colsRes.rows.map(c => c.column_name + ' (' + c.data_type + ')');

        // 4. Timestamp range if created_at exists
        const hasCreatedAt = colsRes.rows.some(c => c.column_name === 'created_at');
        if (hasCreatedAt) {
          const ts = await client.query(`SELECT min(created_at) as oldest, max(created_at) as newest FROM public."${table}"`);
          info.created_at_range = ts.rows[0];
        }

        // 5. Check for user-related columns
        const userCols = colsRes.rows.filter(c =>
          c.column_name.includes('user') || c.column_name.includes('profile') || c.column_name.includes('actor')
        );
        if (userCols.length > 0) {
          info.has_user_columns = userCols.map(c => c.column_name);
        }

        // 6. Check for content-related columns
        const contentCols = colsRes.rows.filter(c =>
          c.column_name.includes('content') || c.column_name.includes('body') || c.column_name.includes('media')
        );
        if (contentCols.length > 0) {
          info.has_content_columns = contentCols.map(c => c.column_name);
        }
      }

      // 7. Table size
      const sizeRes = await client.query(`
        SELECT pg_size_pretty(pg_total_relation_size('public."${table}"')) as total_size
      `);
      info.total_size = sizeRes.rows[0].total_size;

      result.tables[table] = info;
    }

    // Additional: check auth.users count for environment context
    try {
      const authUsers = await client.query(`SELECT count(*) as cnt FROM auth.users`);
      result.auth_users_count = parseInt(authUsers.rows[0].cnt);

      if (result.auth_users_count > 0) {
        const auSample = await client.query(`SELECT id, email, created_at, last_sign_in_at FROM auth.users LIMIT 5`);
        result.auth_users_sample = auSample.rows;
      }
    } catch(e) {
      result.auth_users_error = e.message;
    }

    client.release();

    // Summary
    const totalRows = Object.values(result.tables).reduce((s, t) => s + t.row_count, 0);
    result.summary = {
      total_tables: tables.length,
      tables_with_data: Object.values(result.tables).filter(t => t.row_count > 0).length,
      tables_empty: Object.values(result.tables).filter(t => t.row_count === 0).length,
      total_rows: totalRows,
      auth_users: result.auth_users_count || 0,
    };

    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8');
    console.log('✓ Written to data_safety_check.json\n');

    // Pretty print
    console.log('=== PUBLIC TABLES DATA INSPECTION ===\n');
    for (const [name, info] of Object.entries(result.tables)) {
      const icon = info.row_count > 0 ? '📦' : '📭';
      console.log(`${icon} ${name}: ${info.row_count} rows | ${info.total_size}`);
      if (info.row_count > 0) {
        console.log(`   Columns: ${(info.columns||[]).join(', ')}`);
        if (info.created_at_range) {
          console.log(`   Timestamps: ${info.created_at_range.oldest} → ${info.created_at_range.newest}`);
        }
        if (info.has_user_columns) console.log(`   ⚠ User columns: ${info.has_user_columns.join(', ')}`);
        if (info.has_content_columns) console.log(`   ⚠ Content columns: ${info.has_content_columns.join(', ')}`);
        // Print first 3 rows
        const preview = info.sample_rows.slice(0, 3).map(r => JSON.stringify(r));
        console.log(`   Sample: ${preview.join(' | ')}`);
      }
    }

    console.log(`\nauth.users: ${result.auth_users_count || 0} users`);
    if (result.auth_users_sample) {
      result.auth_users_sample.forEach(u => console.log(`   ${u.email || '(no email)'} | created: ${u.created_at} | last: ${u.last_sign_in_at}`));
    }

    // Classification
    console.log('\n=== ENVIRONMENT CLASSIFICATION ===');
    const summary = result.summary;
    if (summary.total_rows === 0 && summary.auth_users === 0) {
      console.log('🏷️ EMPTY PROTOTYPE — No data, no users. Safe to reset. ✅');
    } else if (summary.total_rows < 50 && summary.auth_users <= 2) {
      console.log('🏷️ DEVELOPMENT — Minimal seed-like data. Safe to reset with caution. ⚠️');
    } else if (summary.total_rows < 500 && summary.auth_users <= 10) {
      console.log('🏷️ STAGING — Some test data. Reset requires confirmation. ⚠️');
    } else {
      console.log('🏷️ PRODUCTION-LIKE — Significant data detected. DO NOT RESET without approval! 🔴');
    }

  } catch(err) {
    console.error('ERROR:', err.message);
  } finally {
    await pool.end();
  }
}

run();
