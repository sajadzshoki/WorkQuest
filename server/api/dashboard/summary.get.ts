import { computeLevelProgress } from '#shared/utils/xp'

import { requireAuth } from '../../utils/auth'
import { createTenantClient } from '../../utils/tenant'

/**
 * Aggregated dashboard payload.
 *
 * Read-only and deliberately chatty in one request: the dashboard is the first
 * screen every user sees, so it is better to spend one round trip here than
 * five from the browser.
 */
export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const db = createTenantClient(auth)
  const since = new Date(Date.now() - 30 * 86_400_000)

  const [progress, boundaries, taskCounts, openTasks, leaderboard, recognitions, achievements, challenge]
    = await Promise.all([
      db.userProgress.findUnique({ where: { userId: auth.userId } }),
      db.level.findMany({ orderBy: { level: 'asc' }, select: { level: true, minXp: true, title: true, iconKey: true } }),
      db.task.groupBy({
        by: ['status'],
        where: { assigneeId: auth.userId },
        _count: { _all: true },
      }),
      db.task.findMany({
        where: { assigneeId: auth.userId, status: { in: ['ASSIGNED', 'IN_PROGRESS', 'SUBMITTED'] } },
        orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
        take: 5,
        select: {
          id: true,
          title: true,
          status: true,
          priority: true,
          dueDate: true,
          xpReward: true,
          coinReward: true,
        },
      }),
      db.userProgress.findMany({
        orderBy: { xp: 'desc' },
        take: 5,
        select: { xp: true, user: { select: { id: true, fullName: true, avatarUrl: true, jobTitle: true } } },
      }),
      db.recognition.findMany({
        where: { toUserId: auth.userId, createdAt: { gte: since } },
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: {
          id: true,
          message: true,
          type: true,
          createdAt: true,
          fromUser: { select: { fullName: true, avatarUrl: true } },
        },
      }),
      db.userAchievement.count({ where: { userId: auth.userId } }),
      db.challenge.findFirst({
        where: { status: 'ACTIVE' },
        orderBy: { endsAt: 'asc' },
        select: { id: true, title: true, goalKey: true, goalValue: true, xpReward: true, coinReward: true, endsAt: true },
      }),
    ])

  const xp = progress?.xp ?? 0
  const level = computeLevelProgress(xp, boundaries)
  const counts = Object.fromEntries(taskCounts.map(row => [row.status, row._count._all]))

  const myRankRow = await db.userProgress.count({
    where: { xp: { gt: xp } },
  })

  return {
    gamification: {
      xp,
      coins: progress?.coins ?? 0,
      level: level.level,
      levelTitle: level.title,
      levelPercent: level.percent,
      levelCurrentXp: level.currentXp,
      levelNeededXp: level.neededXp,
      currentStreak: progress?.currentStreak ?? 0,
      longestStreak: progress?.longestStreak ?? 0,
      rank: myRankRow + 1,
      achievementsUnlocked: achievements,
    },
    tasks: {
      open: openTasks,
      counts,
    },
    leaderboard: leaderboard.map((row, index) => ({
      rank: index + 1,
      xp: row.xp,
      user: row.user,
    })),
    recognitions,
    activeChallenge: challenge,
  }
})
