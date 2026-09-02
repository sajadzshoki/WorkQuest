import { PrismaPg } from '@prisma/adapter-pg'

import { PrismaClient } from '#prisma/client'

/**
 * Single Prisma client per Nitro worker.
 *
 * Prisma 7 requires a driver adapter, so the connection is created from
 * `@prisma/adapter-pg` (Node `pg` pool). Pool tuning lives here rather than in
 * the connection string because driver adapters no longer read pool parameters
 * from query strings.
 */
let cachedClient: PrismaClient | undefined

export function databaseUrl(): string | undefined {
  const config = useRuntimeConfig()
  const fromConfig = typeof config.databaseUrl === 'string' ? config.databaseUrl.trim() : ''
  const fromEnv = (process.env.DATABASE_URL ?? '').trim()
  return fromConfig || fromEnv || undefined
}

export function usePrisma(): PrismaClient {
  if (cachedClient) return cachedClient

  const url = databaseUrl()
  if (!url) {
    throw new Error(
      'WorkQuest: DATABASE_URL is not set. Copy .env.example to .env and configure a PostgreSQL connection.',
    )
  }

  cachedClient = new PrismaClient({
    adapter: new PrismaPg({
      connectionString: url,
      max: 10,
      connectionTimeoutMillis: 5_000,
      idleTimeoutMillis: 30_000,
    }),
    log:
      import.meta.dev
        ? [
            { emit: 'stdout', level: 'warn' },
            { emit: 'stdout', level: 'error' },
          ]
        : [{ emit: 'stdout', level: 'error' }],
  })

  return cachedClient
}

/** Release the pool (used by Nitro's close hook and scripts). */
export async function disconnectPrisma(): Promise<void> {
  await cachedClient?.$disconnect()
  cachedClient = undefined
}
