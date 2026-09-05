import { requireAuth } from '../utils/auth'
import { resolveLevelProgress } from '../utils/levels'
import { createTenantClient } from '../utils/tenant'

/** Everything the app shell needs on first paint: identity + gamification state. */
export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const db = createTenantClient(auth)

  const progress = await db.userProgress.findUnique({ where: { userId: auth.userId } })

  const xp = progress?.xp ?? 0
  const level = await resolveLevelProgress(db, auth.companyId, xp)

  const unreadNotifications = await db.notification.count({
    where: { userId: auth.userId, readAt: null },
  })

  return {
    user: {
      id: auth.userId,
      fullName: auth.fullName,
      email: auth.email,
      phone: auth.phone,
      role: auth.role,
      avatarUrl: auth.avatarUrl,
      locale: auth.locale,
    },
    company: auth.company,
    gamification: {
      xp,
      coins: progress?.coins ?? 0,
      level: level.level,
      levelTitle: level.title,
      levelPercent: level.percent,
      currentStreak: progress?.currentStreak ?? 0,
      longestStreak: progress?.longestStreak ?? 0,
    },
    unreadNotifications,
  }
})
