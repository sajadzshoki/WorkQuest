import { recognitionCategorySchema } from '#shared/schemas'

import { requirePermission } from '../../utils/auth'
import { readValidated } from '../../utils/http'
import { createTenantClient } from '../../utils/tenant'

/**
 * `POST /api/recognition/categories` — create a voting bucket.
 *
 * An admin names the category and, optionally, sets the reward the winner earns
 * (XP, coins, badge) and the title they are given. OWNER/ADMIN only.
 */
export default defineEventHandler(async (event) => {
  const auth = requirePermission(event, 'recognition:manage')
  const input = await readValidated(event, recognitionCategorySchema)
  const db = createTenantClient(auth)

  const category = await db.recognitionCategory.create({
    data: {
      companyId: auth.companyId,
      name: input.name,
      description: input.description ?? null,
      iconKey: input.iconKey ?? null,
      tone: input.tone ?? 'primary',
      sortOrder: input.sortOrder ?? 0,
      xpReward: input.xpReward ?? 0,
      coinReward: input.coinReward ?? 0,
      titleId: input.titleId ?? null,
      badgeId: input.badgeId ?? null,
    },
    select: { id: true },
  })

  await db.auditLog.create({
    data: {
      companyId: auth.companyId,
      actorId: auth.userId,
      action: 'recognition.category.create',
      targetType: 'RecognitionCategory',
      targetId: category.id,
      data: { name: input.name },
    },
  })

  return { category: { id: category.id } }
})
