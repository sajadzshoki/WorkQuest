import { rewardPreviewSchema } from '#shared/schemas'
import { calculateReward } from '#shared/utils/rewards'

import { requireAuth } from '../../utils/auth'
import { errors, readValidated } from '../../utils/http'
import { canManageTask, loadVisibleTask } from '../../utils/tasks'
import { createTenantClient } from '../../utils/tenant'
import { loadRewardRules } from '../../utils/wallet'

/**
 * `POST /api/rewards/preview` — "what will this score pay?"
 *
 * The manager's review form calls this on every score change. It exists so the
 * preview and the eventual payout cannot disagree: both call
 * `calculateReward` with the same rules and the same task facts, and the
 * component does no arithmetic of its own.
 *
 * It is a read-only projection — nothing is written and no idempotency key is
 * consumed, so it is safe to call on every keystroke.
 */
export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const input = await readValidated(event, rewardPreviewSchema)

  const task = await loadVisibleTask(auth, input.taskId)

  // Only someone who could actually approve the task may see its payout.
  if (!canManageTask(auth, task)) {
    throw errors.forbidden('اجازهٔ بازبینی این تسک را ندارید')
  }

  const db = createTenantClient(auth)
  const rules = await loadRewardRules(db, auth.companyId)

  const breakdown = calculateReward({
    score: input.score,
    qualityScore: input.qualityScore ?? null,
    priority: task.priority,
    dueDate: task.dueDate,
    submittedAt: task.submittedAt ?? new Date(),
    revisionCount: task.revisionCount,
    baseXp: task.xpReward > 0 ? task.xpReward : null,
    baseCoins: task.coinReward > 0 ? task.coinReward : null,
  }, rules)

  return { reward: { ...breakdown, ruleVersion: rules.version } }
})
