import { rewardRulesSchema } from '#shared/schemas'

import { requirePermission } from '../../utils/auth'
import { errors, readValidated } from '../../utils/http'
import { createTenantClient } from '../../utils/tenant'

/**
 * `PUT /api/rewards/rules` — publish a new version of the economy.
 *
 * Rules are **versioned, not mutated**. Editing in place would silently
 * rewrite the meaning of every historical payout; instead each save creates a
 * new row and flips `isActive`, so a review from three months ago can still be
 * explained by the rules that produced it (its `ruleVersion` is frozen onto
 * the review).
 *
 * OWNER/ADMIN only — tuning the economy is not a manager-level power.
 */
export default defineEventHandler(async (event) => {
  const auth = requirePermission(event, 'reward:manage')
  const input = await readValidated(event, rewardRulesSchema)

  if (input.minMultiplierBp > input.maxMultiplierBp) {
    throw errors.badRequest('INVALID_RANGE', 'حداقل ضریب نمی‌تواند از حداکثر بیشتر باشد')
  }

  const db = createTenantClient(auth)

  const rules = await db.$transaction(async (tx) => {
    const latest = await tx.rewardRule.findFirst({
      where: { companyId: auth.companyId },
      orderBy: { version: 'desc' },
      select: { version: true },
    })

    await tx.rewardRule.updateMany({
      where: { companyId: auth.companyId, isActive: true },
      data: { isActive: false },
    })

    const created = await tx.rewardRule.create({
      data: {
        ...input,
        companyId: auth.companyId,
        version: (latest?.version ?? 0) + 1,
        isActive: true,
        createdBy: auth.userId,
      },
    })

    await tx.auditLog.create({
      data: {
        companyId: auth.companyId,
        actorId: auth.userId,
        action: 'reward.rules.publish',
        targetType: 'RewardRule',
        targetId: created.id,
        data: { version: created.version },
      },
    })

    return created
  })

  return { rules }
})
