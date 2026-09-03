// -----------------------------------------------------------------------------
// Local PostgreSQL for development and the integration suite — no Docker.
//
//   node scripts/local-db.mjs            # fixed port 5433, persisted in .data/
//   node scripts/local-db.mjs --reset    # wipe .data/ and start fresh
//   node scripts/local-db.mjs -p 5434 -d file://.data/dev
//
// PGlite is the same PostgreSQL engine Prisma bundles for `prisma dev`, served
// here over a real TCP socket by `@electric-sql/pglite-socket` so the standard
// `pg` driver (and therefore `@prisma/adapter-pg`) can talk to it. Unlike
// `prisma dev` it binds a *fixed* port, which is what makes the integration
// runner (`scripts/run-integration-local.sh`) a single, repeatable command.
//
// The data directory lives under `.data/` (git-ignored). `pgcrypto` is loaded
// so the migrations' `gen_random_uuid()` backfill works exactly as it does on
// a managed PostgreSQL.
// -----------------------------------------------------------------------------
import { mkdirSync, rmSync } from 'node:fs'
import { parseArgs } from 'node:util'

import { PGlite } from '@electric-sql/pglite'
import { PGLiteSocketServer } from '@electric-sql/pglite-socket'

const args = parseArgs({
  options: {
    port: { type: 'string', short: 'p', default: '5433' },
    host: { type: 'string', short: 'h', default: '127.0.0.1' },
    db: { type: 'string', short: 'd', default: 'file://.data/pglite' },
    reset: { type: 'boolean', default: false },
    maxConnections: { type: 'string', short: 'm', default: '8' },
  },
})

const port = Number(args.values.port)
const host = args.values.host
const maxConnections = Number(args.values.maxConnections)
const dbPath = args.values.db

// A file-backed PGlite wants a directory that exists. `memory://` needs none.
const dir = dbPath.startsWith('file://') ? dbPath.slice('file://'.length) : null
if (dir) {
  if (args.values.reset) rmSync(dir, { recursive: true, force: true })
  mkdirSync(dir, { recursive: true })
}

const pgcrypto = (await import('@electric-sql/pglite/contrib/pgcrypto')).pgcrypto

const db = new PGlite(dbPath, { extensions: { pgcrypto } })
await db.waitReady

const server = new PGLiteSocketServer({ db, host, port, maxConnections })

server.addEventListener('listening', () => {
  console.log(`WorkQuest local PostgreSQL listening on ${host}:${port}`)
  console.log(`DATABASE_URL="postgres://postgres:postgres@${host}:${port}/postgres"`)
})

server.addEventListener('error', (event) => {
  console.error('PGlite socket error:', event.detail)
})

async function shutdown() {
  console.log('\nShutting down local PostgreSQL…')
  await server.stop()
  await db.close()
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

await server.start()
