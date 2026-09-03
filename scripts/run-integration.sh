#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# Integration suite runner.
#
# Boots the real dev server against the configured database, waits until it
# answers /api/health, then runs the Vitest integration config against it and
# always shuts the server down again.
#
# The server is started here rather than from inside Vitest: a spawned `npx nuxt
# dev` answers HTTP but its stdout does not reliably reach a Node worker in this
# environment, and the suite needs that output to read the OTP codes the
# `console` provider prints. Shell redirection does not have that problem.
#
#   npm run test:integration
#
# Requires DATABASE_URL (a .env is loaded by the server itself).
# -----------------------------------------------------------------------------
set -euo pipefail

cd "$(dirname "$0")/.."

PORT="${TEST_PORT:-3100}"
LOG="$(mktemp -t workquest-integration.XXXXXX.log)"
PIDFILE="$(mktemp -t workquest-integration.XXXXXX.pid)"

cleanup() {
  if [[ -s "$PIDFILE" ]]; then
    local pid
    pid="$(cat "$PIDFILE")"
    # Negative pid: the whole process group, including the forked Nitro worker.
    kill -TERM "-$pid" 2>/dev/null || kill -TERM "$pid" 2>/dev/null || true
    sleep 1
    kill -KILL "-$pid" 2>/dev/null || kill -KILL "$pid" 2>/dev/null || true
  fi
  rm -f "$PIDFILE"
  if [[ "${KEEP_INTEGRATION_LOG:-0}" != "1" ]]; then
    rm -f "$LOG"
  else
    echo "server log kept at $LOG"
  fi
}
trap cleanup EXIT

# A separate build dir keeps this instance off the preview server's .nuxt.
export NUXT_BUILD_DIR="${NUXT_BUILD_DIR:-.nuxt-test}"
export NUXT_SECURE_COOKIES=false
export NUXT_OTP_PROVIDER=console
# The dev database (`prisma dev`) allows ~10 connections in total, and this
# suite opens its own pool alongside the server's. Leaving the server at its
# default would exhaust the server mid-run and surface as "server has closed
# the connection" on whichever endpoint happens to fan out the widest.
export NUXT_DB_POOL_MAX="${NUXT_DB_POOL_MAX:-5}"
# Two seconds instead of 90 so the cooldown assertion does not stall the suite.
export NUXT_OTP_RESEND_COOLDOWN_SECONDS="${NUXT_OTP_RESEND_COOLDOWN_SECONDS:-2}"
# The per-IP cap is a production abuse guard; in tests every request comes from
# 127.0.0.1 and it would trip long before the suite finished. 0 disables it.
export NUXT_OTP_MAX_REQUESTS_PER_IP_PER_HOUR="${NUXT_OTP_MAX_REQUESTS_PER_IP_PER_HOUR:-0}"

echo "→ starting dev server on 127.0.0.1:${PORT} (log: ${LOG})"
setsid npx nuxt dev --host 127.0.0.1 --port "${PORT}" >> "${LOG}" 2>&1 &
echo $! > "${PIDFILE}"

echo "→ waiting for /api/health"
for _ in $(seq 1 180); do
  if curl -fsS "http://127.0.0.1:${PORT}/api/health" >/dev/null 2>&1; then
    echo "→ server is up"
    WORKQUEST_TEST_URL="http://127.0.0.1:${PORT}" \
    WORKQUEST_TEST_LOG="${LOG}" \
      npx vitest run --config vitest.integration.config.ts
    exit $?
  fi
  sleep 1
done

echo "✗ dev server never became healthy; last log lines:" >&2
tail -40 "${LOG}" >&2
exit 1
