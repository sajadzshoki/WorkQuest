import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitest/config'

/**
 * Unit tests for the pure, framework-free layer (`shared/**`).
 * Handler tests that need a database belong in a separate integration suite —
 * see the roadmap in README.md.
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
  },
})
