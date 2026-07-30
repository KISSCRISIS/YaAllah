const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  host: 'aws-0-eu-central-1.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.jyqaidoamiskfbanawhl',
  password: 'Dd8Kydb7rkjWrmyl',
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 15000,
});

const tables = ['categories','content_types','domains','permissions','progress_status','role_permissions','roles','tracks'];
const outputPath = __dirname + '/backup_seed_20260730.json';

async function main() {
  const client = await pool.connect();
  console.log('Connected to Supabase.');

  const backup = { exported_at: new Date().toISOString(), tables: {} };
  let total = 0;

  for (const table of tables) {
    try {
      const res = await client.query('SELECT * FROM public."' + table + '" ORDER BY 1');
      backup.tables[table] = { row_count: res.rows.length, rows: res.rows };
      total += res.rows.length;
      console.log('  ' + table + ': ' + res.rows.length + ' rows');
    } catch (err) {
      backup.tables[table] = { row_count: 0, rows: [], error: err.message };
      console.log('  ' + table + ': ERROR - ' + err.message);
    }
  }

  backup.total_rows = total;
  client.release();
  await pool.end();

  fs.writeFileSync(outputPath, JSON.stringify(backup, null, 2), 'utf-8');
  if (fs.existsSync(outputPath)) {
    const stat = fs.statSync(outputPath);
    console.log('\n✅ BACKUP CREATED: backup_seed_20260730.json');
    console.log('   Size: ' + stat.size + ' bytes');
    console.log('   Total rows: ' + total);
  } else {
    console.log('\n❌ BACKUP FAILED - file not written');
    process.exit(1);
  }
}

main().catch(err => {
  console.error('FATAL:', err.message);
  process.exit(1);
});
