import { recognitionVoteSchema } from '#shared/schemas'

import { requireAuth } from '../../utils/auth'
import { readValidated } from '../../utils/http'
import { castVote } from '../../utils/recognition'
import { createTenantClient } from '../../utils/tenant'

/**
 * `POST /api/recognition/vote` — nominate one coworker for one category.
 *
 * Enforced here: no self-votes, no cross-company nominees, no duplicate votes,
 * and only active categories. A vote is a bare nomination (no rating), so the
 * only lever a voter has is *who* they pick.
 */
export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const input = await readValidated(event, recognitionVoteSchema)
  const db = createTenantClient(auth)

  const outcome = await castVote(db, {
    companyId: auth.companyId,
    voterId: auth.userId,
    categoryId: input.categoryId,
    nomineeId: input.nomineeId,
    now: new Date(),
    timeZone: auth.company.timezone,
  })

  return {
    vote: {
      categoryId: outcome.categoryId,
      nomineeId: outcome.nomineeId,
      cycleId: outcome.cycle.id,
    },
  }
})
