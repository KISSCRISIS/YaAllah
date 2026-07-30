const { Pool } = require('pg');
const pool = new Pool({
  host: 'aws-0-eu-central-1.pooler.supabase.com', port: 5432, database: 'postgres',
  user: 'postgres.jyqaidoamiskfbanawhl', password: 'Dd8Kydb7rkjWrmyl',
  ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 15000,
});

async function main() {
  const c = await pool.connect();
  console.log('=== FINAL VALIDATION ===\n');

  // Tables
  const t = await c.query(`SELECT count(*) FROM pg_tables WHERE schemaname='public'`);
  console.log('1. Tables: ' + t.rows[0].count + '/16');

  // Row counts
  const check = ['domains','tracks','roles','permissions','role_permissions','content_types','progress_status'];
  for (const tbl of check) {
    const r = await c.query(`SELECT count(*) FROM public."${tbl}"`);
    console.log('   ' + tbl + ': ' + r.rows[0].count + ' rows');
  }

  // UUID check samples
  const dom = await c.query(`SELECT id FROM public.domains LIMIT 1`);
  console.log('\n2. UUID PK test: ' + (dom.rows[0]?.id ? '✅ ' + dom.rows[0].id : '❌'));

  // auth FK
  const fk = await c.query(`SELECT conname FROM pg_constraint WHERE contype='f' AND conrelid='public.profiles'::regclass AND confrelid='auth.users'::regclass`);
  console.log('3. auth.users FK: ' + (fk.rows[0]?.conname || '❌'));

  // Triggers
  const trig = await c.query(`SELECT count(*) FROM information_schema.triggers WHERE trigger_name IN ('on_auth_user_created','on_content_updated')`);
  console.log('4. Triggers: ' + trig.rows[0].count + '/2');

  // RLS
  const rls = await c.query(`SELECT count(*) FROM pg_tables WHERE schemaname='public' AND rowsecurity=true`);
  console.log('5. RLS tables: ' + rls.rows[0].count + '/16');

  // Policies
  const pol = await c.query(`SELECT count(*) FROM pg_policies WHERE schemaname='public'`);
  console.log('6. Policies: ' + pol.rows[0].count);

  // Functions
  const func = await c.query(`SELECT count(*) FROM information_schema.routines WHERE specific_schema='public' AND routine_type='FUNCTION'`);
  console.log('7. Functions: ' + func.rows[0].count + '/3');

  // _prisma_migrations
  const pm = await c.query(`SELECT count(*) FROM public._prisma_migrations`);
  console.log('8. Migration records: ' + pm.rows[0].count);

  c.release();
  await pool.end();
  console.log('\n✅ FINAL VALIDATION COMPLETE');
}
main().catch(e => { console.error(e.message); process.exit(1); });
