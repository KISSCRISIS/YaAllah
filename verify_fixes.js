const { Pool } = require('pg');
const pool = new Pool({
  host: 'aws-0-eu-central-1.pooler.supabase.com', port: 5432, database: 'postgres',
  user: 'postgres.jyqaidoamiskfbanawhl', password: 'Dd8Kydb7rkjWrmyl',
  ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 15000,
});

async function main() {
  const c = await pool.connect();

  // 1. auth.users FK on profiles
  const fk = await c.query(`SELECT conname, conrelid::regclass AS tbl, confrelid::regclass AS ref_tbl FROM pg_constraint WHERE contype = 'f' AND conrelid = 'public.profiles'::regclass AND confrelid = 'auth.users'::regclass`);
  console.log('=== auth.users FK ===');
  if (fk.rows.length > 0) {
    console.log('✅ FOUND: ' + fk.rows[0].conname + ' | ' + fk.rows[0].tbl + ' → ' + fk.rows[0].ref_tbl);
  } else {
    console.log('❌ NOT FOUND — checking all profiles FKs...');
    const allP = await c.query(`SELECT conname, conrelid::regclass AS tbl, confrelid::regclass AS ref FROM pg_constraint WHERE contype = 'f' AND conrelid = 'public.profiles'::regclass`);
    console.log('  Profiles FKs: ' + (allP.rows.length === 0 ? 'NONE' : allP.rows.map(r => r.conname + '→' + r.ref).join(', ')));
  }

  // 2. Trigger on auth.users
  const trig = await c.query(`SELECT trigger_name, event_object_schema, event_object_table, action_timing, event_manipulation FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created'`);
  console.log('\n=== on_auth_user_created trigger ===');
  if (trig.rows.length > 0) {
    const t = trig.rows[0];
    console.log('✅ FOUND: ' + t.trigger_name + ' ON ' + t.event_object_schema + '.' + t.event_object_table + ' ' + t.action_timing + ' ' + t.event_manipulation);
  } else {
    console.log('❌ NOT FOUND — listing all non-system triggers on auth...');
    const allT = await c.query(`SELECT trigger_name, event_object_table FROM information_schema.triggers WHERE trigger_schema = 'auth' AND trigger_name NOT LIKE 'RI_%'`);
    console.log('  Auth triggers: ' + (allT.rows.length === 0 ? 'NONE' : allT.rows.map(r => r.trigger_name).join(', ')));
  }

  // 3. All public FKs
  const allFk = await c.query(`SELECT conname, conrelid::regclass::text AS tbl, confrelid::regclass::text AS ref FROM pg_constraint WHERE contype = 'f' AND conrelid::regclass::text LIKE 'public.%' ORDER BY conname`);
  console.log('\n=== All public FKs (' + allFk.rows.length + ') ===');
  allFk.rows.forEach(r => console.log('  ' + r.conname + ': ' + r.tbl + ' → ' + r.ref));

  // 4. _prisma_migrations
  const pm = await c.query(`SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_prisma_migrations') as ex`);
  console.log('\n=== _prisma_migrations ===');
  console.log(pm.rows[0].ex ? 'ALREADY EXISTS' : 'NOT YET — ready for registration');

  // 5. Extensions
  const ext = await c.query(`SELECT extname, extversion FROM pg_extension WHERE extname IN ('pgcrypto','uuid-ossp','plpgsql')`);
  console.log('\n=== Extensions ===');
  ext.rows.forEach(e => console.log('  ' + e.extname + ' v' + e.extversion));

  c.release();
  await pool.end();
}
main().catch(e => { console.error(e.message); process.exit(1); });
