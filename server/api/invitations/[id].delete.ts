import { requirePermission } from '../../utils/auth'
import { errors } from '../../utils/http'
import { createTenantClient } from '../../utils/tenant'

/**
 * Revoke a pending invitation.
 *
 * OWNER/ADMIN may revoke any of them; a MANAGER may withdraw the ones they
 * sent. The row is kept (status REVOKED, `pendingPhone` cleared) so the
 * history survives and the invitee's accept attempt fails cleanly instead of
 * 404-ing.
 *
 * Clearing `pendingPhone` is what frees the `(companyId, pendingPhone)` unique
 * slot, so the same phone can be invited again later.
 */
export default defineEventHandler(async (event): Promise<{ ok: boolean }> => {
  const auth = requirePermission(event, 'member:invite')
  const id = getRouterParam(event, 'id')
  if (!id) throw errors.notFound('دعوت‌نامه پیدا نشد')

  const db = createTenantClient(auth)

  const invitation = await db.invitation.findUnique({
    where: { id },
    select: { id: true, status: true, invitedById: true, phone: true },
  })
  if (!invitation) throw errors.notFound('دعوت‌نامه پیدا نشد')

  const isAdmin = auth.role === 'OWNER' || auth.role === 'ADMIN'
  if (!isAdmin && invitation.invitedById !== auth.userId) {
    throw errors.forbidden('فقط می‌توانید دعوت‌نامه‌های خودتان را لغو کنید')
  }
  if (invitation.status !== 'PENDING') {
    throw errors.conflict('این دعوت‌نامه قبلاً بسته شده است')
  }

  // Conditional on `status: 'PENDING'` so a concurrent accept cannot be
  // overwritten by a revoke that arrives a moment later.
  const { count } = await db.invitation.updateMany({
    where: { id: invitation.id, status: 'PENDING' },
    data: { status: 'REVOKED', revokedAt: new Date(), pendingPhone: null },
  })
  if (count === 0) throw errors.conflict('این دعوت‌نامه قبلاً بسته شده است')

  await db.auditLog.create({
    data: {
      companyId: auth.companyId,
      actorId: auth.userId,
      action: 'member.invitation_revoke',
      targetType: 'Invitation',
      targetId: invitation.id,
      ip: getRequestIP(event, { xForwardedFor: true }),
    },
  })

  return { ok: true }
})
