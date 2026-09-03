import { nextStreakMilestone, streakMilestones } from '#shared/utils/streak'

import { requireAuth } from '../../utils/auth'
import { computeMetrics } from '../../utils/gamification'
import { createTenantClient } from '../../utils/tenant'

/**
 * `GET /api/achievements` — achievement catalogue merged with the caller's
 * unlock state, their badge shelf, and their streak with its milestones.
 *
 * Achievements are data (an admin adds a row with a `key` and a `criteria`
 * JSON); this endpoint only overlays the caller's progress on that catalogue.
 */
export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const db = createTenantClient(auth)

  const [achievements, unlocked, badges, progress] = await Promise.all([
    db.achievement.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        key: true,
        title: true,
        description: true,
        type: true,
        criteria: true,
        xpReward: true,
        coinReward: true,
        iconKey: true,
      },
    }),
    db.userAchievement.findMany({
      where: { userId: auth.userId },
      select: { achievementId: true, unlockedAt: true },
    }),
    db.userBadge.findMany({
      where: { userId: auth.userId },
      orderBy: { awardedAt: 'desc' },
      select: {
        awardedAt: true,
        badge: { select: { id: true, name: true, description: true, iconKey: true, tone: true, imageUrl: true } },
      },
    }),
    db.userProgress.findUnique({
      where: { userId: auth.userId },
      select: { currentStreak: true, longestStreak: true },
    }),
  ])

  const streak = {
    current: progress?.currentStreak ?? 0,
    longest: progress?.longestStreak ?? 0,
  }

  const metrics = await computeMetrics(db, auth.companyId, auth.userId, streak.current)
  const unlockedById = new Map(unlocked.map(row => [row.achievementId, row.unlockedAt]))

  return {
    streak: {
      ...streak,
      milestones: streakMilestones(streak.current),
      next: nextStreakMilestone(streak.current),
    },
    achievements: achievements.map((achievement) => {
      const rule = achievement.criteria as { metric?: string, threshold?: number } | null
      const target = typeof rule?.threshold === 'number' ? rule.threshold : null
      const current = rule?.metric ? metrics[rule.metric] ?? 0 : null

      return {
        id: achievement.id,
        key: achievement.key,
        title: achievement.title,
        description: achievement.description,
        type: achievement.type,
        xpReward: achievement.xpReward,
        coinReward: achievement.coinReward,
        iconKey: achievement.iconKey,
        unlocked: unlockedById.has(achievement.id),
        unlockedAt: unlockedById.get(achievement.id)?.toISOString() ?? null,
        progress: !unlockedById.has(achievement.id) && target !== null && current !== null
          ? { current, target }
          : null,
      }
    }),
    badges: badges.map(row => ({ ...row.badge, awardedAt: row.awardedAt.toISOString() })),
    totals: {
      unlocked: unlocked.length,
      available: achievements.length,
      badges: badges.length,
    },
  }
})
