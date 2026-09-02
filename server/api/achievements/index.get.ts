import { requireAuth } from '../../utils/auth'
import { createTenantClient } from '../../utils/tenant'

/** Achievement catalogue merged with the caller's unlock state. */
export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const db = createTenantClient(auth)

  const [achievements, unlocked, badges] = await Promise.all([
    db.achievement.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        key: true,
        title: true,
        description: true,
        type: true,
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
      select: { awardedAt: true, badge: { select: { id: true, name: true, description: true, imageUrl: true } } },
    }),
  ])

  const unlockedById = new Map(unlocked.map(row => [row.achievementId, row.unlockedAt]))

  return {
    achievements: achievements.map(achievement => ({
      ...achievement,
      unlocked: unlockedById.has(achievement.id),
      unlockedAt: unlockedById.get(achievement.id)?.toISOString() ?? null,
    })),
    badges: badges.map(row => ({ ...row.badge, awardedAt: row.awardedAt.toISOString() })),
    totals: {
      unlocked: unlocked.length,
      available: achievements.length,
      badges: badges.length,
    },
  }
})
