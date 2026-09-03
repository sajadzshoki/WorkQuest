import { requireAuth } from '../../utils/auth'
import { configuredFrequency, ensureActiveCycle, finalizeDueCycles } from '../../utils/recognition'
import { createTenantClient } from '../../utils/tenant'

/**
 * `GET /api/recognition` — the voting board: the active cycle, the categories,
 * the caller's *own* selections, the coworker directory and the latest
 * finalized results.
 *
 * Privacy: the only votes ever returned are the caller's own (`myVote`). Every
 * other surface is aggregated — winners and counts, never who voted for whom.
 */
export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const db = createTenantClient(auth)
  const now = new Date()

  // Make sure any cycle whose window has closed is tallied before we read.
  await finalizeDueCycles(db, auth.companyId, now)

  const frequency = await configuredFrequency(db, auth.companyId)
  const cycle = await ensureActiveCycle(db, auth.companyId, frequency, now, auth.company.timezone)

  const [categories, myVotes, coworkers, finalizedCycles] = await Promise.all([
    db.recognitionCategory.findMany({
      where: { companyId: auth.companyId, isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      select: {
        id: true,
        name: true,
        description: true,
        iconKey: true,
        tone: true,
      },
    }),
    db.recognitionVote.findMany({
      where: { cycleId: cycle.id, voterId: auth.userId },
      select: { categoryId: true, nominee: { select: { id: true, fullName: true, avatarUrl: true } } },
    }),
    db.user.findMany({
      where: { companyId: auth.companyId, status: 'ACTIVE', id: { not: auth.userId } },
      orderBy: { fullName: 'asc' },
      select: { id: true, fullName: true, avatarUrl: true, jobTitle: true },
    }),
    db.recognitionCycle.findMany({
      where: { companyId: auth.companyId, status: 'FINALIZED' },
      orderBy: { finalizedAt: 'desc' },
      take: 3,
      select: {
        id: true,
        frequency: true,
        title: true,
        startsAt: true,
        endsAt: true,
        finalizedAt: true,
        results: {
          orderBy: { voteCount: 'desc' },
          select: {
            id: true,
            voteCount: true,
            titleName: true,
            xpReward: true,
            coinReward: true,
            winner: { select: { id: true, fullName: true, avatarUrl: true, jobTitle: true } },
            category: { select: { id: true, name: true, iconKey: true, tone: true } },
          },
        },
      },
    }),
  ])

  const myVoteByCategory = new Map(myVotes.map(vote => [vote.categoryId, vote.nominee]))

  return {
    cycle: {
      id: cycle.id,
      frequency: cycle.frequency,
      title: cycle.title,
      startsAt: cycle.startsAt.toISOString(),
      endsAt: cycle.endsAt.toISOString(),
      finalizedAt: cycle.finalizedAt?.toISOString() ?? null,
    },
    categories: categories.map(category => ({
      ...category,
      myVote: myVoteByCategory.get(category.id) ?? null,
    })),
    coworkers,
    results: finalizedCycles.map(cycle => ({
      id: cycle.id,
      frequency: cycle.frequency,
      title: cycle.title,
      startsAt: cycle.startsAt.toISOString(),
      endsAt: cycle.endsAt.toISOString(),
      finalizedAt: cycle.finalizedAt?.toISOString() ?? null,
      winners: cycle.results.map(result => ({
        id: result.id,
        voteCount: result.voteCount,
        titleName: result.titleName,
        xpReward: result.xpReward,
        coinReward: result.coinReward,
        user: result.winner,
        category: result.category,
      })),
    })),
  }
})
