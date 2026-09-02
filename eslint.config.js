import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Project-wide overrides live here. Keep this list short: the generated
  // Nuxt/ESLint config already encodes the Vue + TS + import rules we want.
  {
    rules: {
      // Persian-first UI means long inline strings; keep the formatter opinionated
      // but do not fight it over quote style inside templates.
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'error',
      // `consistent-type-imports` is deliberately left off: with typed linting
      // disabled it cannot tell a type from a value and fails on config files.
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
    },
  },
  {
    // Tests and one-off scripts may import dev tooling.
    files: ['test/**/*.{ts,js}', 'scripts/**/*.{ts,js,mjs}', 'prisma/seed.ts'],
    rules: {
      'no-console': 'off',
    },
  },
)
