import { requireAuth } from '../../utils/auth'
import { createTenantClient } from '../../utils/tenant'

/** Reward catalogue plus the caller's balance and redemption history. */
export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const db = createTenantClient(auth)

  const [rewards, progress, redemptions] = await Promise.all([
    db.reward.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { cost: 'asc' },
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        cost: true,
        stock: true,
        imageUrl: true,
      },
    }),
    db.userProgress.findUnique({ where: { userId: auth.userId }, select: { coins: true } }),
    db.rewardRedemption.findMany({
      where: { userId: auth.userId },
      orderBy: { requestedAt: 'desc' },
      take: 10,
      select: {
        id: true,
        status: true,
        cost: true,
        requestedAt: true,
        decidedAt: true,
        note: true,
        reward: { select: { id: true, title: true, type: true, imageUrl: true } },
      },
    }),
  ])

  const coins = progress?.coins ?? 0

  return {
    balance: coins,
    rewards: rewards.map(reward => ({
      ...reward,
      affordable: reward.cost <= coins,
      available: reward.stock === null || reward.stock > 0,
    })),
    redemptions: redemptions.map(row => ({
      id: row.id,
      status: row.status,
      cost: row.cost,
      note: row.note,
      requestedAt: row.requestedAt.toISOString(),
      decidedAt: row.decidedAt?.toISOString() ?? null,
      reward: row.reward,
    })),
  }
})
