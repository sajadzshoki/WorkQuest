import type { ChallengeMutationResponse } from '#shared/types/api'

import { updateChallengeSchema, challengeSpecIssues } from '#shared/schemas'
import { isEditableChallenge } from '#shared/utils/challenges'

import { requirePermission } from '../../utils/auth'
import {
  assertChallengeScope,
  challengeSummaryFor,
  goalKeyOf,
  loadChallengeRow,
} from '../../utils/challenges'
import { apiError, errors, readValidated, requireUuidParam } from '../../utils/http'
import { createTenantClient } from '../../utils/tenant'

/**
 * `PATCH /api/challenges/:id` — edit before the start.
 *
 * Once the window has opened people are working towards the published goal,
 * so the challenge is locked; cancellation (with a notification to everybody
 * enrolled) is the honest way out after that. A partial body is merged onto
 * the current row and the *result* is re-validated, so an edit cannot
 * assemble an invalid challenge one field at a time.
 */
export default defineEventHandler(async (event): Promise<ChallengeMutationResponse> => {
  const auth = requirePermission(event, 'challenge:manage')
  const id = requireUuidParam(event, 'id', 'چالش پیدا نشد')
  const input = await readValidated(event, updateChallengeSchema)
  const db = createTenantClient(auth)
  const now = new Date()

  const row = await loadChallengeRow(db, id)
  if (!row) throw errors.notFound('چالش پیدا نشد')
  if (!row.teamId && row.type === 'TEAM') throw errors.notFound('چالش پیدا نشد')

  if (!isEditableChallenge({ status: row.status, startsAt: row.startsAt }, now)) {
    throw apiError(409, 'CHALLENGE_LOCKED', 'این چالش شروع شده و دیگر قابل ویرایش نیست')
  }

  // The merged result has to satisfy every rule a fresh creation would.
  const merged = {
    type: input.type ?? row.type,
    teamId: input.teamId !== undefined ? (input.teamId || null) : row.teamId,
    goalKey: input.goalKey ?? goalKeyOf(row),
    goalValue: input.goalValue ?? row.goalValue,
    startsAt: input.startsAt ?? row.startsAt,
    endsAt: input.endsAt ?? row.endsAt,
  }

  const issues = challengeSpecIssues(merged)
  if (issues.length > 0) {
    throw apiError(422, 'VALIDATION_FAILED', 'اطلاعات وارد شده معتبر نیست', { issues })
  }

  // Scope is checked against the merged team: a manager cannot re-aim their
  // own challenge at a team they do not lead.
  await assertChallengeScope(auth, merged.teamId)

  if (merged.teamId && merged.teamId !== row.teamId) {
    const team = await db.team.findUnique({ where: { id: merged.teamId }, select: { id: true } })
    if (!team) throw errors.notFound('تیم انتخاب‌شده پیدا نشد')
  }
  if (input.badgeId) {
    const badge = await db.badge.findUnique({ where: { id: input.badgeId }, select: { id: true } })
    if (!badge) throw errors.notFound('نشان انتخاب‌شده پیدا نشد')
  }

  await db.$transaction(async (tx) => {
    await tx.challenge.update({
      where: { id },
      data: {
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.description !== undefined ? { description: input.description || null } : {}),
        ...(input.type !== undefined ? { type: input.type } : {}),
        ...(input.teamId !== undefined ? { teamId: input.teamId || null } : {}),
        ...(input.goalKey !== undefined ? { goalKey: input.goalKey } : {}),
        ...(input.goalValue !== undefined ? { goalValue: input.goalValue } : {}),
        ...(input.xpReward !== undefined ? { xpReward: input.xpReward } : {}),
        ...(input.coinReward !== undefined ? { coinReward: input.coinReward } : {}),
        ...(input.startsAt !== undefined ? { startsAt: input.startsAt } : {}),
        ...(input.endsAt !== undefined ? { endsAt: input.endsAt } : {}),
        ...(input.badgeId !== undefined ? { badgeId: input.badgeId || null } : {}),
      },
    })

    await tx.auditLog.create({
      data: {
        companyId: auth.companyId,
        actorId: auth.userId,
        action: 'challenge.update',
        targetType: 'Challenge',
        targetId: id,
        data: {
          fields: Object.keys(input),
          goalKey: merged.goalKey,
          goalValue: merged.goalValue,
        },
      },
    })
  })

  const summary = await challengeSummaryFor(db, auth, id)
  if (!summary) throw errors.notFound('چالش پیدا نشد')
  return { challenge: summary }
})
