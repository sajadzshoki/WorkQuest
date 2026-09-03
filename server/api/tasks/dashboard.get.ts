import type { Prisma } from '#prisma/client'

import { can } from '#shared/utils/permissions'
import { ACTIVE_TASK_STATUSES, CLOSED_TASK_STATUSES, completionRate } from '#shared/utils/task'

import { requireAuth } from '../../utils/auth'
import { createTenantClient } from '../../utils/tenant'
import { TASK_SELECT, fanOut, ledTeamIdsFor, taskVisibleUserIds, toTaskSummary } from '../../utils/tasks'

/**
 * `GET /api/tasks/dashboard` — both task dashboards in one round trip.
 *
 * `employee` is always present (a manager has their own work too). `manager` is
 * added only for callers who can review, and covers everyone they are
 * responsible for.
 *
 * All the date maths happens here, against the server clock and the company
 * timezone, so the two dashboards, the list filter and the tests can never
 * disagree about what "today" or "overdue" means.
 */
export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const db = createTenantClient(auth)
  const now = new Date()
  const timeZone = auth.company.timezone || 'Asia/Tehran'

  const todayEnd = endOfDayUtc(now, timeZone)
  const weekEnd = new Date(todayEnd.getTime() + 7 * 86_400_000)
  const openStatuses = { notIn: [...CLOSED_TASK_STATUSES] }

  // -------------------------------------------------------------------------
  // Employee dashboard — always the caller's own board.
  // -------------------------------------------------------------------------
  const mine: Prisma.TaskWhereInput = { assigneeId: auth.userId }

  const [
    todaysTasks,
    activeTasks,
    pendingSubmissions,
    completedTasks,
    upcoming,
    myOverdue,
    myTotal,
    myApproved,
  ] = await fanOut([
    // Due today, still open — the "what must happen before I go home" list.
    () => db.task.findMany({
      where: { ...mine, status: openStatuses, dueDate: { lte: todayEnd } },
      orderBy: [{ dueDate: 'asc' }, { priority: 'desc' }],
      take: 20,
      select: TASK_SELECT,
    }),
    () => db.task.findMany({
      where: { ...mine, status: { in: [...ACTIVE_TASK_STATUSES] } },
      orderBy: [{ dueDate: { sort: 'asc', nulls: 'last' } }, { priority: 'desc' }],
      take: 20,
      select: TASK_SELECT,
    }),
    // Handed in, waiting on someone else.
    () => db.task.findMany({
      where: { ...mine, status: 'SUBMITTED' },
      orderBy: { submittedAt: 'desc' },
      take: 20,
      select: TASK_SELECT,
    }),
    () => db.task.findMany({
      where: { ...mine, status: 'APPROVED' },
      orderBy: { completedAt: 'desc' },
      take: 10,
      select: TASK_SELECT,
    }),
    // Deadlines inside the next week that are not already today's problem.
    () => db.task.findMany({
      where: {
        ...mine,
        status: openStatuses,
        dueDate: { gt: todayEnd, lte: weekEnd },
      },
      orderBy: { dueDate: 'asc' },
      take: 10,
      select: TASK_SELECT,
    }),
    () => db.task.count({ where: { ...mine, status: openStatuses, dueDate: { lt: now } } }),
    () => db.task.count({ where: mine }),
    () => db.task.count({ where: { ...mine, status: 'APPROVED' } }),
  ] as const)

  const employee = {
    today: todaysTasks.map(row => toTaskSummary(row as never, now)),
    active: activeTasks.map(row => toTaskSummary(row as never, now)),
    pendingSubmissions: pendingSubmissions.map(row => toTaskSummary(row as never, now)),
    completed: completedTasks.map(row => toTaskSummary(row as never, now)),
    upcomingDeadlines: upcoming.map(row => toTaskSummary(row as never, now)),
    counts: {
      today: todaysTasks.length,
      active: activeTasks.length,
      pendingSubmissions: pendingSubmissions.length,
      completed: myApproved,
      overdue: myOverdue,
      total: myTotal,
      completionRate: completionRate(myApproved, myTotal),
    },
  }

  if (!can(auth.role, 'task:review')) return { employee, manager: null }

  // -------------------------------------------------------------------------
  // Manager dashboard — everyone the caller is responsible for.
  // -------------------------------------------------------------------------
  const visible = await taskVisibleUserIds(auth)
  const led = await ledTeamIdsFor(auth)

  /** Work in the caller's remit: their people, their teams, or created by them. */
  const remit: Prisma.TaskWhereInput = visible === null
    ? {}
    : {
        OR: [
          { assigneeId: { in: visible } },
          { assignerId: auth.userId },
          ...(led.length > 0 ? [{ teamId: { in: led } }] : []),
        ],
      }

  const [
    managerActive,
    pendingReviews,
    overdueTasks,
    remitTotal,
    remitApproved,
    perTeamTotals,
    perTeamApproved,
  ] = await fanOut([
    () => db.task.findMany({
      where: { AND: [remit, { status: { in: [...ACTIVE_TASK_STATUSES] } }] },
      orderBy: [{ dueDate: { sort: 'asc', nulls: 'last' } }, { priority: 'desc' }],
      take: 20,
      select: TASK_SELECT,
    }),
    // Submissions the caller may act on. Their own submitted work is excluded:
    // they cannot review it, so listing it as a to-do would be a dead end.
    () => db.task.findMany({
      where: {
        AND: [remit, { status: 'SUBMITTED' }, { NOT: { assigneeId: auth.userId } }],
      },
      orderBy: { submittedAt: 'asc' },
      take: 20,
      select: TASK_SELECT,
    }),
    () => db.task.findMany({
      where: { AND: [remit, { status: openStatuses, dueDate: { lt: now } }] },
      orderBy: { dueDate: 'asc' },
      take: 20,
      select: TASK_SELECT,
    }),
    () => db.task.count({ where: remit }),
    () => db.task.count({ where: { AND: [remit, { status: 'APPROVED' }] } }),
    () => db.task.groupBy({ by: ['teamId'], where: remit, _count: { _all: true } }),
    () => db.task.groupBy({
      by: ['teamId'],
      where: { AND: [remit, { status: 'APPROVED' }] },
      _count: { _all: true },
    }),
  ] as const)

  const teamIds = [...new Set(perTeamTotals.map(row => row.teamId).filter((id): id is string => Boolean(id)))]
  const teams = teamIds.length > 0
    ? await db.team.findMany({ where: { id: { in: teamIds } }, select: { id: true, name: true } })
    : []
  const teamNames = new Map(teams.map(team => [team.id, team.name]))
  const approvedByTeam = new Map(perTeamApproved.map(row => [row.teamId ?? '', row._count._all]))

  const manager = {
    active: managerActive.map(row => toTaskSummary(row as never, now)),
    pendingReviews: pendingReviews.map(row => toTaskSummary(row as never, now)),
    overdue: overdueTasks.map(row => toTaskSummary(row as never, now)),
    counts: {
      active: managerActive.length,
      pendingReviews: pendingReviews.length,
      overdue: overdueTasks.length,
      total: remitTotal,
      approved: remitApproved,
      completionRate: completionRate(remitApproved, remitTotal),
    },
    teamCompletion: perTeamTotals
      .filter(row => row.teamId)
      .map(row => ({
        teamId: row.teamId as string,
        teamName: teamNames.get(row.teamId as string) ?? '—',
        total: row._count._all,
        approved: approvedByTeam.get(row.teamId as string) ?? 0,
        rate: completionRate(approvedByTeam.get(row.teamId as string) ?? 0, row._count._all),
      }))
      .sort((a, b) => b.total - a.total),
  }

  return { employee, manager }
})

/**
 * 23:59:59.999 of `date`'s calendar day in `timeZone`, as a UTC instant.
 *
 * "Due today" has to mean the user's today, not the server's: at 02:00 in
 * Tehran a UTC-based boundary would still be showing yesterday's list.
 *
 * The offset is derived by formatting the instant in the target zone and
 * comparing it to the same wall-clock read as UTC — the standard trick for
 * getting a zone offset out of `Intl` without a date library, and it handles
 * DST because it is evaluated at the instant in question.
 */
function endOfDayUtc(date: Date, timeZone: string): Date {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(date)

  const get = (type: string) => Number(parts.find(part => part.type === type)?.value ?? '0')
  // `hour` can come back as 24 for midnight in some ICU versions.
  const wallClock = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour') % 24, get('minute'), get('second'))
  const offsetMs = wallClock - Math.floor(date.getTime() / 1000) * 1000

  const localMidnight = Date.UTC(get('year'), get('month') - 1, get('day'))
  return new Date(localMidnight - offsetMs + 86_400_000 - 1)
}
