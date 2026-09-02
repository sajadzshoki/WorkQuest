import type { AuthContext } from '#shared/types/api'
import type { Permission } from '#shared/utils/permissions'
import type { H3Event } from 'h3'

import { can } from '#shared/utils/permissions'

import { errors } from './http'
import { usePrisma } from './db'

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
