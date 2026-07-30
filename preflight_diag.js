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

const outputPath = __dirname + '/preflight_diagnostic.json';

async function run() {
  const result = {};
  
  try {
    const client = await pool.connect();
    
    // 1. SCHEMAS
    const schemas = await client.query(`
      SELECT schema_name FROM information_schema.schemata 
      WHERE schema_name NOT LIKE 'pg_%' AND schema_name != 'information_schema'
      ORDER BY schema_name
    `);
    result.schemas = schemas.rows.map(r => r.schema_name);
    
    // 2. ALL TABLES (by schema)
    const tables = await client.query(`
      SELECT table_schema, table_name, table_type
      FROM information_schema.tables
      WHERE table_schema NOT LIKE 'pg_%' AND table_schema != 'information_schema'
      ORDER BY table_schema, table_name
    `);
    result.tables = tables.rows;
    
    // 3. PUBLIC TABLES with column count
    const publicTables = await client.query(`
      SELECT table_name, 
             (SELECT count(*) FROM information_schema.columns WHERE table_schema='public' AND table_name=t.table_name) as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    result.publicTables = publicTables.rows;
    
    // 4. RLS STATUS per table
    const rlsStatus = await client.query(`
      SELECT schemaname, tablename, rowsecurity 
      FROM pg_tables 
      WHERE schemaname NOT IN ('pg_catalog','information_schema')
      ORDER BY schemaname, tablename
    `);
    result.rlsStatus = rlsStatus.rows;
    
    // 5. ALL POLICIES
    const policies = await client.query(`
      SELECT schemaname, tablename, policyname, cmd, qual
      FROM pg_policies
      WHERE schemaname NOT IN ('pg_catalog','information_schema')
      ORDER BY schemaname, tablename, policyname
    `);
    result.policies = policies.rows;
    
    // 6. FUNCTIONS (non-system)
    const functions = await client.query(`
      SELECT n.nspname as schema, p.proname as name,
             pg_get_function_result(p.oid) as return_type
      FROM pg_proc p
      JOIN pg_namespace n ON p.pronamespace = n.oid
      WHERE n.nspname NOT IN ('pg_catalog','information_schema')
        AND p.prokind = 'f'
      ORDER BY n.nspname, p.proname
    `);
    result.functions = functions.rows;
    
    // 7. TRIGGERS
    const triggers = await client.query(`
      SELECT event_object_schema, event_object_table, trigger_name,
             event_manipulation, action_timing
      FROM information_schema.triggers
      WHERE trigger_schema NOT IN ('pg_catalog','information_schema')
      ORDER BY event_object_schema, event_object_table, trigger_name
    `);
    result.triggers = triggers.rows;
    
    // 8. EXTENSIONS
    const extensions = await client.query(`
      SELECT extname, extversion
      FROM pg_extension
      ORDER BY extname
    `);
    result.extensions = extensions.rows;
    
    // 9. FOREIGN KEYS (public)
    const fks = await client.query(`
      SELECT tc.table_name, tc.constraint_name,
             kcu.column_name,
             ccu.table_name AS foreign_table,
             ccu.column_name AS foreign_column,
             rc.delete_rule
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.constraint_schema
      JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
      JOIN information_schema.referential_constraints rc ON tc.constraint_name = rc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
      ORDER BY tc.table_name, tc.constraint_name
    `);
    result.foreignKeys = fks.rows;
    
    // 10. PRISMA MIGRATIONS
    let prismaMigrations = null;
    try {
      const pm = await client.query(`
        SELECT migration_name, finished_at, rolled_back_at, applied_steps_count
        FROM _prisma_migrations
        ORDER BY finished_at DESC
      `);
      prismaMigrations = pm.rows;
    } catch(e) {
      prismaMigrations = { error: e.message };
    }
    result.prismaMigrations = prismaMigrations;
    
    // 11. INDEXES (public, non-PK)
    const indexes = await client.query(`
      SELECT tablename, indexname
      FROM pg_indexes
      WHERE schemaname = 'public' AND indexname NOT LIKE '%_pkey'
      ORDER BY tablename, indexname
    `);
    result.indexes = indexes.rows;
    
    // 12. ENUMS
    const enums = await client.query(`
      SELECT n.nspname as schema, t.typname as enum_name
      FROM pg_type t
      JOIN pg_namespace n ON t.typnamespace = n.oid
      WHERE t.typtype = 'e'
        AND n.nspname NOT IN ('pg_catalog','information_schema')
      ORDER BY n.nspname, t.typname
    `);
    result.enums = enums.rows;

    // 13. COLUMN DETAILS for public tables (for drift analysis)
    const columns = await client.query(`
      SELECT table_name, column_name, data_type, udt_name, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position
    `);
    result.columns = columns.rows;
    
    client.release();
    
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8');
    console.log('✓ Diagnostic written to preflight_diagnostic.json');
    
    // Quick summary
    console.log('');
    console.log('=== QUICK SUMMARY ===');
    console.log('Schemas:', result.schemas.join(', '));
    console.log('Public tables (' + result.publicTables.length + '):', result.publicTables.map(t=>t.table_name).join(', '));
    console.log('');
    console.log('auth tables:', result.tables.filter(t=>t.table_schema==='auth').map(t=>t.table_name).join(', '));
    console.log('RLS-enabled tables:', result.rlsStatus.filter(r=>r.rowsecurity).length);
    console.log('Policies:', result.policies.length);
    console.log('Functions (custom):', result.functions.length, '→', result.functions.map(f=>f.schema+'.'+f.name).join(', '));
    console.log('Triggers (custom):', result.triggers.length, '→', result.triggers.map(t=>t.trigger_name+' ON '+t.event_object_table).join(', '));
    console.log('Extensions:', result.extensions.map(e=>e.extname+' v'+e.extversion).join(', '));
    console.log('Public FKs:', result.foreignKeys.length);
    console.log('Indexes:', result.indexes.length);
    console.log('Enums:', result.enums.length);
    
    if (Array.isArray(prismaMigrations)) {
      console.log('\nPrisma migrations:');
      prismaMigrations.forEach(m => console.log('  ' + m.migration_name + ' | ' + (m.rolled_back_at ? 'ROLLED BACK' : 'APPLIED') + ' | steps:' + m.applied_steps_count));
      console.log('\nLast migration:', prismaMigrations[0]?.migration_name || 'NONE');
    }
    
  } catch(err) {
    console.error('ERROR:', err.message);
  } finally {
    await pool.end();
  }
}

run();
