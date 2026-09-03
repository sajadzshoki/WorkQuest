import type { RecognitionCycleStatus, RecognitionFrequency } from '#prisma/client'

import { cycleWindow, pickWinner, tallyVotes, type RecognitionFrequency as RecognitionFrequencyInput } from '#shared/utils/recognition'

import { apiError, errors } from './http'
import type { TenantTx } from './tasks'
import type { TenantClient } from './tenant'
import { applyCoinDelta, applyXpDelta, isUniqueViolation } from './wallet'

/**
 * The recognition engine — the only place votes are cast and winners are
 * computed.
 *
 * Privacy by construction: votes are written and never read back by the API;
 * the only thing ever exposed is an *aggregated* result (winner + count). The
 * cycle lifecycle is:
 *
 *   1. an ACTIVE cycle covers a calendar week/month in the company timezone;
 *   2. at the end of the cycle it is finalized — winners are tallied, results
 *      are sealed, and rewards (XP/coins/badge) are paid exactly once;
 *   3. a finalized cycle is terminal and never re-runs.
 */

export interface CycleInfo {
  id: string
  frequency: RecognitionFrequency
  status: RecognitionCycleStatus
  title: string | null
  startsAt: Date
  endsAt: Date
  finalizedAt: Date | null
}

export interface FinalizedResult {
  cycleId: string
  results: Array<{ categoryId: string, winnerId: string, voteCount: number }>
}

const CYCLE_SELECT = {
  id: true,
  frequency: true,
  status: true,
  title: true,
  startsAt: true,
  endsAt: true,
  finalizedAt: true,
} satisfies { [key: string]: true }

/** The cadence the company is currently on — the latest cycle's frequency, default WEEKLY. */
export async function configuredFrequency(
  db: Pick<TenantClient, 'recognitionCycle'>,
  companyId: string,
): Promise<RecognitionFrequencyInput> {
  const latest = await db.recognitionCycle.findFirst({
    where: { companyId },
    orderBy: { createdAt: 'desc' },
    select: { frequency: true },
  })
  return latest?.frequency ?? 'WEEKLY'
}

/**
 * Return the ACTIVE cycle, creating it when none exists yet.
 *
 * A cycle that has expired — or that belongs to a *previous* cadence — is
 * finalized first, so its winners are always tallied before a fresh cycle
 * opens. Creation is guarded by the unique `(companyId, frequency, startsAt)`
 * index for the rare concurrent first-vote race.
 */
export async function ensureActiveCycle(
  db: TenantClient,
  companyId: string,
  frequency: RecognitionFrequencyInput,
  now: Date,
  timeZone: string,
): Promise<CycleInfo> {
  const active = await db.recognitionCycle.findFirst({
    where: { companyId, status: 'ACTIVE' },
    orderBy: { endsAt: 'desc' },
    select: CYCLE_SELECT,
  })

  if (active && active.endsAt.getTime() > now.getTime() && active.frequency === frequency) {
    return active
  }

  if (active) {
    await db.$transaction(tx => finalizeCycle(tx, companyId, active.id))
  }

  const window = cycleWindow(frequency, now, timeZone)
  try {
    return await db.recognitionCycle.create({
      data: {
        companyId,
        frequency,
        status: 'ACTIVE',
        startsAt: window.startsAt,
        endsAt: window.endsAt,
      },
      select: CYCLE_SELECT,
    })
  }
  catch (error) {
    if (isUniqueViolation(error)) {
      return await db.recognitionCycle.findFirstOrThrow({
        where: { companyId, frequency, startsAt: window.startsAt },
        select: CYCLE_SELECT,
      })
    }
    throw error
  }
}

/**
 * Cast one vote in a category.
 *
 * Guards, in order: the category must be active; nobody may vote for themselves;
 * the nominee must be an ACTIVE member of the same company (the tenant-scoped
 * client turns a foreign id into a not-found); and a voter gets exactly one
 * choice per category per cycle.
 */
export async function castVote(
  db: TenantClient,
  input: {
    companyId: string
    voterId: string
    categoryId: string
    nomineeId: string
    now: Date
    timeZone: string
  },
): Promise<{ cycle: CycleInfo, categoryId: string, nomineeId: string }> {
  const category = await db.recognitionCategory.findUnique({
    where: { id: input.categoryId },
    select: { id: true, isActive: true },
  })
  if (!category || !category.isActive) throw errors.notFound('دسته انتخاب‌شده پیدا نشد')

  if (input.nomineeId === input.voterId) {
    throw errors.badRequest('SELF_VOTE', 'نمی‌توانید به خودتان رأی بدهید')
  }

  const nominee = await db.user.findUnique({
    where: { id: input.nomineeId },
    select: { id: true, status: true },
  })
  // The tenant-scoped client filters by companyId, so a nominee from another
  // company resolves to null here — cross-company voting is a 404, not a leak.
  if (!nominee || nominee.status !== 'ACTIVE') {
    throw errors.notFound('همکار انتخاب‌شده پیدا نشد')
  }

  const frequency = await configuredFrequency(db, input.companyId)
  const cycle = await ensureActiveCycle(db, input.companyId, frequency, input.now, input.timeZone)

  const existing = await db.recognitionVote.findUnique({
    where: {
      cycleId_categoryId_voterId: {
        cycleId: cycle.id,
        categoryId: input.categoryId,
        voterId: input.voterId,
      },
    },
    select: { id: true },
  })
  if (existing) throw apiError(409, 'ALREADY_VOTED', 'در این دوره به این دسته رأی داده‌اید')

  await db.recognitionVote.create({
    data: {
      companyId: input.companyId,
      cycleId: cycle.id,
      categoryId: input.categoryId,
      voterId: input.voterId,
      nomineeId: input.nomineeId,
    },
  })

  return { cycle, categoryId: input.categoryId, nomineeId: input.nomineeId }
}

/** Finalize every ACTIVE cycle whose window has closed. Idempotent. */
export async function finalizeDueCycles(
  db: TenantClient,
  companyId: string,
  now: Date,
): Promise<FinalizedResult[]> {
  const due = await db.recognitionCycle.findMany({
    where: { companyId, status: 'ACTIVE', endsAt: { lte: now } },
    select: { id: true },
  })

  const outcomes: FinalizedResult[] = []
  for (const cycle of due) {
    const outcome = await db.$transaction(tx => finalizeCycle(tx, companyId, cycle.id))
    if (outcome) outcomes.push(outcome)
  }
  return outcomes
}

/**
 * Tally one cycle's winners, seal the results and pay the rewards — all in a
 * single transaction so a result and its ledger rows commit or roll back
 * together. Runs to completion exactly once: the `(cycleId, categoryId)` unique
 * index and the per-result ledger keys make a re-run a no-op.
 */
export async function finalizeCycle(
  tx: TenantTx,
  companyId: string,
  cycleId: string,
): Promise<FinalizedResult | null> {
  const cycle = await tx.recognitionCycle.findUnique({
    where: { id: cycleId },
    select: { id: true, status: true },
  })
  if (!cycle || cycle.status !== 'ACTIVE') return null

  const categories = await tx.recognitionCategory.findMany({
    where: { companyId, isActive: true },
    select: {
      id: true,
      name: true,
      xpReward: true,
      coinReward: true,
      titleId: true,
      badgeId: true,
      title: { select: { name: true } },
    },
  })

  const results: FinalizedResult['results'] = []

  for (const category of categories) {
    const votes = await tx.recognitionVote.findMany({
      where: { cycleId, categoryId: category.id },
      select: { nomineeId: true, createdAt: true },
    })
    if (votes.length === 0) continue

    const winnerId = pickWinner(votes)
    if (!winnerId) continue

    const existing = await tx.recognitionResult.findUnique({
      where: { cycleId_categoryId: { cycleId, categoryId: category.id } },
      select: { id: true },
    })
    if (existing) continue

    const count = tallyVotes(votes).find(tally => tally.nomineeId === winnerId)?.count ?? 0
    const titleName = category.title?.name ?? null

    const result = await tx.recognitionResult.create({
      data: {
        companyId,
        cycleId,
        categoryId: category.id,
        winnerId,
        voteCount: count,
        titleId: category.titleId,
        titleName,
        xpReward: category.xpReward,
        coinReward: category.coinReward,
      },
      select: { id: true },
    })

    const reason = `قدردانی «${category.name}»`

    if (category.xpReward > 0) {
      await applyXpDelta(tx, {
        companyId,
        userId: winnerId,
        amount: category.xpReward,
        source: 'RECOGNITION',
        reason,
        referenceType: 'RecognitionResult',
        referenceId: result.id,
        idempotencyKey: `recognition:result:${result.id}:xp`,
      })
    }

    if (category.coinReward > 0) {
      await applyCoinDelta(tx, {
        companyId,
        userId: winnerId,
        amount: category.coinReward,
        type: 'RECOGNITION_REWARD',
        source: 'RECOGNITION',
        reason,
        referenceType: 'RecognitionResult',
        referenceId: result.id,
        idempotencyKey: `recognition:result:${result.id}:coins`,
      })
    }

    if (category.badgeId) {
      const held = await tx.userBadge.findUnique({
        where: { userId_badgeId: { userId: winnerId, badgeId: category.badgeId } },
        select: { id: true },
      })
      if (!held) {
        await tx.userBadge.create({
          data: { companyId, userId: winnerId, badgeId: category.badgeId },
        })
      }
    }

    await tx.notification.create({
      data: {
        companyId,
        userId: winnerId,
        type: 'RECOGNITION_RECEIVED',
        title: 'در قدردانی همکاران برنده شدید',
        body: titleName ? `«${titleName}» — ${category.name}` : category.name,
        data: { recognitionResultId: result.id, categoryId: category.id },
      },
    })

    await tx.recognitionResult.update({
      where: { id: result.id },
      data: { rewardedAt: new Date() },
    })

    results.push({ categoryId: category.id, winnerId, voteCount: count })
  }

  await tx.recognitionCycle.update({
    where: { id: cycleId },
    data: { status: 'FINALIZED', finalizedAt: new Date() },
  })

  await tx.auditLog.create({
    data: {
      companyId,
      actorId: null,
      action: 'recognition.cycle.finalize',
      targetType: 'RecognitionCycle',
      targetId: cycleId,
      data: { results: results.length },
    },
  })

  return { cycleId, results }
}
