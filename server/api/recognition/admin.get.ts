import { requirePermission } from '../../utils/auth'
import { configuredFrequency, ensureActiveCycle } from '../../utils/recognition'
import { createTenantClient } from '../../utils/tenant'

/**
 * `GET /api/recognition/admin` — the configuration surface: every category
 * (including disabled ones, with their live vote counts), the winner-title
 * catalogue, the badge catalogue and the active cycle.
 */
export default defineEventHandler(async (event) => {
  const auth = requirePermission(event, 'recognition:manage')
  const db = createTenantClient(auth)
  const now = new Date()

  const frequency = await configuredFrequency(db, auth.companyId)
  const cycle = await ensureActiveCycle(db, auth.companyId, frequency, now, auth.company.timezone)

  const [categories, titles, badges] = await Promise.all([
    db.recognitionCategory.findMany({
      where: { companyId: auth.companyId },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      select: {
        id: true,
        name: true,
        description: true,
        iconKey: true,
        tone: true,
        sortOrder: true,
        isActive: true,
        xpReward: true,
        coinReward: true,
        titleId: true,
        title: { select: { id: true, name: true } },
        badgeId: true,
        badge: { select: { id: true, name: true } },
        _count: { select: { votes: true } },
      },
    }),
    db.recognitionTitle.findMany({
      where: { companyId: auth.companyId },
      orderBy: [{ isSystem: 'desc' }, { createdAt: 'asc' }],
      select: { id: true, name: true, description: true, isSystem: true },
    }),
    db.badge.findMany({
      where: { companyId: auth.companyId },
      orderBy: { createdAt: 'asc' },
      select: { id: true, name: true, description: true, iconKey: true, tone: true },
    }),
  ])

  return {
    cycle: {
      id: cycle.id,
      frequency: cycle.frequency,
      startsAt: cycle.startsAt.toISOString(),
      endsAt: cycle.endsAt.toISOString(),
    },
    categories: categories.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description,
      iconKey: category.iconKey,
      tone: category.tone,
      sortOrder: category.sortOrder,
      isActive: category.isActive,
      xpReward: category.xpReward,
      coinReward: category.coinReward,
      title: category.title,
      badge: category.badge,
      voteCount: category._count.votes,
    })),
    titles,
    badges,
  }
})
