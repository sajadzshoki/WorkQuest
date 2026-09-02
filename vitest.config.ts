import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitest/config'

/**
 * Unit tests for the framework-free layers (`shared/**`, `server/utils/crypto`).
 * They need no database and no server, so `npm test` stays fast.
 *
 * Tests that boot the app and a real PostgreSQL live in `test/integration` and
 * run through `npm run test:integration` (see `vitest.integration.config.ts`).
 */
export default defineConfig({
  resolve: {
    alias: {
      '#shared': fileURLToPath(new URL('./shared', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
    exclude: ['test/integration/**', 'node_modules/**'],
  },
})
