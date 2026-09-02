import { requirePermission } from '../../utils/auth'
import { errors } from '../../utils/http'
import { createTenantClient } from '../../utils/tenant'

/**
 * Remove a member from the company.
 *
 * Soft-removal: the user is marked DEACTIVATED, their team membership is
 * dropped and their live sessions are revoked. Hard-deleting the row would
 * orphan the tasks, reviews and XP ledger that reference it, and would make
 * the company impossible to audit afterwards.
 *
 * OWNER/ADMIN only (`member:manage`), never on yourself, and never on the last
 * active owner — that would leave the tenant with nobody who can administer it.
 */
export default defineEventHandler(async (event): Promise<{ ok: boolean }> => {
  const auth = requirePermission(event, 'member:manage')
  const id = getRouterParam(event, 'id')
  if (!id) throw errors.notFound('کاربر مورد نظر پیدا نشد')
  if (id === auth.userId) throw errors.conflict('امکان حذف حساب خودتان وجود ندارد')

  const db = createTenantClient(auth)

  const target = await db.user.findUnique({
    where: { id },
    select: { id: true, role: true, status: true, fullName: true },
  })
  if (!target) throw errors.notFound('کاربر مورد نظر پیدا نشد')

  if (target.role === 'OWNER') {
    const owners = await db.user.count({ where: { role: 'OWNER', status: { not: 'DEACTIVATED' } } })
    if (owners <= 1) throw errors.conflict('شرکت باید حداقل یک مالک فعال داشته باشد')
  }

  await db.$transaction(async (tx) => {
    await tx.teamMember.deleteMany({ where: { userId: target.id } })
    await tx.session.updateMany({
      where: { userId: target.id, revokedAt: null },
      data: { revokedAt: new Date() },
    })
    await tx.user.update({ where: { id: target.id }, data: { status: 'DEACTIVATED' } })

    await tx.auditLog.create({
      data: {
        companyId: auth.companyId,
        actorId: auth.userId,
        action: 'member.remove',
        targetType: 'User',
        targetId: target.id,
        ip: getRequestIP(event, { xForwardedFor: true }),
        data: { fullName: target.fullName },
      },
    })
  })

  return { ok: true }
})
