import { recognitionCategoryUpdateSchema } from '#shared/schemas'

import { requirePermission } from '../../../utils/auth'
import { errors, readValidated } from '../../../utils/http'
import { createTenantClient } from '../../../utils/tenant'

/**
 * `PATCH /api/recognition/categories/:id` — edit a category or disable it.
 *
 * `isActive: false` hides it from the voting board and the next finalization
 * without deleting its history (past votes and results stay intact).
 */
export default defineEventHandler(async (event) => {
  const auth = requirePermission(event, 'recognition:manage')
  const id = getRouterParam(event, 'id')
  if (!id) throw errors.notFound('دسته پیدا نشد')

  const input = await readValidated(event, recognitionCategoryUpdateSchema)
  const db = createTenantClient(auth)

  const existing = await db.recognitionCategory.findUnique({
    where: { id },
    select: { id: true },
  })
  if (!existing) throw errors.notFound('دسته پیدا نشد')

  const category = await db.recognitionCategory.update({
    where: { id },
    data: {
      name: input.name,
      description: input.description,
      iconKey: input.iconKey,
      tone: input.tone,
      sortOrder: input.sortOrder,
      isActive: input.isActive,
      xpReward: input.xpReward,
      coinReward: input.coinReward,
      titleId: input.titleId,
      badgeId: input.badgeId,
    },
    select: { id: true },
  })

  await db.auditLog.create({
    data: {
      companyId: auth.companyId,
      actorId: auth.userId,
      action: 'recognition.category.update',
      targetType: 'RecognitionCategory',
      targetId: category.id,
      data: { isActive: input.isActive },
    },
  })

  return { category: { id: category.id } }
})
