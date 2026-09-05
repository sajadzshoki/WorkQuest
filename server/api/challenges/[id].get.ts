import type { ChallengeDetailResponse } from '#shared/types/api'

import { can } from '#shared/utils/permissions'

import { requireAuth } from '../../utils/auth'
import {
  PARTICIPANT_SELECT,
  canSeeChallenge,
  challengeSummaryFor,
  refreshChallenges,
} from '../../utils/challenges'
import { errors, requireUuidParam } from '../../utils/http'
import { createTenantClient } from '../../utils/tenant'

/**
 * `GET /api/challenges/:id` — one challenge, plus its roster.
 *
 * The roster (per-person live progress) is the managers' view: only callers
 * holding `challenge:manage` over the challenge's scope receive it. An
 * employee sees the challenge, the aggregates and their own row — never a
 * ranking of their colleagues.
 */
export default defineEventHandler(async (event): Promise<ChallengeDetailResponse> => {
  const auth = requireAuth(event)
  const id = requireUuidParam(event, 'id', 'چالش پیدا نشد')
  const db = createTenantClient(auth)

  await refreshChallenges(db, auth.companyId, new Date())

  const summary = await challengeSummaryFor(db, auth, id)
  if (!summary || !canSeeChallenge(summary, auth)) throw errors.notFound('چالش پیدا نشد')

  let participants: ChallengeDetailResponse['participants'] = []
  if (summary.canManage && can(auth.role, 'challenge:manage')) {
    const rows = await db.challengeParticipant.findMany({
      where: { challengeId: id },
      orderBy: [{ status: 'desc' }, { progress: 'desc' }, { joinedAt: 'asc' }],
      select: PARTICIPANT_SELECT,
    })

    participants = rows.map(row => ({
      id: row.id,
      user: {
        id: row.user.id,
        fullName: row.user.fullName,
        avatarUrl: row.user.avatarUrl,
        jobTitle: row.user.jobTitle,
      },
      progress: row.progress,
      status: row.status,
      completedAt: row.completedAt?.toISOString() ?? null,
      rewardedAt: row.rewardedAt?.toISOString() ?? null,
    }))
  }

  return { challenge: summary, participants }
})
