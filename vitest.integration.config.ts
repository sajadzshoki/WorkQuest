import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitest/config'

/**
 * Integration suite: boots the real dev server against the real database and
 * drives the API over HTTP (`test/integration`).
 *
 *   npm run test:integration
 *
 * Kept in its own config because it is slow, needs a reachable PostgreSQL and
 * must not run in parallel with itself (it owns the OTP cooldowns and the
 * `integration-signup-co` tenant).
 */
export default defineConfig({
  resolve: {
    alias: {
      '#shared': fileURLToPath(new URL('./shared', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['test/integration/**/*.test.ts'],
    fileParallelism: false,
    testTimeout: 60_000,
    hookTimeout: 200_000,
  },
})
