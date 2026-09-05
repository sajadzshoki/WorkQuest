import type { Prisma } from '#prisma/client'

import { evaluateAchievement, type GamificationMetrics } from '#shared/utils/achievements'
import { advanceStreak, dayKey } from '#shared/utils/streak'
import { computeLevelProgress } from '#shared/utils/xp'

import { notify } from './notifications'
import type { TenantTx } from './tasks'
import { applyCoinDelta, applyXpDelta } from './wallet'

/**
 * The server-side gamification engine.
 *
 * This is the only place a streak is advanced or an achievement unlocked, and
 * it always runs inside the same transaction as the business event that caused
 * it (a task approval), so an unlock and its ledger rows commit or roll back
 * together. Everything is idempotent:
 *
 *  - a streak counts at most once per calendar day (`advanceStreak`);
 *  - an achievement is gated on the unique `(userId, achievementId)` index,
 *    with a check-then-create so the normal path never trips it (a caught
 *    constraint violation would abort the whole Postgres transaction);
 *  - the XP/coin ledgers carry `achievement:<id>:<user>:…` idempotency keys.
 */

/** The four delegates the metric collector needs — satisfied by the tenant client and its transactions. */
export interface MetricsRepo {
  task: { count(args: Prisma.TaskCountArgs): Promise<number> }
  recognition: { count(args: Prisma.RecognitionCountArgs): Promise<number> }
  userProgress: { findUnique(args: Prisma.UserProgressFindUniqueArgs): Promise<{ xp: number } | null> }
  level: { findMany(args: Prisma.LevelFindManyArgs): Promise<Array<{ level: number, minXp: number, title: string | null }>> }
}

/** One newly-unlocked achievement and the badge it may have awarded. */
export interface AchievementGrant {
  key: string
  title: string
  description: string | null
  iconKey: string | null
  xp: number
  coins: number
  badge: { id: string, name: string, iconKey: string | null, tone: string | null } | null
}

export interface GamificationOutcome {
  streak: { current: number, longest: number, changed: boolean }
  achievements: AchievementGrant[]
  badges: Array<{ id: string, name: string, iconKey: string | null, tone: string | null }>
}

/**
 * Compute the metric snapshot an achievement catalogue is evaluated against.
 *
 * The vocabulary (`ACHIEVEMENT_METRICS`) is fixed here, but the achievements
 * themselves are data — see `evaluateAchievement`.
 */
export async function computeMetrics(
  repo: MetricsRepo,
  companyId: string,
  userId: string,
  streakDays: number,
): Promise<GamificationMetrics> {
  const [approved, revisionsOvercome, recognitions, progress, boundaries] = await Promise.all([
    repo.task.count({ where: { companyId, assigneeId: userId, status: 'APPROVED' } }),
    repo.task.count({
      where: { companyId, assigneeId: userId, status: 'APPROVED', revisionCount: { gt: 0 } },
    }),
    repo.recognition.count({ where: { companyId, toUserId: userId } }),
    repo.userProgress.findUnique({ where: { userId }, select: { xp: true } }),
    repo.level.findMany({
      where: { companyId },
      orderBy: { minXp: 'asc' },
      select: { level: true, minXp: true, title: true },
    }),
  ])

  const xp = progress?.xp ?? 0
  const level = computeLevelProgress(xp, boundaries).level

  return {
    tasks_approved: approved,
    revisions_overcome: revisionsOvercome,
    recognitions_received: recognitions,
    streak_days: streakDays,
    level,
    total_xp: xp,
  }
}

/**
 * Advance the user's streak for `activityAt` and persist it.
 *
 * Returns the new state; `changed` is false when today already counted.
 */
export async function advanceUserStreak(
  tx: TenantTx,
  input: { companyId: string, userId: string, activityAt: Date, timezone: string },
): Promise<{ current: number, longest: number, changed: boolean }> {
  const progress = await tx.userProgress.findUnique({
    where: { userId: input.userId },
    select: { currentStreak: true, longestStreak: true, lastActiveDate: true },
  })

  const before = {
    current: progress?.currentStreak ?? 0,
    longest: progress?.longestStreak ?? 0,
    // `lastActiveDate` is a Postgres DATE, surfaced as midnight-UTC by Prisma,
    // so formatting it back in UTC recovers the exact stored day.
    lastActiveDate: progress?.lastActiveDate ? dayKey(progress.lastActiveDate, 'UTC') : null,
  }

  const result = advanceStreak(before, input.activityAt, input.timezone)
  if (!result.changed) return { current: result.current, longest: result.longest, changed: false }

  await tx.userProgress.update({
    where: { userId: input.userId },
    data: {
      currentStreak: result.current,
      longestStreak: result.longest,
      lastActiveDate: new Date(`${result.lastActiveDate}T00:00:00.000Z`),
    },
  })

  return { current: result.current, longest: result.longest, changed: true }
}

/**
 * Run the full gamification pass after a task approval.
 *
 * Order matters: the streak is advanced first so the `streak_days` metric the
 * achievements see already reflects today. Achievements that unlock pay their
 * XP and coins through the ledgers and award any badges linked to them.
 */
export async function runGamification(
  tx: TenantTx,
  input: { companyId: string, userId: string, activityAt: Date, timezone: string },
): Promise<GamificationOutcome> {
  const streak = await advanceUserStreak(tx, input)
  const metrics = await computeMetrics(tx, input.companyId, input.userId, streak.current)

  const { achievements, badges } = await unlockDueAchievements(tx, {
    companyId: input.companyId,
    userId: input.userId,
    metrics,
  })

  return { streak, achievements, badges }
}

/**
 * Evaluate the achievement catalogue against a metric snapshot and unlock
 * whatever is due.
 *
 * Split out of `runGamification` because a challenge payout is the other event
 * that can push a user over a milestone: the reward's XP lands in the ledger,
 * and the achievement it unlocked should surface in the same breath rather
 * than at some later approval. Same transaction, same idempotency rules.
 */
export async function unlockDueAchievements(
  tx: TenantTx,
  input: { companyId: string, userId: string, metrics: GamificationMetrics },
): Promise<{ achievements: AchievementGrant[], badges: GamificationOutcome['badges'] }> {
  const catalogue = await tx.achievement.findMany({
    where: { companyId: input.companyId, status: 'ACTIVE' },
    include: { badges: true },
  })

  const achievements: AchievementGrant[] = []
  const badges: GamificationOutcome['badges'] = []

  for (const achievement of catalogue) {
    if (!evaluateAchievement(achievement.criteria as unknown, input.metrics)) continue

    // Check-then-create, not catch-a-unique-violation: a constraint violation
    // aborts the *whole* Postgres transaction, so the old try/catch pattern
    // poisoned every subsequent write. The unique (userId, achievementId)
    // index is still the hard guarantee — it just never fires in the normal,
    // sequential case now, only when two first-approvals truly race.
    const existing = await tx.userAchievement.findUnique({
      where: {
        userId_achievementId: { userId: input.userId, achievementId: achievement.id },
      },
      select: { id: true },
    })
    if (existing) continue

    await tx.userAchievement.create({
      data: {
        companyId: input.companyId,
        userId: input.userId,
        achievementId: achievement.id,
        progress: input.metrics,
      },
      select: { id: true },
    })

    if (achievement.xpReward > 0) {
      await applyXpDelta(tx, {
        companyId: input.companyId,
        userId: input.userId,
        amount: achievement.xpReward,
        source: 'ACHIEVEMENT',
        reason: achievement.title,
        referenceType: 'Achievement',
        referenceId: achievement.id,
        idempotencyKey: `achievement:${achievement.id}:${input.userId}:xp`,
      })
    }

    if (achievement.coinReward > 0) {
      await applyCoinDelta(tx, {
        companyId: input.companyId,
        userId: input.userId,
        amount: achievement.coinReward,
        type: 'ACHIEVEMENT_REWARD',
        source: 'ACHIEVEMENT',
        reason: achievement.title,
        referenceType: 'Achievement',
        referenceId: achievement.id,
        idempotencyKey: `achievement:${achievement.id}:${input.userId}:coins`,
      })
    }

    let badge: AchievementGrant['badge'] = null
    for (const linked of achievement.badges) {
      // Same check-then-create discipline as the unlock row above: the
      // (userId, badgeId) unique index is the guarantee, not the write path.
      const held = await tx.userBadge.findUnique({
        where: { userId_badgeId: { userId: input.userId, badgeId: linked.id } },
        select: { id: true },
      })
      if (held) continue

      await tx.userBadge.create({
        data: { companyId: input.companyId, userId: input.userId, badgeId: linked.id },
        select: { id: true },
      })

      const entry = { id: linked.id, name: linked.name, iconKey: linked.iconKey, tone: linked.tone }
      badges.push(entry)
      badge = entry
    }

    await notify(tx, {
      companyId: input.companyId,
      userId: input.userId,
      type: 'ACHIEVEMENT_UNLOCKED',
      title: 'دستاورد تازه باز شد',
      message: `«${achievement.title}» را کسب کردید`,
      metadata: { achievementId: achievement.id, achievementKey: achievement.key, xp: achievement.xpReward, coins: achievement.coinReward },
    })

    achievements.push({
      key: achievement.key,
      title: achievement.title,
      description: achievement.description,
      iconKey: achievement.iconKey,
      xp: achievement.xpReward,
      coins: achievement.coinReward,
      badge,
    })
  }

  return { achievements, badges }
}
