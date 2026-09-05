import { requireAuth } from '../../utils/auth'
import { refreshChallenges } from '../../utils/challenges'
import { buildLeaderboard } from '../../utils/leaderboard'
import { resolveLevelProgress } from '../../utils/levels'
import { createTenantClient } from '../../utils/tenant'

/**
 * Aggregated dashboard payload.
 *
 * Read-only and deliberately chatty in one request: the dashboard is the first
 * screen every user sees, so it is better to spend one round trip here than
 * five from the browser.
 *
 * The "top performers" strip is the **weekly board**, served by the same
 * service as `/api/leaderboard`: one definition of rank, one cap on how many
 * rows anybody sees, and no all-time ranking anywhere in the product.
 */
export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const db = createTenantClient(auth)
  const now = new Date()
  const since = new Date(Date.now() - 30 * 86_400_000)

  // Resolve first, so the challenge the card below shows is never a stale one.
  await refreshChallenges(db, auth.companyId, now)

  const [progress, taskCounts, board, recognitions, achievements, challenge]
    = await Promise.all([
      db.userProgress.findUnique({ where: { userId: auth.userId } }),
      db.task.groupBy({
        by: ['status'],
        where: { assigneeId: auth.userId },
        _count: { _all: true },
      }),
      buildLeaderboard(db, auth, { period: 'week', scope: 'company', limit: 3 }),
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
        select: {
          id: true,
          title: true,
          type: true,
          goalKey: true,
          goalValue: true,
          progress: true,
          xpReward: true,
          coinReward: true,
          endsAt: true,
          participants: { select: { userId: true, progress: true, status: true } },
        },
      }),
    ])

  const xp = progress?.xp ?? 0
  const level = await resolveLevelProgress(db, auth.companyId, xp)
  const counts = Object.fromEntries(taskCounts.map(row => [row.status, row._count._all]))

  // The card shows the bar the caller is actually racing: their own for an
  // individual challenge, the team's shared one for a team push. Both are
  // engine-computed from real data — never a placeholder.
  const mine = challenge?.participants.find(row => row.userId === auth.userId) ?? null
  const activeChallenge = challenge
    ? {
        id: challenge.id,
        title: challenge.title,
        type: challenge.type,
        goalKey: challenge.goalKey,
        goalValue: challenge.goalValue,
        progress: challenge.type === 'INDIVIDUAL' ? (mine?.progress ?? 0) : challenge.progress,
        xpReward: challenge.xpReward,
        coinReward: challenge.coinReward,
        endsAt: challenge.endsAt.toISOString(),
        participantsCount: challenge.participants.length,
      }
    : null

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
      /** This week's place, or null before the caller has scored anything. */
      rank: board.me.rank,
      pointsToNextRank: board.me.pointsToNextRank,
      achievementsUnlocked: achievements,
    },
    // Counts only: the task *lists* are served by `/api/tasks/dashboard`, which
    // owns every task surface and applies the lifecycle rules.
    tasks: { counts },
    leaderboard: {
      period: board.period,
      window: board.window,
      participants: board.participants,
      entries: board.entries.map(entry => ({
        rank: entry.rank,
        tied: entry.tied,
        score: entry.score,
        periodXp: entry.periodXp,
        achievementsUnlocked: entry.achievementsUnlocked,
        isMe: entry.isMe,
        user: entry.user,
      })),
    },
    recognitions,
    activeChallenge,
  }
})
