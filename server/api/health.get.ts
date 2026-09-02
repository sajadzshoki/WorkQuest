import { databaseUrl } from '../utils/db'

/**
 * Liveness + dependency probe. Public so load balancers can reach it.
 * Never throws: a degraded database is reported, not a 500.
 */
export default defineEventHandler(async () => {
  const startedAt = Date.now()

  let database: 'up' | 'down' = 'down'
  let databaseError: string | undefined

  if (!databaseUrl()) {
    databaseError = 'DATABASE_URL is not set'
  }
  else {
    try {
      const db = usePrisma()
      await db.$queryRaw`SELECT 1`
      database = 'up'
    }
    catch (error) {
      databaseError = error instanceof Error ? error.message : 'unknown database error'
    }
  }

  return {
    status: database === 'up' ? 'ok' : 'degraded',
    service: 'workquest',
    version: useRuntimeConfig().public.appVersion ?? '0.1.0',
    database,
    databaseError,
    latencyMs: Date.now() - startedAt,
    time: new Date().toISOString(),
  }
})
