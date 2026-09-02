import type { Pool } from 'pg'

import 'dotenv/config'
import pg from 'pg'

/**
 * Direct database access for the integration suite.
 *
 * Only used to put the system into states the HTTP API cannot reach on its own
 * — an expired code, an account created mid-flow — and to assert on rows the
 * API deliberately does not expose.
 */
let pool: Pool | undefined

export function db(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) throw new Error('DATABASE_URL is not set for the integration suite')
    pool = new pg.Pool({ connectionString, max: 3 })
  }
  return pool
}

export async function closeDb(): Promise<void> {
  await pool?.end()
  pool = undefined
}

export async function query<T extends pg.QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  const result = await db().query<T>(text, params)
  return result.rows
}

/** Force a pending code to expire, as the clock would. */
export async function expireOtp(phone: string): Promise<void> {
  await db().query(
    `UPDATE "OtpCode" SET "expiresAt" = now() - interval '1 second'
     WHERE phone = $1 AND "consumedAt" IS NULL`,
    [phone],
  )
}

export async function otpAttempts(phone: string): Promise<number> {
  const rows = await query<{ attempts: number }>(
    `SELECT attempts FROM "OtpCode" WHERE phone = $1 ORDER BY "createdAt" DESC LIMIT 1`,
    [phone],
  )
  return rows[0]?.attempts ?? -1
}

export async function otpConsumed(phone: string): Promise<boolean> {
  const rows = await query<{ consumed: boolean }>(
    `SELECT ("consumedAt" IS NOT NULL) AS consumed FROM "OtpCode"
     WHERE phone = $1 ORDER BY "createdAt" DESC LIMIT 1`,
    [phone],
  )
  return rows[0]?.consumed ?? false
}

export async function onboardingTicketConsumed(phone: string): Promise<boolean> {
  const rows = await query<{ consumed: boolean }>(
    `SELECT ("consumedAt" IS NOT NULL) AS consumed FROM "OnboardingTicket"
     WHERE phone = $1 ORDER BY "createdAt" DESC LIMIT 1`,
    [phone],
  )
  return rows[0]?.consumed ?? false
}

/**
 * Create an ACTIVE account for a phone that already holds an unconsumed
 * REGISTER code — the race the verify handler defends against.
 */
export async function seedAccountForPhone(
  phone: string,
  name: string,
): Promise<{ companyId: string, userId: string }> {
  const slug = `race-${phone.replace(/\D/g, '').slice(-8)}`
  const company = await query<{ id: string }>(
    `INSERT INTO "Company" (id, name, slug, locale, timezone, "isActive", "createdAt", "updatedAt")
     VALUES (gen_random_uuid(), $1, $2, 'fa', 'Asia/Tehran', true, now(), now())
     RETURNING id`,
    [name, slug],
  )
  const companyId = company[0]!.id

  const user = await query<{ id: string }>(
    `INSERT INTO "User" (id, "companyId", phone, "fullName", role, status, locale, "createdAt", "updatedAt")
     VALUES (gen_random_uuid(), $1, $2, $3, 'EMPLOYEE', 'ACTIVE', 'fa', now(), now())
     RETURNING id`,
    [companyId, phone, name],
  )

  return { companyId, userId: user[0]!.id }
}

export async function countCompanyTasks(companyId: string): Promise<number> {
  const rows = await query<{ n: number }>(
    `SELECT count(*)::int AS n FROM "Task" WHERE "companyId" = $1`,
    [companyId],
  )
  return rows[0]?.n ?? 0
}

export async function cleanupCompany(companyId: string): Promise<void> {
  await db().query(`DELETE FROM "Company" WHERE id = $1`, [companyId])
}
