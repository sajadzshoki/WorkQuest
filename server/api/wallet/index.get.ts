import { requireAuth } from '../../utils/auth'
import { resolveLevelProgress } from '../../utils/levels'
import { createTenantClient } from '../../utils/tenant'
import { COIN_TRANSACTION_SELECT } from '../../utils/wallet'

/**
 * `GET /api/wallet` — the signed-in user's gamification state.
 *
 * Everything the progress card needs in one round trip: XP, level, coin
 * balance and the most recent ledger rows. Deliberately self-scoped; there is
 * no `?userId=` parameter, so one employee cannot read another's wallet.
 */
export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const db = createTenantClient(auth)

  const [wallet, progress, recent, earnedAgg, spentAgg] = await Promise.all([
    db.wallet.findUnique({
      where: { userId: auth.userId },
      select: { balance: true, lifetimeEarned: true, lifetimeSpent: true },
    }),
    db.userProgress.findUnique({
      where: { userId: auth.userId },
      select: { xp: true, coins: true, currentStreak: true, longestStreak: true },
    }),
    db.coinTransaction.findMany({
      where: { userId: auth.userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: COIN_TRANSACTION_SELECT,
    }),
    db.xpTransaction.aggregate({
      where: { userId: auth.userId },
      _sum: { amount: true },
    }),
    db.coinTransaction.count({ where: { userId: auth.userId } }),
  ])

  const xp = progress?.xp ?? 0
  const level = await resolveLevelProgress(db, auth.companyId, xp)

  // The wallet row is authoritative. `UserProgress.coins` is only a mirror, so
  // if the row is somehow missing we fall back rather than reporting zero.
  const balance = wallet?.balance ?? progress?.coins ?? 0

  return {
    xp,
    lifetimeXp: earnedAgg._sum.amount ?? xp,
    level: {
      current: level.level,
      title: level.title,
      percent: level.percent,
      currentXp: level.currentXp,
      neededXp: level.neededXp,
    },
    coins: {
      balance,
      lifetimeEarned: wallet?.lifetimeEarned ?? 0,
      lifetimeSpent: wallet?.lifetimeSpent ?? 0,
      transactionCount: spentAgg,
    },
    streak: {
      current: progress?.currentStreak ?? 0,
      longest: progress?.longestStreak ?? 0,
    },
    recentTransactions: recent,
  }
})
