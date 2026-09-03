import { nextStreakMilestone, streakMilestones } from '#shared/utils/streak'

import { requireAuth } from '../utils/auth'
import { computeMetrics } from '../utils/gamification'
import { resolveLevelProgress } from '../utils/levels'
import { createTenantClient } from '../utils/tenant'

/**
 * `GET /api/profile` — the employee's own gamified profile.
 *
 * One round trip for the whole profile surface: identity, server-computed
 * level and XP progress, the authoritative wallet balance, badges,
 * achievements (with progress toward the locked ones), the streak and a recent
 * activity feed. Everything is self-scoped; there is no `?userId=`.
 */
export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const db = createTenantClient(auth)

  const [identity, wallet, progress, xpAgg, achievements, unlocked, badges, xpActivity] = await Promise.all([
    db.user.findUnique({ where: { id: auth.userId }, select: { jobTitle: true } }),
    db.wallet.findUnique({
      where: { userId: auth.userId },
      select: { balance: true, lifetimeEarned: true, lifetimeSpent: true },
    }),
    db.userProgress.findUnique({
      where: { userId: auth.userId },
      select: { xp: true, coins: true, currentStreak: true, longestStreak: true },
    }),
    db.xpTransaction.aggregate({ where: { userId: auth.userId }, _sum: { amount: true } }),
    db.achievement.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'asc' },
      select: { id: true, key: true, title: true, description: true, iconKey: true, criteria: true, xpReward: true, coinReward: true },
    }),
    db.userAchievement.findMany({
      where: { userId: auth.userId },
      select: { achievementId: true, unlockedAt: true },
      orderBy: { unlockedAt: 'desc' },
    }),
    db.userBadge.findMany({
      where: { userId: auth.userId },
      orderBy: { awardedAt: 'desc' },
      select: {
        awardedAt: true,
        badge: { select: { id: true, name: true, description: true, iconKey: true, tone: true, imageUrl: true } },
      },
    }),
    db.xpTransaction.findMany({
      where: { userId: auth.userId },
      orderBy: { createdAt: 'desc' },
      take: 15,
      select: { id: true, amount: true, source: true, reason: true, createdAt: true },
    }),
  ])

  const xp = progress?.xp ?? 0
  const level = await resolveLevelProgress(db, auth.companyId, xp)

  const streak = {
    current: progress?.currentStreak ?? 0,
    longest: progress?.longestStreak ?? 0,
  }

  const metrics = await computeMetrics(db, auth.companyId, auth.userId, streak.current)
  const unlockedById = new Map(unlocked.map(row => [row.achievementId, row.unlockedAt]))

  // Achievement catalogue merged with unlock state and, for locked rows, how
  // far the metric has come — so the profile can show «۳ از ۱۰ تسک».
  const achievementList = achievements.map((achievement) => {
    const unlockedAt = unlockedById.get(achievement.id)
    const rule = achievement.criteria as { metric?: string, threshold?: number } | null
    const target = typeof rule?.threshold === 'number' ? rule.threshold : null
    const current = rule?.metric ? metrics[rule.metric] ?? 0 : null

    return {
      id: achievement.id,
      key: achievement.key,
      title: achievement.title,
      description: achievement.description,
      iconKey: achievement.iconKey,
      xpReward: achievement.xpReward,
      coinReward: achievement.coinReward,
      unlocked: unlockedById.has(achievement.id),
      unlockedAt: unlockedAt?.toISOString() ?? null,
      progress: !unlockedById.has(achievement.id) && target !== null && current !== null
        ? { current, target }
        : null,
    }
  })

  // Recent activity: the XP ledger (task / achievement / recognition grants)
  // interleaved with newly unlocked achievements, newest first.
  const activity = [
    ...xpActivity.map(row => ({
      id: `xp:${row.id}`,
      kind: row.source,
      title: row.reason ?? 'XP',
      xp: row.amount,
      at: row.createdAt,
    })),
    ...unlocked.map(row => ({
      id: `ach:${row.achievementId}`,
      kind: 'ACHIEVEMENT',
      title: null,
      xp: 0,
      at: row.unlockedAt,
    })),
  ]
    .sort((a, b) => b.at.getTime() - a.at.getTime())
    .slice(0, 12)

  return {
    user: {
      id: auth.userId,
      fullName: auth.fullName,
      jobTitle: identity?.jobTitle ?? null,
      email: auth.email,
      phone: auth.phone,
      avatarUrl: auth.avatarUrl,
      role: auth.role,
    },
    company: { id: auth.company.id, name: auth.company.name, timezone: auth.company.timezone },
    level: {
      current: level.level,
      title: level.title,
      iconKey: level.iconKey,
      percent: level.percent,
      currentXp: level.currentXp,
      neededXp: level.neededXp,
      next: level.next,
    },
    xp: { total: xp, lifetimeXp: xpAgg._sum.amount ?? xp },
    coins: {
      balance: wallet?.balance ?? progress?.coins ?? 0,
      lifetimeEarned: wallet?.lifetimeEarned ?? 0,
      lifetimeSpent: wallet?.lifetimeSpent ?? 0,
    },
    streak: {
      ...streak,
      milestones: streakMilestones(streak.current),
      next: nextStreakMilestone(streak.current),
    },
    badges: badges.map(row => ({ ...row.badge, awardedAt: row.awardedAt.toISOString() })),
    achievements: achievementList,
    totals: {
      unlocked: unlocked.length,
      available: achievementList.length,
      badges: badges.length,
    },
    recentActivity: activity.map(row => ({
      id: row.id,
      kind: row.kind,
      title: row.title,
      xp: row.xp,
      at: row.at.toISOString(),
    })),
  }
})
