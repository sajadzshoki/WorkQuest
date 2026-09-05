import type { ChallengeMutationResponse } from '#shared/types/api'

import { createChallengeSchema } from '#shared/schemas'

import { requirePermission } from '../../utils/auth'
import {
  assertChallengeScope,
  challengeSummaryFor,
  refreshChallenges,
} from '../../utils/challenges'
import { errors, readValidated } from '../../utils/http'
import { createTenantClient } from '../../utils/tenant'

/**
 * `POST /api/challenges` — publish a challenge.
 *
 * OWNER/ADMIN may address the whole company or any team; a MANAGER only the
 * teams they lead (`assertChallengeScope`). A challenge created with a window
 * that is already open starts immediately — the refresh below enrols the
 * roster and flips it ACTIVE in the same request, so "starting today" is one
 * click, not a scheduled job.
 */
export default defineEventHandler(async (event): Promise<ChallengeMutationResponse> => {
  const auth = requirePermission(event, 'challenge:manage')
  const input = await readValidated(event, createChallengeSchema)
  const db = createTenantClient(auth)
  const now = new Date()

  const teamId = input.teamId || null
  const badgeId = input.badgeId || null

  await assertChallengeScope(auth, teamId)

  // The tenant client turns a foreign team or badge id into a 404, never a leak.
  if (teamId) {
    const team = await db.team.findUnique({ where: { id: teamId }, select: { id: true } })
    if (!team) throw errors.notFound('تیم انتخاب‌شده پیدا نشد')
  }
  if (badgeId) {
    const badge = await db.badge.findUnique({ where: { id: badgeId }, select: { id: true } })
    if (!badge) throw errors.notFound('نشان انتخاب‌شده پیدا نشد')
  }

  const created = await db.$transaction(async (tx) => {
    const challenge = await tx.challenge.create({
      data: {
        companyId: auth.companyId,
        title: input.title,
        description: input.description || null,
        type: input.type,
        teamId,
        goalKey: input.goalKey,
        goalValue: input.goalValue,
        xpReward: input.xpReward,
        coinReward: input.coinReward,
        startsAt: input.startsAt,
        endsAt: input.endsAt,
        badgeId,
        status: 'DRAFT',
      },
      select: { id: true },
    })

    await tx.auditLog.create({
      data: {
        companyId: auth.companyId,
        actorId: auth.userId,
        action: 'challenge.create',
        targetType: 'Challenge',
        targetId: challenge.id,
        data: {
          title: input.title,
          type: input.type,
          goalKey: input.goalKey,
          goalValue: input.goalValue,
          teamId,
        },
      },
    })

    return challenge
  })

  // Open the window if it has already arrived.
  await refreshChallenges(db, auth.companyId, now)

  const summary = await challengeSummaryFor(db, auth, created.id)
  if (!summary) throw errors.conflict('ایجاد چالش ناموفق بود')

  return { challenge: summary }
})
