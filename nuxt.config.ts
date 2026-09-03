import { fileURLToPath } from 'node:url'

import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({

  modules: ['@nuxt/ui', '@nuxt/icon', '@nuxtjs/i18n', '@nuxt/eslint'],
  ssr: true,

  devtools: { enabled: true },

  app: {
    head: {
      // i18n owns lang/dir per-locale; this is the SSR-safe default for fa.
      htmlAttrs: { lang: 'fa', dir: 'rtl' },
      titleTemplate: '%s — ورک‌کوئست',
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#4f46e5' },
        { name: 'color-scheme', content: 'light dark' },
        {
          name: 'description',
          content: 'ورک‌کوئست؛ پلتفرم مدیریت عملکرد کارکنان با لایه‌ی بازی‌وارسازی',
        },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  // ---------------------------------------------------------------------------
  // Nuxt UI (Tailwind CSS v4 underneath). `fonts: false` stops Nuxt UI from
  // bundling Inter; the design system uses Vazirmatn instead.
  // ---------------------------------------------------------------------------
  ui: {
    fonts: false,
  },

  // ---------------------------------------------------------------------------
  // Runtime configuration.
  // Every key is overridable with a NUXT_* environment variable, e.g.
  //   NUXT_SESSION_SECRET, NUXT_OTP_PROVIDER, NUXT_PUBLIC_APP_NAME.
  // Private keys are never exposed to the client bundle.
  // ---------------------------------------------------------------------------
  runtimeConfig: {
    // Server-only
    databaseUrl: '',
    /**
     * Maximum PostgreSQL connections held by this worker's pool.
     *
     * Must be sized against the *server's* `max_connections` divided by the
     * number of workers — not left at a hopeful default. Small local servers
     * (`prisma dev`, a shared pooler) cap out around 10 in total, so anything
     * else connecting concurrently, including the integration suite, has to
     * fit inside the same budget. Override with NUXT_DB_POOL_MAX.
     */
    dbPoolMax: 10,
    sessionSecret: '',
    sessionCookieName: 'workquest_session',
    sessionIssuer: 'workquest',
    sessionMaxAgeSeconds: 60 * 60 * 24 * 7,
    sessionRenewThresholdSeconds: 60 * 60 * 24,
    secureCookies: true,
    otpProvider: 'console',
    otpCodeLength: 6,
    otpTtlSeconds: 120,
    otpMaxAttempts: 5,
    otpResendCooldownSeconds: 90,
    /** Rolling per-IP cap on OTP requests (0 disables the check). */
    otpMaxRequestsPerIpPerHour: 30,
    otpHttpUrl: '',
    otpHttpApiKey: '',
    otpHttpTemplate: '',
    /** How long a verified phone may take to finish creating its company. */
    onboardingTicketTtlSeconds: 60 * 15,
    bootstrapAdminPhone: '',

    // Public (NUXT_PUBLIC_*)
    public: {
      appName: 'ورک‌کوئست',
      appUrl: 'http://localhost:3000',
      appVersion: '0.1.0',
      defaultLocale: 'fa',
      supportEmail: 'support@workquest.local',
    },
  },

  // Overridable so the integration suite can boot a second dev server next to
  // the one used for the live preview without the two fighting over `.nuxt`.
  buildDir: process.env.NUXT_BUILD_DIR || '.nuxt',

  // ---------------------------------------------------------------------------
  // Aliases. `#prisma/client` points at the generated Prisma client
  // (see prisma/schema.prisma). Vazirmatn itself is self-hosted from
  // node_modules via @fontsource-variable/vazirmatn, imported in
  // app/assets/css/main.css — no font CDN is contacted at build or run time.
  // ---------------------------------------------------------------------------
  alias: {
    '#prisma/client': fileURLToPath(new URL('./prisma/generated/prisma/client.ts', import.meta.url)),
  },

  routeRules: {
    '/': { prerender: false },
  },
  compatibilityDate: '2026-09-02',

  nitro: {
    // Every API error is serialised through one handler (server/utils/error-handler.ts).
    errorHandler: fileURLToPath(new URL('./server/utils/error-handler.ts', import.meta.url)),
    experimental: { asyncContext: true },
    routeRules: {
      '/api/**': {
        cors: false,
        headers: {
          'cache-control': 'no-store',
          'x-content-type-options': 'nosniff',
        },
      },
    },
  },

  vite: {
    server: {
      // The dev server must answer to any host so it can be previewed/proxied.
      allowedHosts: true,
    },
  },

  // ---------------------------------------------------------------------------
  // TypeScript — strict everywhere (app, server, shared).
  // ---------------------------------------------------------------------------
  typescript: {
    strict: true,
    typeCheck: false,
    tsConfig: {
      compilerOptions: {
        noUncheckedIndexedAccess: true,
        noImplicitOverride: true,
        noFallthroughCasesInSwitch: true,
        forceConsistentCasingInFileNames: true,
      },
    },
  },

  eslint: {
    config: {
      stylistic: {
        quotes: 'single',
        semi: false,
      },
    },
  },

  // ---------------------------------------------------------------------------
  // i18n — Persian first, RTL by default. English is wired but secondary.
  // ---------------------------------------------------------------------------
  i18n: {
    defaultLocale: 'fa',
    strategy: 'prefix_except_default',
    langDir: 'locales',
    locales: [
      { code: 'fa', language: 'fa-IR', name: 'فارسی', dir: 'rtl', file: 'fa.json' },
      { code: 'en', language: 'en-US', name: 'English', dir: 'ltr', file: 'en.json' },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'workquest_locale',
      fallbackLocale: 'fa',
      redirectOn: 'root',
    },
    compilation: {
      strictMessage: false,
    },
  },
})
