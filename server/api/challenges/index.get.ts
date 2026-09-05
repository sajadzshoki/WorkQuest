import type { ChallengeListResponse } from '#shared/types/api'
import type { ChallengeStatus } from '#shared/utils/challenges'
import { CHALLENGE_STATUSES } from '#shared/utils/challenges'
import { challengeListQuerySchema } from '#shared/schemas'
import { can } from '#shared/utils/permissions'

import { requireAuth } from '../../utils/auth'
import {
  CHALLENGE_LIST_SELECT,
  PUBLIC_CHALLENGE_STATUSES,
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
 * could edit it (challenge:manage, in scope) see it. Everything else is
 * company-visible — a team push is not a secret, and the roster detail
 * (per-person progress) stays behind the manage permission in `GET /:id`.
 */
export default defineEventHandler(async (event): Promise<ChallengeListResponse> => {
  const auth = requireAuth(event)
  const input = readValidatedQuery(event, challengeListQuerySchema)
  const db = createTenantClient(auth)
  const now = new Date()

  await refreshChallenges(db, auth.companyId, now)

  const visibleStatuses: readonly ChallengeStatus[] = can(auth.role, 'challenge:manage')
    ? CHALLENGE_STATUSES
    : PUBLIC_CHALLENGE_STATUSES

  // A filter the caller may not see (an employee asking for DRAFT) resolves
  // to an empty result, not to a leak.
  const statuses = input.status
    ? (visibleStatuses.includes(input.status) ? [input.status] : [])
    : [...visibleStatuses]

  const rows = await db.challenge.findMany({
    where: {
      status: { in: statuses },
      ...(input.type ? { type: input.type } : {}),
    },
    select: CHALLENGE_LIST_SELECT,
  })

  const manageableTeams = await manageableTeamIds(auth)
  const items = rows
    .map(row => toChallengeSummary(row, auth, { now, manageableTeams }))
    .sort(compareChallengeSummaries)

  const counts: Partial<Record<ChallengeStatus, number>> = {}
  for (const item of items) {
    counts[item.status] = (counts[item.status] ?? 0) + 1
  }

  return { items, counts }
})
