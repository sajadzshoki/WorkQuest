/**
 * The challenge engine — the only place a challenge changes state.
 *
 * Everything a challenge says about the world is *computed*, never supplied:
 *
 *  1. **Progress is a read-model.** `refreshChallenges` derives every number
 *     from real application data — approved tasks, on-time tasks, team
 *     completion — inside the challenge's window, and writes it onto the
 *     challenge and its participant rows. There is no endpoint that accepts a
 *     progress value, and no code path that fakes one.
 *  2. **Completion is a transaction.** Reaching a goal, paying XP and coins
 *     through the ledgers, granting the linked badge, re-evaluating the
 *     achievement catalogue and notifying the user all commit together or not
 *     at all.
 *  3. **A reward is at-most-once.** The ledgers' unique
 *     `(companyId, idempotencyKey)` indexes — keyed
 *     `challenge:<id>:user:<userId>:{xp|coins}` — are the guarantee; the
 *     `CLAIMED` participant status and `rewardedAt` are the fast path and the
 *     audit trail. Re-running the engine pays nothing twice.
 *  4. **The clock is the only scheduler.** Like the recognition cycles, the
 *     engine runs wherever a challenges surface is read (and after the task
 *     transitions that can move a number), so a challenge whose window closed
 *     is always resolved before anybody sees it.
 *
 * Scope rules:
 *
 *  - INDIVIDUAL with no `teamId` enrols every ACTIVE member of the company;
 *    with a `teamId`, only that team's members. Each participant races their
 *    own bar (`assigneeId = user` metrics).
 *  - TEAM measures the team's tagged task board (`teamId = team`), and its
 *    reward is paid to every enrolled participant — a team push is won
 *    together or not at all.
 *  - Rate goals (`on_time_rate`, `team_completion_rate`) are judged at the
 *    deadline: "maintain 90 %" is a promise about the whole window, and an
 *    early 100 % on three tasks must not lock the win in.
 */

import type { Prisma } from '#prisma/client'
import type { AuthContext, ChallengeSummary } from '#shared/types/api'
import type { ChallengeGoalKey, ChallengeStatus } from '#shared/utils/challenges'
import { can, roleAtLeast } from '#shared/utils/permissions'
import { challengeRewardKey } from '#shared/utils/rewards'
import { completionRate } from '#shared/utils/task'
import {
  goalReached,
  isCancellableChallenge,
  isChallengeGoalKey,
  isEditableChallenge,
  isRateGoal,
  participantPhase,
} from '#shared/utils/challenges'

import { computeMetrics, unlockDueAchievements } from './gamification'
import { ledTeamIds } from './members'
import { errors } from './http'
import type { TenantTx } from './tasks'
import type { TenantClient } from './tenant'
import { applyCoinDelta, applyXpDelta, syncLevel } from './wallet'

// ---------------------------------------------------------------------------
// Projections
// ---------------------------------------------------------------------------

/**
 * Narrow a stored `goalKey` (a plain string column) to the vocabulary.
 *
 * The write paths only ever store validated keys, so an unknown value means
 * a hand-edited row; treating it as a task count is the safest degradation —
 * a count is always computable, and the row stays visible instead of
 * throwing on every surface.
 */
export function goalKeyOf(row: { goalKey: string }): ChallengeGoalKey {
  return isChallengeGoalKey(row.goalKey) ? row.goalKey : 'tasks_completed'
}

/** Every column the engine and the API need on a challenge. */
export const CHALLENGE_SELECT = {
  id: true,
  companyId: true,
  title: true,
  description: true,
  type: true,
  teamId: true,
  team: { select: { id: true, name: true, slug: true } },
  goalKey: true,
  goalValue: true,
  progress: true,
  xpReward: true,
  coinReward: true,
  startsAt: true,
  endsAt: true,
  status: true,
  badgeId: true,
  createdAt: true,
} satisfies Prisma.ChallengeSelect

export type ChallengeRow = Prisma.ChallengeGetPayload<{ select: typeof CHALLENGE_SELECT }>

/**
 * The roster slice the engine and the participants view read. `user.status`
 * is included on purpose: a suspended member's progress is still computed
 * (their work happened), but they are not paid.
 */
export const PARTICIPANT_SELECT = {
  id: true,
  userId: true,
  progress: true,
  status: true,
  completedAt: true,
  rewardedAt: true,
  user: { select: { id: true, fullName: true, avatarUrl: true, jobTitle: true, status: true } },
} satisfies Prisma.ChallengeParticipantSelect

export type ParticipantRow = Prisma.ChallengeParticipantGetPayload<{ select: typeof PARTICIPANT_SELECT }>

/** The list/detail select: the challenge plus its whole roster in one read. */
export const CHALLENGE_LIST_SELECT = {
  ...CHALLENGE_SELECT,
  participants: { select: { userId: true, progress: true, status: true, completedAt: true, rewardedAt: true } },
} satisfies Prisma.ChallengeSelect

type ChallengeListRow = Prisma.ChallengeGetPayload<{ select: typeof CHALLENGE_LIST_SELECT }>

// ---------------------------------------------------------------------------
// Refresh — the engine's single entry point
// ---------------------------------------------------------------------------

/** One reward the engine paid during this run (used for immediate feedback). */
export interface ChallengeCompletionEvent {
  challengeId: string
  title: string
  userId: string
  xp: number
  coins: number
}

export interface RefreshOutcome {
  activated: number
  completed: number
  ended: number
  cancelled: number
  rewarded: number
  completions: ChallengeCompletionEvent[]
}

/** What one challenge's step contributed to a refresh. */
type OneOutcome = Omit<RefreshOutcome, 'rewarded'>

/**
 * Bring every non-terminal challenge of the company up to the moment.
 *
 * Cheap to call on every read: one indexed scan for due challenges, and an
 * early-out when there are none. Each challenge is processed in its own
 * transaction, so one challenge's payout cannot roll back another's.
 */
export async function refreshChallenges(
  db: TenantClient,
  companyId: string,
  now: Date = new Date(),
): Promise<RefreshOutcome> {
  const due = await db.challenge.findMany({
    where: { companyId, status: { in: ['DRAFT', 'ACTIVE'] } },
    orderBy: [{ startsAt: 'asc' }, { id: 'asc' }],
    select: CHALLENGE_SELECT,
  })

  const outcome: RefreshOutcome = {
    activated: 0,
    completed: 0,
    ended: 0,
    cancelled: 0,
    rewarded: 0,
    completions: [],
  }

  for (const challenge of due) {
    const events = await db.$transaction(tx => refreshOne(tx, challenge, now))
    outcome.activated += events.activated
    outcome.completed += events.completed
    outcome.ended += events.ended
    outcome.cancelled += events.cancelled
    outcome.rewarded += events.completions.length
    outcome.completions.push(...events.completions)
  }

  return outcome
}

/**
 * Move one challenge forward. Always runs inside a transaction that has
 * locked the challenge row, so two concurrent refreshes serialise instead of
 * racing over the same payout.
 */
async function refreshOne(tx: TenantTx, challenge: ChallengeRow, now: Date): Promise<OneOutcome> {
  // Serialise concurrent engine runs on the same challenge: the second one
  // then reads the first one's CLAIMED rows and pays nothing.
  await tx.$queryRaw`SELECT "id" FROM "Challenge" WHERE "id" = ${challenge.id}::uuid FOR UPDATE`

  // A TEAM challenge whose team was deleted is unmeasurable — cancel it.
  if (challenge.type === 'TEAM' && !challenge.teamId) {
    await tx.challenge.update({ where: { id: challenge.id }, data: { status: 'CANCELLED' } })
    await tx.auditLog.create({
      data: {
        companyId: challenge.companyId,
        action: 'challenge.cancel',
        targetType: 'Challenge',
        targetId: challenge.id,
        data: { reason: 'TEAM_DELETED' },
      },
    })
    return { activated: 0, completed: 0, ended: 0, cancelled: 1, completions: [] }
  }

  // A DRAFT whose window closed before it ever opened is born dead. It never
  // enrolled anybody, so there is nothing to pay — seal it as ENDED.
  if (challenge.status === 'DRAFT' && now.getTime() > challenge.endsAt.getTime()) {
    await tx.challenge.update({ where: { id: challenge.id }, data: { status: 'ENDED' } })
    await tx.auditLog.create({
      data: {
        companyId: challenge.companyId,
        action: 'challenge.resolve',
        targetType: 'Challenge',
        targetId: challenge.id,
        data: { outcome: 'ENDED', reason: 'NEVER_STARTED' },
      },
    })
    return { activated: 0, completed: 0, ended: 1, cancelled: 0, completions: [] }
  }

  // The window has opened: enrol the roster and flip to ACTIVE. The loaded
  // row's status is stale from here on, so the branch below is explicit.
  let activated = 0
  if (challenge.status === 'DRAFT' && now.getTime() >= challenge.startsAt.getTime()) {
    await activateChallenge(tx, challenge)
    activated = 1
  }
  else if (challenge.status === 'DRAFT') {
    // Still scheduled — nothing has happened yet.
    return { activated: 0, completed: 0, ended: 0, cancelled: 0, completions: [] }
  }

  // ACTIVE: either still in the window (live sync) or past it (resolution).
  const result = now.getTime() > challenge.endsAt.getTime()
    ? await resolveChallenge(tx, challenge, now)
    : await syncLiveChallenge(tx, challenge, now)
  return { activated, ...result, cancelled: 0 }
}

// ---------------------------------------------------------------------------
// Activation
// ---------------------------------------------------------------------------

/**
 * Enrol the roster and announce the challenge.
 *
 * Membership is snapshotted here: people who join the company or the team
 * later do not join a race that is already running, and nobody is silently
 * dropped mid-challenge.
 */
async function activateChallenge(tx: TenantTx, challenge: ChallengeRow): Promise<void> {
  const scope: Prisma.UserWhereInput = challenge.teamId
    ? { status: 'ACTIVE', teamMemberships: { some: { teamId: challenge.teamId } } }
    : { status: 'ACTIVE' }

  const users = await tx.user.findMany({ where: scope, select: { id: true } })
  const enrolled = users.map(user => user.id)

  if (enrolled.length > 0) {
    await tx.challengeParticipant.createMany({
      data: enrolled.map(userId => ({ companyId: challenge.companyId, challengeId: challenge.id, userId })),
      skipDuplicates: true,
    })

    await tx.notification.createMany({
      data: enrolled.map(userId => ({
        companyId: challenge.companyId,
        userId,
        type: 'CHALLENGE_UPDATE' as const,
        title: 'چالش تازه‌ای آغاز شد',
        body: `«${challenge.title}» شروع شد — تا پایان مهلت پیشرفت خود را ببینید`,
        data: { challengeId: challenge.id },
      })),
    })
  }

  await tx.challenge.update({ where: { id: challenge.id }, data: { status: 'ACTIVE' } })

  await tx.auditLog.create({
    data: {
      companyId: challenge.companyId,
      action: 'challenge.activate',
      targetType: 'Challenge',
      targetId: challenge.id,
      data: { enrolled: enrolled.length },
    },
  })
}

// ---------------------------------------------------------------------------
// Progress — the only writers of a progress value
// ---------------------------------------------------------------------------

/**
 * Every participant's live metric inside the window, in one pass.
 *
 * Batched per challenge rather than per participant on purpose: the refresh
 * runs after every approval, so a company-wide challenge must not cost one
 * query per employee.
 *
 * `windowEnd` is `min(endsAt, now)` while running and `endsAt` at resolution,
 * so work approved after the deadline never counts.
 */
async function computeIndividualProgressMap(
  tx: TenantTx,
  challenge: ChallengeRow,
  userIds: string[],
  windowEnd: Date,
): Promise<Map<string, number>> {
  const goalKey = goalKeyOf(challenge)
  const result = new Map<string, number>()
  if (userIds.length === 0) return result

  if (goalKey === 'tasks_completed') {
    const rows = await tx.task.groupBy({
      by: ['assigneeId'],
      where: {
        assigneeId: { in: userIds },
        status: 'APPROVED',
        completedAt: { gte: challenge.startsAt, lte: windowEnd },
      },
      _count: { _all: true },
    })
    for (const row of rows) {
      if (row.assigneeId) result.set(row.assigneeId, row._count._all)
    }
    return result
  }

  if (goalKey === 'on_time_rate') {
    // Of the tasks completed inside the window that carry a due date, the
    // share completed by that due date. Undated work is neither on time nor
    // late, so it stays out of the denominator.
    const rows = await tx.task.findMany({
      where: {
        assigneeId: { in: userIds },
        status: 'APPROVED',
        completedAt: { gte: challenge.startsAt, lte: windowEnd },
        dueDate: { not: null },
      },
      select: { assigneeId: true, dueDate: true, completedAt: true },
    })

    const totals = new Map<string, { onTime: number, total: number }>()
    for (const row of rows) {
      if (!row.assigneeId || !row.dueDate || !row.completedAt) continue
      const bucket = totals.get(row.assigneeId) ?? { onTime: 0, total: 0 }
      bucket.total += 1
      if (row.completedAt.getTime() <= row.dueDate.getTime()) bucket.onTime += 1
      totals.set(row.assigneeId, bucket)
    }
    for (const [userId, bucket] of totals) {
      result.set(userId, completionRate(bucket.onTime, bucket.total))
    }
    return result
  }

  return result
}

/**
 * The team's collective metric. Team tasks are the ones tagged with the team
 * — the same grouping the manager dashboard uses for its completion rates.
 */
async function computeTeamProgress(
  tx: TenantTx,
  challenge: ChallengeRow,
  windowEnd: Date,
): Promise<number> {
  if (!challenge.teamId) return 0
  const goalKey = goalKeyOf(challenge)

  if (goalKey === 'tasks_completed') {
    return await tx.task.count({
      where: {
        teamId: challenge.teamId,
        status: 'APPROVED',
        completedAt: { gte: challenge.startsAt, lte: windowEnd },
      },
    })
  }

  if (goalKey === 'team_completion_rate') {
    // The period's board: everything due inside the window, plus undated work
    // that arrived during it. Legacy debt due before the window is somebody
    // else's problem — a challenge is about this period's work.
    const scope = {
      teamId: challenge.teamId,
      OR: [
        { dueDate: { gte: challenge.startsAt, lte: challenge.endsAt } },
        { dueDate: null, createdAt: { gte: challenge.startsAt } },
      ],
    }

    const [total, approved] = await Promise.all([
      tx.task.count({ where: scope }),
      tx.task.count({ where: { ...scope, status: 'APPROVED' } }),
    ])
    return completionRate(approved, total)
  }

  return 0
}

/**
 * The status a live progress value earns.
 *
 * Rate goals are judged at the deadline, so while the window is open their
 * bar moves but nothing is won yet — an early 100 % is a pace, not a result.
 */
function livePhase(goalKey: ChallengeGoalKey, progress: number, goalValue: number) {
  if (isRateGoal(goalKey)) {
    return progress > 0 ? 'IN_PROGRESS' as const : 'NOT_STARTED' as const
  }
  return participantPhase(progress, goalValue)
}

// ---------------------------------------------------------------------------
// Live sync — the window is open
// ---------------------------------------------------------------------------

interface StepOutcome {
  completed: number
  ended: number
  completions: ChallengeCompletionEvent[]
}

/**
 * Recompute progress for a running challenge and pay any count goal that has
 * just been reached. Rate goals only update their numbers here — they are
 * decided by `resolveChallenge`.
 */
async function syncLiveChallenge(
  tx: TenantTx,
  challenge: ChallengeRow,
  now: Date,
): Promise<StepOutcome> {
  const goalKey = goalKeyOf(challenge)
  const participants = await tx.challengeParticipant.findMany({
    where: { challengeId: challenge.id },
    select: PARTICIPANT_SELECT,
  })

  const windowEnd = now.getTime() < challenge.endsAt.getTime() ? now : challenge.endsAt
  const completions: ChallengeCompletionEvent[] = []

  if (challenge.type === 'TEAM') {
    const progress = await computeTeamProgress(tx, challenge, windowEnd)

    // A count goal won mid-window ends the challenge: everybody enrolled gets
    // paid, because a team push is won together.
    if (!isRateGoal(goalKey) && goalReached(progress, challenge.goalValue)) {
      const events = await completeTeamChallenge(tx, challenge, participants, progress, now)
      completions.push(...events)
      return { completed: 1, ended: 0, completions }
    }

    await tx.challenge.update({ where: { id: challenge.id }, data: { progress } })
    // Mirror the team's number onto the roster so every member's own row
    // tells the same story as the shared bar.
    await tx.challengeParticipant.updateMany({
      where: { challengeId: challenge.id, status: { in: ['NOT_STARTED', 'IN_PROGRESS'] } },
      data: { progress, status: livePhase(goalKey, progress, challenge.goalValue) },
    })
    return { completed: 0, ended: 0, completions }
  }

  // INDIVIDUAL: each participant's own bar, from their own work.
  const progressByUser = await computeIndividualProgressMap(
    tx,
    challenge,
    participants.map(participant => participant.userId),
    windowEnd,
  )

  let sum = 0
  let finishers = 0
  for (const participant of participants) {
    const progress = progressByUser.get(participant.userId) ?? 0
    sum += progress
    const reached = goalReached(progress, challenge.goalValue)

    if (reached) finishers += 1

    if (!isRateGoal(goalKey) && reached && participant.status !== 'CLAIMED') {
      const event = await rewardParticipant(tx, challenge, participant, progress, now)
      if (event) completions.push(event)
    }
    else if (participant.status !== 'CLAIMED') {
      // A CLAIMED row is history — the engine never rewrites it.
      await tx.challengeParticipant.update({
        where: { id: participant.id },
        data: { progress, status: livePhase(goalKey, progress, challenge.goalValue) },
      })
    }
  }

  // The challenge-level number is the average of the field: how far the
  // company (or team) has collectively pushed, not how far the leader has.
  const aggregate = participants.length > 0 ? Math.round(sum / participants.length) : 0
  await tx.challenge.update({ where: { id: challenge.id }, data: { progress: aggregate } })

  // Everybody has finished a count goal — no reason to keep the race open.
  if (
    !isRateGoal(goalKey)
    && participants.length > 0
    && finishers === participants.length
  ) {
    await sealChallenge(tx, challenge, 'COMPLETED', participants.length, completions.length)
    return { completed: 1, ended: 0, completions }
  }

  return { completed: 0, ended: 0, completions }
}

// ---------------------------------------------------------------------------
// Resolution — the deadline has passed
// ---------------------------------------------------------------------------

/**
 * Final judgement. Count goals may have been paid already during live sync;
 * rate goals are decided exactly here. The status flips to COMPLETED when
 * the goal was met (by anyone, for an individual race; by the team, for a
 * team push) and to ENDED when it was not — and ENDED pays nothing.
 */
async function resolveChallenge(
  tx: TenantTx,
  challenge: ChallengeRow,
  now: Date,
): Promise<StepOutcome> {
  const goalKey = goalKeyOf(challenge)
  const participants = await tx.challengeParticipant.findMany({
    where: { challengeId: challenge.id },
    select: PARTICIPANT_SELECT,
  })

  const completions: ChallengeCompletionEvent[] = []

  if (challenge.type === 'TEAM') {
    const progress = await computeTeamProgress(tx, challenge, challenge.endsAt)
    await tx.challenge.update({ where: { id: challenge.id }, data: { progress } })

    if (goalReached(progress, challenge.goalValue)) {
      const events = await completeTeamChallenge(tx, challenge, participants, progress, now)
      completions.push(...events)
      await sealChallenge(tx, challenge, 'COMPLETED', participants.length, events.length)
      return { completed: 1, ended: 0, completions }
    }

    await tx.challengeParticipant.updateMany({
      where: { challengeId: challenge.id, status: { in: ['NOT_STARTED', 'IN_PROGRESS'] } },
      data: { progress, status: livePhase(goalKey, progress, challenge.goalValue) },
    })
    await sealChallenge(tx, challenge, 'ENDED', 0, 0)
    return { completed: 0, ended: 1, completions }
  }

  const progressByUser = await computeIndividualProgressMap(
    tx,
    challenge,
    participants.map(participant => participant.userId),
    challenge.endsAt,
  )

  let finishers = 0
  for (const participant of participants) {
    const progress = progressByUser.get(participant.userId) ?? 0

    if (goalReached(progress, challenge.goalValue)) {
      finishers += 1
      if (participant.status !== 'CLAIMED') {
        const event = await rewardParticipant(tx, challenge, participant, progress, now)
        if (event) completions.push(event)
      }
    }
    else {
      await tx.challengeParticipant.update({
        where: { id: participant.id },
        data: { progress, status: participantPhase(progress, challenge.goalValue) },
      })
    }
  }

  const status: ChallengeStatus = finishers > 0 ? 'COMPLETED' : 'ENDED'
  await sealChallenge(tx, challenge, status, finishers, completions.length)
  return { completed: status === 'COMPLETED' ? 1 : 0, ended: status === 'ENDED' ? 1 : 0, completions }
}

/** Flip the challenge to a terminal status with an audit entry. */
async function sealChallenge(
  tx: TenantTx,
  challenge: ChallengeRow,
  status: ChallengeStatus,
  finishers: number,
  rewarded: number,
): Promise<void> {
  await tx.challenge.update({ where: { id: challenge.id }, data: { status } })
  await tx.auditLog.create({
    data: {
      companyId: challenge.companyId,
      action: 'challenge.resolve',
      targetType: 'Challenge',
      targetId: challenge.id,
      data: { outcome: status, finishers, rewarded },
    },
  })
}

// ---------------------------------------------------------------------------
// The payout
// ---------------------------------------------------------------------------

/**
 * Pay one participant for a reached goal.
 *
 * Returns the completion event when the reward was actually granted in this
 * call, and `null` when it had already been paid — which is a normal
 * outcome, not an error (see `challengeRewardKey`).
 *
 * `progress` is the participant's final number, so the roster stays truthful
 * even when the reward amounts are both zero.
 */
async function rewardParticipant(
  tx: TenantTx,
  challenge: ChallengeRow,
  participant: ParticipantRow,
  progress: number,
  now: Date,
): Promise<ChallengeCompletionEvent | null> {
  // The goal-reached marker first: the roster must be truthful even if the
  // ledger pays nothing (a zero reward is a legitimate configuration).
  await tx.challengeParticipant.update({
    where: { id: participant.id },
    data: {
      progress,
      status: 'COMPLETED',
      ...(participant.completedAt ? {} : { completedAt: now }),
    },
  })

  // A suspended member's work still counts towards the challenge, but coins
  // and XP are not paid into a locked account.
  if (participant.user.status !== 'ACTIVE') return null

  const userId = participant.userId
  const reason = `چالش «${challenge.title}»`

  if (challenge.xpReward > 0) {
    await applyXpDelta(tx, {
      companyId: challenge.companyId,
      userId,
      amount: challenge.xpReward,
      source: 'CHALLENGE',
      reason,
      referenceType: 'Challenge',
      referenceId: challenge.id,
      idempotencyKey: challengeRewardKey(challenge.id, userId, 'xp'),
    })
  }

  if (challenge.coinReward > 0) {
    await applyCoinDelta(tx, {
      companyId: challenge.companyId,
      userId,
      amount: challenge.coinReward,
      type: 'CHALLENGE_REWARD',
      source: 'CHALLENGE',
      reason,
      referenceType: 'Challenge',
      referenceId: challenge.id,
      idempotencyKey: challengeRewardKey(challenge.id, userId, 'coins'),
    })
  }

  // The payout can move a level boundary — re-point the user's level.
  if (challenge.xpReward > 0) {
    const row = await tx.userProgress.findUnique({ where: { userId }, select: { xp: true } })
    if (row) await syncLevel(tx, challenge.companyId, userId, row.xp)
  }

  // The linked badge, if the company attached one to this challenge.
  if (challenge.badgeId) {
    const held = await tx.userBadge.findUnique({
      where: { userId_badgeId: { userId, badgeId: challenge.badgeId } },
      select: { id: true },
    })
    if (!held) {
      await tx.userBadge.create({
        data: { companyId: challenge.companyId, userId, badgeId: challenge.badgeId },
        select: { id: true },
      })
    }
  }

  // The payout may push a milestone achievement over its threshold — unlock
  // it now, in the same transaction, rather than at some later approval.
  const progressRow = await tx.userProgress.findUnique({
    where: { userId },
    select: { currentStreak: true },
  })
  const metrics = await computeMetrics(tx, challenge.companyId, userId, progressRow?.currentStreak ?? 0)
  await unlockDueAchievements(tx, { companyId: challenge.companyId, userId, metrics })

  await tx.notification.create({
    data: {
      companyId: challenge.companyId,
      userId,
      type: 'CHALLENGE_UPDATE',
      title: 'چالش را کامل کردید',
      body: `${challenge.title} — پاداش شما پرداخت شد`,
      data: {
        challengeId: challenge.id,
        xp: challenge.xpReward,
        coins: challenge.coinReward,
      },
    },
  })

  // The at-most-once marker, written only after everything above committed
  // in this transaction.
  await tx.challengeParticipant.update({
    where: { id: participant.id },
    data: { status: 'CLAIMED', rewardedAt: now },
  })

  await tx.auditLog.create({
    data: {
      companyId: challenge.companyId,
      actorId: null,
      action: 'challenge.reward',
      targetType: 'ChallengeParticipant',
      targetId: participant.id,
      data: {
        challengeId: challenge.id,
        userId,
        xp: challenge.xpReward,
        coins: challenge.coinReward,
      },
    },
  })

  return {
    challengeId: challenge.id,
    title: challenge.title,
    userId,
    xp: challenge.xpReward,
    coins: challenge.coinReward,
  }
}

/**
 * Complete a TEAM challenge: every enrolled participant is marked COMPLETED
 * on the team's number and paid — a team push is won together.
 */
async function completeTeamChallenge(
  tx: TenantTx,
  challenge: ChallengeRow,
  participants: ParticipantRow[],
  progress: number,
  now: Date,
): Promise<ChallengeCompletionEvent[]> {
  const completions: ChallengeCompletionEvent[] = []

  for (const participant of participants) {
    const event = await rewardParticipant(tx, challenge, participant, progress, now)
    if (event) completions.push(event)
  }

  await sealChallenge(tx, challenge, 'COMPLETED', participants.length, completions.length)
  return completions
}

// ---------------------------------------------------------------------------
// Manager scope
// ---------------------------------------------------------------------------

/**
 * May the caller manage challenges in this scope?
 *
 * OWNER/ADMIN reach everything. A MANAGER reaches only the teams they lead:
 * they cannot publish company-wide challenges (that is an announcement in
 * everybody's name) and cannot touch another team's race.
 */
export async function assertChallengeScope(auth: AuthContext, teamId: string | null): Promise<void> {
  if (roleAtLeast(auth.role, 'ADMIN')) return

  if (!teamId) {
    throw errors.forbidden('چالش سراسری فقط توسط مالک یا مدیر شرکت قابل تعریف است')
  }

  const led = await ledTeamIds(auth)
  if (!led.includes(teamId)) {
    throw errors.forbidden('فقط می‌توانید برای تیم‌های تحت رهبری خود چالش تعریف کنید')
  }
}

/** Team ids the caller may manage challenges for; `null` = everything. */
export async function manageableTeamIds(auth: AuthContext): Promise<string[] | null> {
  if (roleAtLeast(auth.role, 'ADMIN')) return null
  return await ledTeamIds(auth)
}

// ---------------------------------------------------------------------------
// Response shaping
// ---------------------------------------------------------------------------

/** Statuses an employee may see — a DRAFT challenge is an unannounced plan. */
export const PUBLIC_CHALLENGE_STATUSES: readonly ChallengeStatus[] = ['ACTIVE', 'COMPLETED', 'ENDED']

/** Bucket order for the list: what is live first, history last. */
const STATUS_ORDER: Record<ChallengeStatus, number> = {
  ACTIVE: 0,
  DRAFT: 1,
  COMPLETED: 2,
  ENDED: 3,
  CANCELLED: 4,
}

/**
 * Map a challenge row (with its roster) for the client.
 *
 * Dates become ISO strings; `progress` is the engine-computed aggregate; the
 * caller's own numbers live in `myParticipation`; and the manage/edit/cancel
 * flags are decided here so the UI never re-derives a permission.
 */
export function toChallengeSummary(
  row: ChallengeListRow,
  auth: AuthContext,
  options: { now: Date, manageableTeams: string[] | null },
): ChallengeSummary {
  const mine = row.participants.find(participant => participant.userId === auth.userId) ?? null
  const completers = row.participants.filter(participant =>
    participant.status === 'COMPLETED' || participant.status === 'CLAIMED',
  ).length
  const canManage = options.manageableTeams === null
    || (row.teamId !== null && options.manageableTeams.includes(row.teamId))

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    type: row.type,
    status: row.status,
    goalKey: goalKeyOf(row),
    goalValue: row.goalValue,
    progress: row.progress,
    startsAt: row.startsAt.toISOString(),
    endsAt: row.endsAt.toISOString(),
    xpReward: row.xpReward,
    coinReward: row.coinReward,
    badgeId: row.badgeId,
    team: row.team,
    participantsCount: row.participants.length,
    completersCount: completers,
    myParticipation: mine
      ? {
          progress: mine.progress,
          status: mine.status,
          completedAt: mine.completedAt?.toISOString() ?? null,
          rewardedAt: mine.rewardedAt?.toISOString() ?? null,
        }
      : null,
    editable: canManage && isEditableChallenge({ status: row.status, startsAt: row.startsAt }, options.now),
    cancellable: canManage && isCancellableChallenge(row),
    canManage,
  }
}

/** Sort live challenges to the top, most urgent deadline first. */
export function compareChallengeSummaries(a: ChallengeSummary, b: ChallengeSummary): number {
  const byStatus = STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
  if (byStatus !== 0) return byStatus

  // Running and upcoming: the nearest deadline / start first.
  if (a.status === 'ACTIVE' || a.status === 'DRAFT') {
    const aKey = a.status === 'DRAFT' ? a.startsAt : a.endsAt
    const bKey = b.status === 'DRAFT' ? b.startsAt : b.endsAt
    return aKey.localeCompare(bKey)
  }

  // History: the most recently finished first.
  return b.endsAt.localeCompare(a.endsAt)
}

/** Load one challenge with its roster, or `null` when it does not exist. */
export async function loadChallengeRow(db: TenantClient, id: string): Promise<ChallengeListRow | null> {
  return await db.challenge.findUnique({ where: { id }, select: CHALLENGE_LIST_SELECT })
}

/**
 * The summary of one challenge, as the caller is allowed to see it.
 *
 * The single loader behind every mutation response, so a create, an edit and
 * a cancellation all hand back the same shape the list renders.
 */
export async function challengeSummaryFor(
  db: TenantClient,
  auth: AuthContext,
  id: string,
): Promise<ChallengeSummary | null> {
  const row = await loadChallengeRow(db, id)
  if (!row) return null
  return toChallengeSummary(row, auth, {
    now: new Date(),
    manageableTeams: await manageableTeamIds(auth),
  })
}

/** True when the caller may see this challenge at all. */
export function canSeeChallenge(summary: ChallengeSummary, auth: AuthContext): boolean {
  if (summary.status !== 'DRAFT') return true
  return can(auth.role, 'challenge:manage') && summary.canManage
}
