const { Pool } = require('pg');
const pool = new Pool({
  host: 'aws-0-eu-central-1.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.jyqaidoamiskfbanawhl',
  password: 'Dd8Kydb7rkjWrmyl',
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 15000,
});

async function main() {
  const client = await pool.connect();
  console.log('Connected.\n');

  // Step A: Drop existing8 tables
  console.log('=== STEP A: Dropping8 prototype tables ===');
  const dropSQL = `
    DROP TABLE IF EXISTS public.categories CASCADE;
    DROP TABLE IF EXISTS public.content_types CASCADE;
    DROP TABLE IF EXISTS public.domains CASCADE;
    DROP TABLE IF EXISTS public.permissions CASCADE;
    DROP TABLE IF EXISTS public.progress_status CASCADE;
    DROP TABLE IF EXISTS public.role_permissions CASCADE;
    DROP TABLE IF EXISTS public.roles CASCADE;
    DROP TABLE IF EXISTS public.tracks CASCADE;
  `;
  try {
    await client.query(dropSQL);
    console.log('✅ All8 tables dropped.\n');
  } catch(err) {
    console.log('❌ Drop failed:', err.message);
    client.release();
    await pool.end();
    process.exit(1);
  }

  // Verify they're gone
  const checkRes = await client.query(`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  `);
  const remaining = checkRes.rows.map(r => r.tablename);
  console.log('Remaining public tables (' + remaining.length + '):', remaining.length > 0 ? remaining.join(', ') : '(none)');

  // Step B: Read and apply migration.sql
  console.log('\n=== STEP B: Applying migration.sql ===');
  const fs = require('fs');
  const migrationSQL = fs.readFileSync(__dirname + '/prisma/migrations/20260730_uuid_migration/migration.sql', 'utf-8');
  
  try {
    await client.query(migrationSQL);
    console.log('✅ migration.sql applied successfully.\n');
  } catch(err) {
    console.log('❌ Migration failed:', err.message);
    client.release();
    await pool.end();
    process.exit(1);
  }

  // Step C: Validation
  console.log('=== STEP C: Validation ===');

  // C1:16 tables
  const tablesRes = await client.query(`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename
  `);
  const tables = tablesRes.rows.map(r => r.tablename);
  console.log('Tables (' + tables.length + '):', tables.join(', '));
  const expectedTables = ['audit_logs','categories','content','content_prerequisites','content_types','content_versions','domains','permissions','profiles','progress_status','role_permissions','roles','tracks','user_content_progress','user_roles','user_tracks'];
  const missing = expectedTables.filter(t => !tables.includes(t));
  const extra = tables.filter(t => !expectedTables.includes(t));
  if (missing.length === 0 && extra.length === 0) {
    console.log('✅ All16 expected tables present, no extras.');
  } else {
    if (missing.length > 0) console.log('❌ Missing tables:', missing.join(', '));
    if (extra.length > 0) console.log('⚠️ Extra tables:', extra.join(', '));
  }

  // C2: UUID PKs
  const pkRes = await client.query(`
    SELECT kcu.table_name, c.data_type
    FROM information_schema.key_column_usage kcu
    JOIN information_schema.columns c ON c.table_schema = kcu.table_schema AND c.table_name = kcu.table_name AND c.column_name = kcu.column_name
    WHERE kcu.constraint_name LIKE '%_pkey' AND kcu.table_schema = 'public'
    ORDER BY kcu.table_name
  `);
  const nonUUID = pkRes.rows.filter(r => r.data_type !== 'uuid');
  if (nonUUID.length === 0) {
    console.log('✅ All PKs are UUID type.');
  } else {
    console.log('❌ Non-UUID PKs:', nonUUID.map(r => r.table_name + ':' + r.data_type).join(', '));
  }

  // C3: auth.users FK on profiles
  const fkRes = await client.query(`
    SELECT tc.constraint_name, tc.table_name, ccu.table_name AS foreign_table
    FROM information_schema.table_constraints tc
    JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public'
    AND ccu.table_schema = 'auth'
  `);
  if (fkRes.rows.length > 0 && fkRes.rows[0].foreign_table === 'users') {
    console.log('✅ auth.users FK on profiles confirmed: ' + fkRes.rows[0].constraint_name);
  } else {
    console.log('❌ auth.users FK missing or wrong!');
  }

  // C4: Triggers
  const trigRes = await client.query(`
    SELECT trigger_name, event_object_table, action_timing, event_manipulation
    FROM information_schema.triggers
    WHERE trigger_schema = 'public' AND trigger_name NOT LIKE 'RI_ConstraintTrigger%'
    ORDER BY trigger_name
  `);
  console.log('Triggers (' + trigRes.rows.length + '):');
  trigRes.rows.forEach(t => console.log('  ' + t.trigger_name + ' ON ' + t.event_object_table + ' ' + t.action_timing + ' ' + t.event_manipulation));
  const expectedTriggers = ['on_auth_user_created', 'on_content_updated'];
  const foundTriggers = trigRes.rows.map(t => t.trigger_name);
  const missingTrig = expectedTriggers.filter(t => !foundTriggers.includes(t));
  if (missingTrig.length === 0) {
    console.log('✅ All expected triggers present.');
  } else {
    console.log('❌ Missing triggers:', missingTrig.join(', '));
  }

  // C5: RLS
  const rlsRes = await client.query(`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND rowsecurity = true ORDER BY tablename
  `);
  console.log('RLS-enabled tables (' + rlsRes.rows.length + '):', rlsRes.rows.map(r => r.tablename).join(', '));
  const nonRLS = tables.filter(t => !rlsRes.rows.map(r => r.tablename).includes(t));
  if (nonRLS.length === 0) {
    console.log('✅ All public tables have RLS enabled.');
  } else {
    console.log('❌ Tables without RLS:', nonRLS.join(', '));
  }

  // C6: Policies
  const polRes = await client.query(`
    SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename, policyname
  `);
  console.log('Policies (' + polRes.rows.length + '):');
  polRes.rows.forEach(p => console.log('  ' + p.policyname + ' ON ' + p.tablename));

  // C7: Functions
  const funcRes = await client.query(`
    SELECT routine_name FROM information_schema.routines WHERE specific_schema = 'public' AND routine_type = 'FUNCTION' ORDER BY routine_name
  `);
  console.log('Functions (' + funcRes.rows.length + '):', funcRes.rows.map(r => r.routine_name).join(', '));
  const expectedFuncs = ['handle_content_version_snapshot', 'handle_new_user', 'has_role'];
  const foundFuncs = funcRes.rows.map(r => r.routine_name);
  const missingFuncs = expectedFuncs.filter(f => !foundFuncs.includes(f));
  if (missingFuncs.length === 0) {
    console.log('✅ All expected functions present.');
  } else {
    console.log('❌ Missing functions:', missingFuncs.join(', '));
  }

  // Summary
  const summary = {
    tables_ok: missing.length === 0 && extra.length === 0,
    pks_uuid: nonUUID.length === 0,
    auth_fk_ok: fkRes.rows.length > 0,
    triggers_ok: missingTrig.length === 0,
    rls_ok: nonRLS.length === 0,
    policies_count: polRes.rows.length,
    functions_ok: missingFuncs.length === 0,
  };
  const allOk = Object.values(summary).every(v => typeof v === 'boolean' ? v === true : v > 0);

  console.log('\n=== VALIDATION SUMMARY ===');
  console.log('Tables (16/16): ' + (summary.tables_ok ? '✅' : '❌'));
  console.log('UUID PKs: ' + (summary.pks_uuid ? '✅' : '❌'));
  console.log('auth.users FK: ' + (summary.auth_fk_ok ? '✅' : '❌'));
  console.log('Triggers (2/2): ' + (summary.triggers_ok ? '✅' : '❌'));
  console.log('RLS: ' + (summary.rls_ok ? '✅' : '❌'));
  console.log('Policies: ' + summary.policies_count);
  console.log('Functions (3/3): ' + (summary.functions_ok ? '✅' : '❌'));
  console.log('\nOVERALL: ' + (allOk ? '✅ ALL PASSED' : '❌ SOME CHECKS FAILED'));

  client.release();
  await pool.end();
}

main().catch(err => {
  console.error('FATAL:', err.message);
  process.exit(1);
});
