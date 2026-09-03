import 'dotenv/config'; import pg from 'pg'; import { readdirSync, readFileSync } from 'node:fs'
const c = new pg.Client({ connectionString: process.env.DATABASE_URL }); await c.connect()
await c.query(`CREATE TABLE IF NOT EXISTS "_prisma_migrations" (id varchar(36) PRIMARY KEY, checksum varchar(64) NOT NULL, finished_at timestamptz, migration_name varchar(255) NOT NULL, logs text, rolled_back_at timestamptz, started_at timestamptz NOT NULL DEFAULT now(), applied_steps_count int NOT NULL DEFAULT 0)`)
const done = new Set((await c.query('SELECT migration_name FROM "_prisma_migrations" WHERE finished_at IS NOT NULL')).rows.map(r=>r.migration_name))
for (const dir of readdirSync('prisma/migrations').filter(d=>!d.endsWith('.toml')).sort()) {
  if (done.has(dir)) { console.log('skip', dir); continue }
  const sql = readFileSync(`prisma/migrations/${dir}/migration.sql`,'utf8')
  console.log('apply', dir)
  await c.query(sql)
  await c.query('INSERT INTO "_prisma_migrations" (id, checksum, migration_name, finished_at, applied_steps_count) VALUES ($1,$2,$3,now(),1)', [crypto.randomUUID(), 'manual', dir])
}
await c.end(); console.log('ok')
