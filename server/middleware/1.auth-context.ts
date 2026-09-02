import type { AuthContext } from '#shared/types/api'
import { isRole } from '#shared/utils/permissions'

import { usePrisma } from '../utils/db'
import { errors } from '../utils/http'
import { readSessionToken, setSessionCookie, tokenNeedsRenewal, signSessionToken, verifySessionToken } from '../utils/session'

/** Routes that must be reachable without a session. */
const PUBLIC_API_PREFIXES = ['/api/auth/otp/', '/api/health']

function isPublicApiRoute(path: string): boolean {
  return PUBLIC_API_PREFIXES.some(prefix => path.startsWith(prefix))
}

/**
 * Resolves the session cookie into `event.context.auth`.
 *
 * Runs for `/api/**` only; page rendering decides separately through route
 * middleware. Failures are 401s, never redirects, so the client can react.
 */
export default defineEventHandler(async (event) => {
  const path = event.path ?? '/'
  if (!path.startsWith('/api/')) return
  if (isPublicApiRoute(path)) return

  const token = readSessionToken(event)
  if (!token) throw errors.unauthorized()

  const claims = await verifySessionToken(token)
  if (!claims) throw errors.unauthorized('نشست شما منقضی شده است')

  const db = usePrisma()
  const [user, session] = await Promise.all([
    db.user.findFirst({
      where: { id: claims.sub, status: 'ACTIVE' },
      include: { company: true },
    }),
    db.session.findFirst({ where: { id: claims.sid, revokedAt: null } }),
  ])

  if (!user || !user.company.isActive || !session) {
    throw errors.unauthorized('نشست شما معتبر نیست')
  }

  if (!isRole(claims.role) || claims.role !== user.role) {
    // Role changed since the token was issued — force a re-login.
    throw errors.unauthorized('نقش کاربری شما تغییر کرده است')
  }

  const auth: AuthContext = {
    userId: user.id,
    sessionId: session.id,
    companyId: user.companyId,
    role: user.role,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    locale: user.locale,
    avatarUrl: user.avatarUrl,
    company: {
      id: user.company.id,
      name: user.company.name,
      slug: user.company.slug,
      locale: user.company.locale,
      timezone: user.company.timezone,
    },
  }

  event.context.auth = auth

  // Sliding expiry: re-sign when the token enters the renewal window.
  if (tokenNeedsRenewal(token)) {
    const renewed = await signSessionToken({
      sub: auth.userId,
      sid: auth.sessionId,
      cid: auth.companyId,
      role: auth.role,
    })
    setSessionCookie(event, renewed)
  }
})
