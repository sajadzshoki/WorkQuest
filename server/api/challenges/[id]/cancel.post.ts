import type { ChallengeMutationResponse } from '#shared/types/api'

import { isCancellableChallenge } from '#shared/utils/challenges'

import { requirePermission } from '../../../utils/auth'
import { assertChallengeScope, challengeSummaryFor, loadChallengeRow } from '../../../utils/challenges'
import { apiError, errors, requireUuidParam } from '../../../utils/http'
import { createTenantClient } from '../../../utils/tenant'

/**
 * `POST /api/challenges/:id/cancel` — call the whole thing off.
 *
 * Cancellation is terminal and honest: the challenge keeps its row (history
 * is history), everybody enrolled in a running challenge is notified, and no
 * reward is paid. A DRAFT challenge can be cancelled too — that is what
 * "delete" means for something nobody has seen yet.
 */
export default defineEventHandler(async (event): Promise<ChallengeMutationResponse> => {
  const auth = requirePermission(event, 'challenge:manage')
  const id = requireUuidParam(event, 'id', 'چالش پیدا نشد')
  const db = createTenantClient(auth)

  const row = await loadChallengeRow(db, id)
  if (!row) throw errors.notFound('چالش پیدا نشد')

  if (!isCancellableChallenge(row)) {
    throw apiError(409, 'CHALLENGE_CLOSED', 'این چالش پایان یافته و قابل لغو نیست')
  }

  await assertChallengeScope(auth, row.teamId)

  await db.$transaction(async (tx) => {
    await tx.challenge.update({ where: { id }, data: { status: 'CANCELLED' } })

    // Only a challenge that actually ran owes anybody an explanation.
    if (row.status === 'ACTIVE') {
      const enrolled = await tx.challengeParticipant.findMany({
        where: { challengeId: id },
        select: { userId: true },
      })

      if (enrolled.length > 0) {
        await tx.notification.createMany({
          data: enrolled.map(participant => ({
            companyId: auth.companyId,
            userId: participant.userId,
            type: 'CHALLENGE_UPDATE' as const,
            title: 'چالش لغو شد',
            body: `«${row.title}» پیش از پایان مهلت لغو شد`,
            data: { challengeId: id },
          })),
        })
      }
    }

    await tx.auditLog.create({
      data: {
        companyId: auth.companyId,
        actorId: auth.userId,
        action: 'challenge.cancel',
        targetType: 'Challenge',
        targetId: id,
        data: { fromStatus: row.status, title: row.title },
      },
    })
  })

  const summary = await challengeSummaryFor(db, auth, id)
  if (!summary) throw errors.notFound('چالش پیدا نشد')
  return { challenge: summary }
})
