import type { Prisma } from '#prisma/client'

import { taskFilterSchema } from '#shared/schemas'
import { can } from '#shared/utils/permissions'
import { CLOSED_TASK_STATUSES } from '#shared/utils/task'

import { requireAuth } from '../../utils/auth'
import { errors, readValidatedQuery } from '../../utils/http'
import { createTenantClient } from '../../utils/tenant'
import { TASK_SELECT, ledTeamIdsFor, taskVisibleUserIds, toTaskSummary } from '../../utils/tasks'

/**
 * Task list with role-aware scoping and server-side filtering.
 *
 * `scope=mine` is available to everyone, `team` to managers and up, `all` to
 * admins. Visibility is *always* resolved server-side and intersected with the
 * requested filters — a client can narrow what it sees but never widen it, so
 * `?assigneeId=<someone else>` returns nothing rather than their board.
 */
export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const query = readValidatedQuery(event, taskFilterSchema)
  const db = createTenantClient(auth)
  const now = new Date()

  if (query.scope === 'all' && !can(auth.role, 'task:read:all')) throw errors.forbidden()
  if (query.scope === 'team' && !can(auth.role, 'task:read:team')) throw errors.forbidden()

  const where = await buildWhere()

  const [rows, total] = await Promise.all([
    db.task.findMany({
      where,
      orderBy: orderBy(query.sort),
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      select: TASK_SELECT,
    }),
    db.task.count({ where }),
  ])

  return {
    items: rows.map(row => toTaskSummary(row as never, now)),
    total,
    page: query.page,
    pageSize: query.pageSize,
  }

  async function buildWhere(): Promise<Prisma.TaskWhereInput> {
    const filters: Prisma.TaskWhereInput[] = []

    // --- visibility -------------------------------------------------------
    if (query.scope === 'mine') {
      filters.push({ assigneeId: auth.userId })
    }
    else {
      const visible = await taskVisibleUserIds(auth)
      if (visible !== null) {
        const led = await ledTeamIdsFor(auth)
        filters.push({
          OR: [
            { assigneeId: { in: visible } },
            { assignerId: auth.userId },
            // Unassigned work parked in a team the caller leads.
            ...(led.length > 0 ? [{ assigneeId: null, teamId: { in: led } }] : []),
          ],
        })
      }
    }

    // --- user filters -----------------------------------------------------
    if (query.status) filters.push({ status: query.status })
    if (query.priority) filters.push({ priority: query.priority })
    if (query.teamId) filters.push({ teamId: query.teamId })
    if (query.assigneeId) filters.push({ assigneeId: query.assigneeId })
    if (query.search) {
      filters.push({
        OR: [
          { title: { contains: query.search, mode: 'insensitive' } },
          { description: { contains: query.search, mode: 'insensitive' } },
        ],
      })
    }
    // Overdue must match `isOverdue()` exactly: past due *and* not finished.
    if (query.overdue) {
      filters.push({ dueDate: { lt: now }, status: { notIn: [...CLOSED_TASK_STATUSES] } })
    }

    return filters.length > 0 ? { AND: filters } : {}
  }
})

/**
 * Sort orders. Every one falls back to `createdAt desc` so pagination is
 * stable when the primary key ties (e.g. dozens of tasks with no due date).
 *
 * `nulls: 'last'` on `dueDate`: an undated task is not urgent and should not
 * sit above everything that has a deadline.
 */
function orderBy(sort: 'dueDate' | 'priority' | 'createdAt' | 'status'): Prisma.TaskOrderByWithRelationInput[] {
  switch (sort) {
    case 'priority':
      return [{ priority: 'desc' }, { dueDate: { sort: 'asc', nulls: 'last' } }, { createdAt: 'desc' }]
    case 'status':
      return [{ status: 'asc' }, { dueDate: { sort: 'asc', nulls: 'last' } }, { createdAt: 'desc' }]
    case 'createdAt':
      return [{ createdAt: 'desc' }]
    case 'dueDate':
    default:
      return [{ dueDate: { sort: 'asc', nulls: 'last' } }, { createdAt: 'desc' }]
  }
}
