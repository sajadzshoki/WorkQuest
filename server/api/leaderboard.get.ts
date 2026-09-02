import { leaderboardRangeSchema } from '#shared/schemas'

import { requireAuth } from '../utils/auth'
import { readValidatedQuery } from '../utils/http'
import { createTenantClient } from '../utils/tenant'

/**
 * Company leaderboard.
 *
 * Phase 1 will switch XP to a windowed sum over the ledger; for now the ranking
 * is driven by the denormalised `UserProgress.xp`, which keeps the query cheap
 * and tenant-scoped.
 */
export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const query = readValidatedQuery(event, leaderboardRangeSchema)
  const db = createTenantClient(auth)

  const rows = await db.userProgress.findMany({
    orderBy: [{ xp: 'desc' }, { updatedAt: 'asc' }],
    take: query.limit,
    select: {
      xp: true,
      coins: true,
      currentStreak: true,
      user: {
        select: { id: true, fullName: true, avatarUrl: true, jobTitle: true, role: true },
      },
    },
  })

  const me = await db.userProgress.findUnique({
    where: { userId: auth.userId },
    select: { xp: true },
  })

  const higher = await db.userProgress.count({ where: { xp: { gt: me?.xp ?? 0 } } })

  return {
    range: query.range,
    items: rows.map((row, index) => ({
      rank: index + 1,
      xp: row.xp,
      coins: row.coins,
      currentStreak: row.currentStreak,
      isMe: row.user.id === auth.userId,
      user: row.user,
    })),
    me: { userId: auth.userId, rank: higher + 1, xp: me?.xp ?? 0 },
  }
})
