const { Pool } = require('pg');
const p = new Pool({
  host:'aws-0-eu-central-1.pooler.supabase.com',port:5432,database:'postgres',
  user:'postgres.jyqaidoamiskfbanawhl',password:'Dd8Kydb7rkjWrmyl',
  ssl:{rejectUnauthorized:false},connectionTimeoutMillis:15000
});
(async()=>{
  const c=await p.connect();
  const r=await c.query(`SELECT conname,conrelid::regclass::text AS tbl,confrelid::regclass::text AS ref FROM pg_constraint WHERE contype='f' ORDER BY conname`);
  console.log('Total FKs: '+r.rows.length);
  r.rows.forEach(x=>console.log('  '+x.conname+': '+x.tbl+' → '+x.ref));
  c.release();await p.end();
})();
