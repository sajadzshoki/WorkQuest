#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# Docker-free integration run.
#
#   npm run test:integration:local
#
# Boots a local PostgreSQL (PGlite over a TCP socket), applies the migrations,
# seeds the demo tenants and then runs the full integration suite — the same
# server, database and HTTP surface `npm run test:integration` expects, but
# with nothing to install beyond `npm install`.
#
# PGlite is a single-connection engine multiplexed over the socket, so the
# suite's concurrency tests (e.g. five simultaneous approvals) still pass, but
# this is a *development* database: keep CI on a real PostgreSQL via
# `npm run test:integration` + DATABASE_URL.
# -----------------------------------------------------------------------------
set -euo pipefail

cd "$(dirname "$0")/.."

DB_PORT="${WQ_PGLITE_PORT:-5433}"
export DATABASE_URL="postgres://postgres:postgres@127.0.0.1:${DB_PORT}/postgres"
export NUXT_SESSION_SECRET="${NUXT_SESSION_SECRET:-$(openssl rand -base64 48)}"

echo "→ starting local PostgreSQL on 127.0.0.1:${DB_PORT}"
node scripts/local-db.mjs --port "${DB_PORT}" --reset &
DB_PID=$!

cleanup() {
  echo "→ stopping local PostgreSQL (pid ${DB_PID})"
  kill "${DB_PID}" 2>/dev/null || true
  wait "${DB_PID}" 2>/dev/null || true
}
trap cleanup EXIT

# Wait until the socket accepts a TCP connection.
for _ in $(seq 1 60); do
  if node -e "const s=require('net').connect(${DB_PORT},'127.0.0.1',()=>{s.destroy();process.exit(0)});s.on('error',()=>process.exit(1))" 2>/dev/null; then
    break
  fi
  sleep 0.5
done

echo "→ applying migrations"
node scripts/apply-migrations.mjs

echo "→ seeding demo tenants"
npx tsx prisma/seed.ts

echo "→ running the integration suite"
bash scripts/run-integration.sh
