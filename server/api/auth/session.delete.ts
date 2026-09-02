import { usePrisma } from '../../utils/db'
import { requireAuth } from '../../utils/auth'
import { clearSessionCookie } from '../../utils/session'

/** Logout: revoke the server-side session row and drop the cookie. */
export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const db = usePrisma()

  await db.session.updateMany({
    where: { id: auth.sessionId, userId: auth.userId },
    data: { revokedAt: new Date() },
  })

  clearSessionCookie(event)
  return { ok: true }
})
