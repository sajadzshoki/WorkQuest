/**
 * Server-side aggregation for the company analytics dashboard.
 *
 * One request, one coherent picture: the `/api/analytics/overview` handler
 * delegates everything here so the maths lives in exactly one place. The
 * numbers are always **derived from the ledgers and task rows** — never
 * cached, never faked — and every average respects the honest-null rule:
 * an empty population has no average, not an average of zero.
 *
 * Scoping mirrors the management chain, not the org chart: an OWNER/ADMIN
 * reads the whole company, a MANAGER reads their own subordinates (the
 * transitive reports chain, self excluded) plus the teams they lead, and an
 * EMPLOYEE never reaches this module — the permission check stops them first.
 *
 * Where a score comes from: approval *requires* a score and APPROVED is a
 * terminal status, so every approved task has exactly one APPROVED
 * `TaskReview` carrying its grade. That review — not a column on `Task` —
 * is the single source of "performance".
 */

import type {
  AnalyticsDayPoint,
  AnalyticsEmployeeRow,
  AnalyticsKpis,
  AnalyticsOverviewResponse,
  AnalyticsTeamRow,
  AuthContext,
} from '#shared/types/api'

import {
  averageOf,
  buildAverageDaySeries,
  buildDaySeries,
  dayKeyRange,
  isOnTime,
  localDayKey,
  rateOrNull,
} from '#shared/utils/analytics'
import { CLOSED_TASK_STATUSES } from '#shared/utils/task'

import { getManagedUserIds } from './auth'
import { createTenantClient } from './tenant'

/** How many days the trend charts cover. */
export const ANALYTICS_RANGE_DAYS = 30

export async function buildAnalyticsOverview(auth: AuthContext): Promise<AnalyticsOverviewResponse> {
  const db = createTenantClient(auth)
  const now = new Date()
  const timeZone = auth.company.timezone

  const companyWide = auth.role === 'OWNER' || auth.role === 'ADMIN'
  // Subordinates for a manager; `null` means "the whole company".
  const managedIds = companyWide ? null : await getManagedUserIds(auth.companyId, auth.userId)

  const dayKeys = dayKeyRange(ANALYTICS_RANGE_DAYS, timeZone, now)
  // A deliberately generous fetch window: bucketing is done on the
  // company-local day key, so the DB filter only has to be *wider* than the
  // local 30-day window (a full extra day absorbs any timezone offset).
  const seriesFrom = new Date(now.getTime() - (ANALYTICS_RANGE_DAYS + 1) * 86_400_000)

  // `undefined` / `{}` means "no constraint" — the tenant client still stamps
  // companyId, so an unconstrained query reads the whole company and nothing
  // else.
  const userScope = managedIds ? { id: { in: managedIds } } : {}
  const ledgerScope = managedIds ? { userId: { in: managedIds } } : {}
  const taskScope = managedIds ? { assigneeId: { in: managedIds } } : {}

  const [
    users,
    tasks,
    reviews,
    xpRows,
    xpTotal,
    coinRows,
    coinEarnedTotal,
    coinRedeemedTotal,
    progressRows,
    walletRows,
    achievementCounts,
    recognitionCounts,
    levels,
    teams,
  ] = await Promise.all([
    db.user.findMany({
      where: userScope,
      select: {
        id: true,
        fullName: true,
        avatarUrl: true,
        jobTitle: true,
        role: true,
        status: true,
        teamMemberships: { select: { team: { select: { name: true } } } },
      },
    }),
    db.task.findMany({
      where: taskScope,
      select: {
        id: true,
        status: true,
        assigneeId: true,
        dueDate: true,
        completedAt: true,
      },
    }),
    // Every grade in scope: one APPROVED review per approved task, carrying
    // the score. The nested task filter needs no companyId — TaskReview and
    // Task are stamped with the same one, and the tenant scope covers the row.
    db.taskReview.findMany({
      where: { decision: 'APPROVED', task: taskScope },
      select: {
        score: true,
        task: { select: { assigneeId: true, teamId: true, completedAt: true, dueDate: true } },
      },
    }),
    db.xpTransaction.findMany({
      where: { ...ledgerScope, createdAt: { gte: seriesFrom } },
      select: { amount: true, createdAt: true },
    }),
    db.xpTransaction.aggregate({
      where: ledgerScope,
      _sum: { amount: true },
    }),
    db.coinTransaction.findMany({
      where: { ...ledgerScope, createdAt: { gte: seriesFrom } },
      select: { amount: true, type: true, createdAt: true },
    }),
    db.coinTransaction.aggregate({
      where: { ...ledgerScope, amount: { gt: 0 } },
      _sum: { amount: true },
    }),
    db.coinTransaction.aggregate({
      where: { ...ledgerScope, type: 'REWARD_REDEMPTION' },
      _sum: { amount: true },
    }),
    db.userProgress.findMany({
      where: ledgerScope,
      select: { userId: true, xp: true, currentStreak: true },
    }),
    db.wallet.findMany({
      where: ledgerScope,
      select: { userId: true, lifetimeEarned: true, lifetimeSpent: true },
    }),
    db.userAchievement.groupBy({
      by: ['userId'],
      where: ledgerScope,
      _count: { _all: true },
    }),
    db.recognition.groupBy({
      by: ['toUserId'],
      where: managedIds ? { toUserId: { in: managedIds } } : {},
      _count: { _all: true },
    }),
    db.level.findMany({
      orderBy: { minXp: 'asc' },
      select: { level: true, minXp: true, title: true },
    }),
    db.team.findMany({
      where: companyWide ? {} : { leadId: auth.userId },
      select: { id: true, name: true, members: { select: { userId: true } } },
    }),
  ])

  // ---- tasks & grades, in-memory -----------------------------------------

  const approved = tasks.filter(task => task.status === 'APPROVED')
  const scoredReviews = reviews.filter(review => review.score !== null)
  const approvedWithDueDate = approved.filter(task => task.dueDate !== null)
  const onTimeTasks = approvedWithDueDate.filter(task => isOnTime(task))
  const isOverdue = (task: { dueDate: Date | null, status: string }) =>
    task.dueDate !== null
    && task.dueDate.getTime() < now.getTime()
    && !CLOSED_TASK_STATUSES.includes(task.status as never)

  const kpis: AnalyticsKpis = {
    totalEmployees: users.length,
    activeEmployees: users.filter(user => user.status === 'ACTIVE').length,
    tasks: tasks.length,
    completedTasks: approved.length,
    pendingReviews: tasks.filter(task => task.status === 'SUBMITTED').length,
    overdueTasks: tasks.filter(isOverdue).length,
    averageScore: averageOf(scoredReviews.map(review => review.score!)),
    onTimeRate: rateOrNull(onTimeTasks.length, approvedWithDueDate.length),
    totalXp: xpTotal._sum.amount ?? 0,
    // Credits are positive ledger rows; redemptions are negative ones, so the
    // magnitude of their sum is what was actually spent on rewards.
    totalCoinsEarned: coinEarnedTotal._sum.amount ?? 0,
    coinsRedeemed: Math.abs(coinRedeemedTotal._sum.amount ?? 0),
  }

  // ---- series -------------------------------------------------------------

  const dayKeyOf = (date: Date) => localDayKey(date, timeZone)
  const inWindow = (date: Date | null): date is Date =>
    date !== null && date >= seriesFrom && dayKeys.includes(dayKeyOf(date))

  const tasksCompletedSeries: AnalyticsDayPoint[] = buildDaySeries(
    approved
      .filter(task => inWindow(task.completedAt))
      .map(task => ({ day: dayKeyOf(task.completedAt!), value: 1 })),
    dayKeys,
  )

  const averageScoreSeries = buildAverageDaySeries(
    scoredReviews
      .filter(review => inWindow(review.task.completedAt))
      .map(review => ({ day: dayKeyOf(review.task.completedAt!), value: review.score! })),
    dayKeys,
  )

  const xpSeries: AnalyticsDayPoint[] = buildDaySeries(
    xpRows
      .filter(row => dayKeys.includes(dayKeyOf(row.createdAt)))
      .map(row => ({ day: dayKeyOf(row.createdAt), value: row.amount })),
    dayKeys,
  )

  const coinsSeries = (() => {
    const earned = new Map<string, number>()
    const redeemed = new Map<string, number>()
    for (const row of coinRows) {
      const day = dayKeyOf(row.createdAt)
      if (!dayKeys.includes(day)) continue
      if (row.amount > 0) earned.set(day, (earned.get(day) ?? 0) + row.amount)
      if (row.type === 'REWARD_REDEMPTION') {
        redeemed.set(day, (redeemed.get(day) ?? 0) + Math.abs(row.amount))
      }
    }
    return dayKeys.map(day => ({
      day,
      earned: earned.get(day) ?? 0,
      redeemed: redeemed.get(day) ?? 0,
    }))
  })()

  // ---- employee rows --------------------------------------------------------

  const progressByUser = new Map(progressRows.map(row => [row.userId, row] as const))
  const walletByUser = new Map(walletRows.map(row => [row.userId, row] as const))
  const achievementsByUser = new Map(
    achievementCounts.map(row => [row.userId, row._count._all] as const),
  )
  const recognitionByUser = new Map(
    recognitionCounts.map(row => [row.toUserId, row._count._all] as const),
  )

  const levelFor = (xp: number) => {
    let matched: { level: number, title: string | null } | null = null
    for (const level of levels) {
      if (level.minXp <= xp) matched = level
      else break
    }
    return matched
  }

  const employees: AnalyticsEmployeeRow[] = users.map((user) => {
    const userTasks = tasks.filter(task => task.assigneeId === user.id)
    const userApproved = userTasks.filter(task => task.status === 'APPROVED')
    const userWithDue = userApproved.filter(task => task.dueDate !== null)
    const userOnTime = userWithDue.filter(task => isOnTime(task))
    const userScored = scoredReviews.filter(review => review.task.assigneeId === user.id)
    const progress = progressByUser.get(user.id)
    const level = progress ? levelFor(progress.xp) : null

    return {
      id: user.id,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      jobTitle: user.jobTitle,
      role: user.role as AnalyticsEmployeeRow['role'],
      teamName: user.teamMemberships[0]?.team.name ?? null,
      tasksCompleted: userApproved.length,
      averageScore: averageOf(userScored.map(review => review.score!)),
      onTimeRate: rateOrNull(userOnTime.length, userWithDue.length),
      xp: progress?.xp ?? 0,
      level: level?.level ?? null,
      levelTitle: level?.title ?? null,
      coinsEarned: walletByUser.get(user.id)?.lifetimeEarned ?? 0,
      coinsSpent: walletByUser.get(user.id)?.lifetimeSpent ?? 0,
      achievements: achievementsByUser.get(user.id) ?? 0,
      recognition: recognitionByUser.get(user.id) ?? 0,
      currentStreak: progress?.currentStreak ?? 0,
    }
  })

  // ---- team rows -------------------------------------------------------------

  const teamTasks = teams.length
    ? await db.task.findMany({
        where: { teamId: { in: teams.map(team => team.id) } },
        select: { teamId: true, status: true, dueDate: true, completedAt: true },
      })
    : []

  const teamsOut: AnalyticsTeamRow[] = teams.map((team) => {
    const rows = teamTasks.filter(task => task.teamId === team.id)
    const teamApproved = rows.filter(task => task.status === 'APPROVED')
    const teamWithDue = teamApproved.filter(task => task.dueDate !== null)
    const teamOnTime = teamWithDue.filter(task => isOnTime(task))
    // The board's grades: for an admin this is every review on the team's
    // tasks; for a manager it is their own subordinates' work there — the
    // same remit every other number on their dashboard respects.
    const teamScored = scoredReviews.filter(review => review.task.teamId === team.id)
    return {
      id: team.id,
      name: team.name,
      memberCount: team.members.length,
      completionRate: rateOrNull(teamApproved.length, rows.length) ?? 0,
      averageScore: averageOf(teamScored.map(review => review.score!)),
      onTimeRate: rateOrNull(teamOnTime.length, teamWithDue.length),
      activeTasks: rows.filter(task => !CLOSED_TASK_STATUSES.includes(task.status as never)).length,
      overdueTasks: rows.filter(isOverdue).length,
    }
  })

  return {
    scope: companyWide ? 'company' : 'team',
    range: {
      days: ANALYTICS_RANGE_DAYS,
      from: dayKeys[0] ?? '',
      to: dayKeys[dayKeys.length - 1] ?? '',
    },
    kpis,
    teams: teamsOut,
    employees,
    series: {
      tasksCompleted: tasksCompletedSeries,
      averageScore: averageScoreSeries,
      xpEarned: xpSeries,
      coins: coinsSeries,
    },
  }
}
