import type { Prisma } from '#prisma/client'
import type { AuthContext, CompanySummary, UserSummary } from '#shared/types/api'
import type { Permission, Role } from '#shared/utils/permissions'
import type { H3Event } from 'h3'

import { can } from '#shared/utils/permissions'

import { errors } from './http'
import { usePrisma } from './db'
import { setSessionCookie, signSessionToken } from './session'

/**
 * The auth context is attached by `server/middleware/1.auth-context.ts`.
 * Handlers never parse cookies themselves — that keeps the trust boundary in
 * exactly one place.
 */
export function getAuth(event: H3Event): AuthContext | undefined {
  return event.context.auth as AuthContext | undefined
}

export function requireAuth(event: H3Event): AuthContext {
  const auth = getAuth(event)
  if (!auth) throw errors.unauthorized()
  return auth
}

export function requirePermission(event: H3Event, permission: Permission): AuthContext {
  const auth = requireAuth(event)
  if (!can(auth.role, permission)) throw errors.forbidden()
  return auth
}

/**
 * User ids a manager is allowed to see: their direct reports, transitively.
 * OWNER/ADMIN see the whole company, so callers should check `can()` first.
 */
export async function getManagedUserIds(
  companyId: string,
  managerId: string,
): Promise<string[]> {
  const db = usePrisma()
  const rows = await db.teamMember.findMany({
    where: { companyId },
    select: { userId: true, managerId: true },
  })

  const reportsByManager = new Map<string, string[]>()
  for (const row of rows) {
    if (!row.managerId) continue
    const list = reportsByManager.get(row.managerId) ?? []
    list.push(row.userId)
    reportsByManager.set(row.managerId, list)
  }

  const seen = new Set<string>()
  const queue = [...(reportsByManager.get(managerId) ?? [])]
  while (queue.length > 0) {
    const id = queue.shift()
    if (!id || seen.has(id)) continue
    seen.add(id)
    for (const next of reportsByManager.get(id) ?? []) {
      if (!seen.has(next)) queue.push(next)
    }
  }

  return [...seen]
}

/**
 * Resolve the user ids visible to the caller for the requested scope.
 * `null` means "the whole company" (OWNER/ADMIN).
 */
export async function resolveVisibleUserIds(
  auth: AuthContext,
  scope: 'mine' | 'team' | 'all',
): Promise<string[] | null> {
  if (scope === 'all') {
    if (!can(auth.role, 'task:read:all')) throw errors.forbidden()
    return null
  }
  if (scope === 'team') {
    if (!can(auth.role, 'task:read:team')) throw errors.forbidden()
    return getManagedUserIds(auth.companyId, auth.userId)
  }
  return [auth.userId]
}

// ---------------------------------------------------------------------------
// Session issuance
// ---------------------------------------------------------------------------

/** The user shape needed to open a session — a plain `User` row satisfies it. */
export interface SessionSubject {
  id: string
  companyId: string
  role: Role
}

export interface IssuedSession {
  sessionId: string
  token: string
  expiresAt: Date
}

/**
 * Open a session for an already-authenticated subject.
 *
 * One code path for every entry point (OTP login, onboarding, future invite
 * acceptance) so the JWT claims, the revocable `Session` row and the audit
 * entry can never drift apart.
 *
 * @param tx an optional transaction — onboarding passes one so the company and
 *   its owner's first session commit together.
 */
export async function issueSession(
  event: H3Event,
  subject: SessionSubject,
  tx?: Prisma.TransactionClient,
): Promise<IssuedSession> {
  const db = tx ?? usePrisma()
  const ip = getRequestIP(event, { xForwardedFor: true })
  const userAgent = getHeader(event, 'user-agent')
  const expiresAt = new Date(Date.now() + Number(useRuntimeConfig().sessionMaxAgeSeconds) * 1000)

  const session = await db.session.create({
    data: { userId: subject.id, expiresAt, ip, userAgent },
  })

  await db.user.update({ where: { id: subject.id }, data: { lastLoginAt: new Date() } })
  await db.auditLog.create({
    data: {
      companyId: subject.companyId,
      actorId: subject.id,
      action: 'auth.login',
      targetType: 'Session',
      targetId: session.id,
      ip,
    },
  })

  const token = await signSessionToken({
    sub: subject.id,
    sid: session.id,
    cid: subject.companyId,
    role: subject.role,
  })

  return { sessionId: session.id, token, expiresAt }
}

/** Write the session cookie for a freshly issued token. */
export function startSession(event: H3Event, issued: IssuedSession): void {
  setSessionCookie(event, issued.token)
}

// ---------------------------------------------------------------------------
// Response mapping
// ---------------------------------------------------------------------------

/** Shape a `User` row must have to be mapped for the client. */
export interface UserRow {
  id: string
  fullName: string
  email: string | null
  phone: string | null
  role: Role
  avatarUrl: string | null
  locale: string
  jobTitle: string | null
}

/** Shape a `Company` row must have to be mapped for the client. */
export interface CompanyRow {
  id: string
  name: string
  slug: string
  logoUrl: string | null
  locale: string
  timezone: string
}

/**
 * Client-facing projections.
 *
 * Explicit field lists rather than object spreads: a new column on `User` or
 * `Company` must never reach the browser just because it was added.
 */
export function toUserSummary(user: UserRow): UserSummary {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    avatarUrl: user.avatarUrl,
    locale: user.locale,
    jobTitle: user.jobTitle,
  }
}

export function toCompanySummary(company: CompanyRow): CompanySummary {
  return {
    id: company.id,
    name: company.name,
    slug: company.slug,
    logoUrl: company.logoUrl,
    locale: company.locale,
    timezone: company.timezone,
  }
}
