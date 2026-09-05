import type { ChallengeListResponse, ChallengeSummary } from '#shared/types/api'
import type { ChallengeStatus } from '#shared/utils/challenges'
import { CHALLENGE_STATUSES } from '#shared/utils/challenges'
import { challengeListQuerySchema } from '#shared/schemas'
import { can } from '#shared/utils/permissions'

import { requireAuth } from '../../utils/auth'
import {
  CHALLENGE_LIST_SELECT,
  compareChallengeSummaries,
  manageableTeamIds,
  refreshChallenges,
  toChallengeSummary,
} from '../../utils/challenges'
import { readValidatedQuery } from '../../utils/http'
import { createTenantClient } from '../../utils/tenant'

/**
 * `GET /api/challenges` — the challenge board.
 *
 * Reads refresh first (see `refreshChallenges`), so a challenge whose window
 * closed is always shown resolved and a goal reached mid-window is already
 * paid by the time the card renders. There is no pagination on purpose: a
 * company runs a handful of challenges at a time and the filter chips need
 * the per-status counts anyway.
 *
 * Visibility: a DRAFT challenge is an unannounced plan, so only callers who
 * could edit it (challenge:manage, in scope) see it. A CANCELLED challenge is
 * history only when it actually ran — cancelling a DRAFT is what "delete"
 * means for something nobody has seen, and it must not surface afterwards.
 * Everything else is company-visible: a team push is not a secret, and the
 * per-person roster stays behind the manage permission in `GET /:id`.
 */
export default defineEventHandler(async (event): Promise<ChallengeListResponse> => {
  const auth = requireAuth(event)
  const input = readValidatedQuery(event, challengeListQuerySchema)
  const db = createTenantClient(auth)
  const now = new Date()

  await refreshChallenges(db, auth.companyId, now)

  const isManager = can(auth.role, 'challenge:manage')

  // A filter the caller may not see (an employee asking for DRAFT) resolves
  // to an empty result, not to a leak — hence the filter *after* visibility.
  const rows = await db.challenge.findMany({
    where: {
      status: { in: [...CHALLENGE_STATUSES] },
      ...(input.type ? { type: input.type } : {}),
    },
    select: CHALLENGE_LIST_SELECT,
  })

  const manageableTeams = await manageableTeamIds(auth)

  const visible = rows
    .map(row => toChallengeSummary(row, auth, { now, manageableTeams }))
    .filter(summary => isManager || wasEverPublic(summary))
    .filter(summary => !input.status || summary.status === input.status)
    .sort(compareChallengeSummaries)

  const counts: Partial<Record<ChallengeStatus, number>> = {}
  for (const item of visible) {
    counts[item.status] = (counts[item.status] ?? 0) + 1
  }

  return { items: visible, counts }
})

/** May somebody without `challenge:manage` see this challenge? */
function wasEverPublic(summary: ChallengeSummary): boolean {
  if (summary.status === 'DRAFT') return false
  if (summary.status === 'CANCELLED') return summary.participantsCount > 0
  return true
}
