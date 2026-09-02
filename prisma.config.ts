import 'dotenv/config'

import { defineConfig } from 'prisma/config'

/**
 * Prisma 7 configuration.
 *
 * Since Prisma 7 the CLI no longer reads the datasource URL from schema.prisma
 * and no longer auto-loads `.env`; both are handled here.
 *
 * `datasource.url` is only declared when DATABASE_URL is present so that
 * DB-less commands (`prisma generate`, `prisma validate`, `prisma format`)
 * keep working in CI and in a fresh clone.
 *
 * The runtime client is created separately in `server/utils/db.ts` with the
 * `@prisma/adapter-pg` driver adapter (Prisma 7 requires a driver adapter).
 */
const databaseUrl = process.env.DATABASE_URL

export default defineConfig({
  schema: 'prisma/schema.prisma',

  ...(databaseUrl ? { datasource: { url: databaseUrl } } : {}),

  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
})
