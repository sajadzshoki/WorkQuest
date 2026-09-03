import type { AuthContext } from '#shared/types/api'
import type { TaskAction, TaskPriority, TaskStatus, TransitionCheck } from '#shared/utils/task'

import { can } from '#shared/utils/permissions'
import { checkTransition, isOverdue } from '#shared/utils/task'

import { getManagedUserIds } from './auth'
import { apiError, errors } from './http'
import { createTenantClient } from './tenant'

/**
 * Server-side plumbing for tasks.
 *
 * The *lifecycle rules* are pure and live in `shared/utils/task.ts`. What is
 * here is everything that needs the database or an HTTP error envelope: the
 * shared `select`, the row-level access checks, the transition guard and the
 * event/notification writes that must accompany every state change.
 */

export type TenantDb = ReturnType<typeof createTenantClient>

/**
 * The transaction client the tenant-scoped client hands to `$transaction`.
 *
 * Derived from `TenantDb` rather than written by hand: the extended client's
 * transaction type is *not* `Prisma.TransactionClient` (the extension changes
 * it), and spelling it out here keeps the write helpers below fully typed
 * instead of falling back to `any`.
 */
export type TenantTx = Parameters<Parameters<TenantDb['$transaction']>[0]>[0]

/** Either the tenant client or one of its transactions. */
export type TaskWriteClient = TenantDb | TenantTx

/** The projection every task list and detail response is built from. */
export const TASK_SELECT = {
  id: true,
  title: true,
  description: true,
  status: true,
  priority: true,
  progress: true,
  estimatedHours: true,
  dueDate: true,
  xpReward: true,
  coinReward: true,
  revisionCount: true,
  assignedAt: true,
  startedAt: true,
  submittedAt: true,
  completedAt: true,
  createdAt: true,
  updatedAt: true,
  assignee: { select: { id: true, fullName: true, avatarUrl: true, jobTitle: true } },
  assigner: { select: { id: true, fullName: true, avatarUrl: true } },
  team: { select: { id: true, name: true, slug: true } },
  _count: { select: { comments: true, attachments: true } },
} as const

/** A row shaped by `TASK_SELECT`, as Prisma returns it. */
export interface TaskRow {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  progress: number
  estimatedHours: unknown
  dueDate: Date | null
  xpReward: number
  coinReward: number
  revisionCount: number
  assignedAt: Date | null
  startedAt: Date | null
  submittedAt: Date | null
  completedAt: Date | null
  createdAt: Date
  updatedAt: Date
  assignee: { id: string, fullName: string, avatarUrl: string | null, jobTitle: string | null } | null
  assigner: { id: string, fullName: string, avatarUrl: string | null } | null
  team: { id: string, name: string, slug: string } | null
  _count?: { comments: number, attachments: number }
}

/**
 * Map a task row for the client.
 *
 * Dates become ISO strings and `estimatedHours` becomes a number: Prisma
 * returns `Decimal`, which does not survive JSON serialisation as anything the
 * UI can do arithmetic on.
 *
 * `isOverdue` is computed here rather than in the browser so that every
 * surface — list, card, dashboard, test — agrees on one definition, evaluated
 * against the server clock.
 */
export function toTaskSummary(task: TaskRow, now: Date = new Date()) {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    progress: task.progress,
    estimatedHours: task.estimatedHours === null || task.estimatedHours === undefined
      ? null
      : Number(task.estimatedHours),
    dueDate: task.dueDate?.toISOString() ?? null,
    isOverdue: isOverdue({ status: task.status, dueDate: task.dueDate }, now),
    xpReward: task.xpReward,
    coinReward: task.coinReward,
    revisionCount: task.revisionCount,
    assignedAt: task.assignedAt?.toISOString() ?? null,
    startedAt: task.startedAt?.toISOString() ?? null,
    submittedAt: task.submittedAt?.toISOString() ?? null,
    completedAt: task.completedAt?.toISOString() ?? null,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
    assignee: task.assignee,
    assigner: task.assigner,
    team: task.team,
    commentCount: task._count?.comments ?? 0,
    attachmentCount: task._count?.attachments ?? 0,
  }
}

/**
 * Structural check: the mapper's output must satisfy the published contract.
 *
 * Not exported as `TaskSummary` — that name belongs to `shared/types/api.ts`,
 * which is what the client imports and what Nuxt auto-imports. Re-exporting a
 * second type under the same name makes the auto-import ambiguous and silently
 * shadows one of them.
 */
type _TaskSummaryMatchesContract = ReturnType<typeof toTaskSummary> extends { id: string, status: TaskStatus }
  ? true
  : never

// ---------------------------------------------------------------------------
// Access
// ---------------------------------------------------------------------------

/**
 * The set of user ids whose tasks the caller may see, or `null` for everyone.
 *
 * A MANAGER sees their transitive reports **and themselves** — `getManagedUserIds`
 * deliberately returns only reports, but a manager who cannot see their own
 * tasks in the team view would be missing half their board.
 */
export async function taskVisibleUserIds(auth: AuthContext): Promise<string[] | null> {
  if (can(auth.role, 'task:read:all')) return null
  if (can(auth.role, 'task:read:team')) {
    const reports = await getManagedUserIds(auth.companyId, auth.userId)
    return [...new Set([auth.userId, ...reports])]
  }
  return [auth.userId]
}

/** Team ids the caller leads — a manager also owns their teams' unassigned work. */
export async function ledTeamIdsFor(auth: AuthContext): Promise<string[]> {
  if (!can(auth.role, 'task:read:team')) return []
  const teams = await createTenantClient(auth).team.findMany({
    where: { leadId: auth.userId },
    select: { id: true },
  })
  return teams.map(team => team.id)
}

/**
 * Load a task the caller is allowed to *see*, or 404.
 *
 * 404 rather than 403 for an invisible task: telling a stranger that a task id
 * exists is itself a leak. Tenant isolation is already handled by the scoped
 * client, so this only decides visibility *within* the company.
 */
export async function loadVisibleTask(auth: AuthContext, taskId: string) {
  const db = createTenantClient(auth)
  const task = await db.task.findUnique({ where: { id: taskId }, select: TASK_SELECT })
  if (!task) throw errors.notFound('تسک پیدا نشد')

  const visible = await taskVisibleUserIds(auth)
  if (visible === null) return task as unknown as TaskRow

  const assigneeId = task.assignee?.id ?? null
  if (assigneeId && visible.includes(assigneeId)) return task as unknown as TaskRow
  // The person who created it always keeps sight of it, even after reassignment.
  if (task.assigner?.id === auth.userId) return task as unknown as TaskRow
  // Unassigned work inside a team the caller leads.
  if (!assigneeId && task.team) {
    const led = await ledTeamIdsFor(auth)
    if (led.includes(task.team.id)) return task as unknown as TaskRow
  }

  throw errors.notFound('تسک پیدا نشد')
}

/**
 * Can the caller *manage* (edit / delete / reassign) this task?
 *
 * OWNER and ADMIN always can. A MANAGER can when the task is theirs to run:
 * they created it, the assignee reports to them, or it sits in a team they
 * lead. An EMPLOYEE never can — editing scope is not the same as doing work.
 */
export async function canManageTask(
  auth: AuthContext,
  task: { assignee: { id: string } | null, assigner: { id: string } | null, team: { id: string } | null },
): Promise<boolean> {
  if (!can(auth.role, 'task:assign')) return false
  if (can(auth.role, 'task:read:all')) return true

  if (task.assigner?.id === auth.userId) return true

  const reports = await getManagedUserIds(auth.companyId, auth.userId)
  if (task.assignee && reports.includes(task.assignee.id)) return true

  if (task.team) {
    const led = await ledTeamIdsFor(auth)
    if (led.includes(task.team.id)) return true
  }

  return false
}

/**
 * Assert the caller may assign work to `assigneeId`, and resolve that user.
 *
 * A manager may only assign to their own reports; anyone with `task:read:all`
 * may assign to anybody in the company. Either way the target must be an
 * ACTIVE member of the *same tenant* — the scoped client guarantees the tenant
 * half, this function the rest.
 */
export async function assertAssignable(auth: AuthContext, assigneeId: string) {
  const db = createTenantClient(auth)
  const assignee = await db.user.findUnique({
    where: { id: assigneeId },
    select: { id: true, fullName: true, status: true },
  })
  if (!assignee) throw errors.badRequest('ASSIGNEE_NOT_FOUND', 'انجام‌دهنده انتخاب‌شده در این شرکت پیدا نشد')
  if (assignee.status !== 'ACTIVE') {
    throw errors.badRequest('ASSIGNEE_INACTIVE', 'نمی‌توان به کاربر غیرفعال تسک محول کرد')
  }

  if (can(auth.role, 'task:read:all')) return assignee
  if (assignee.id === auth.userId) return assignee

  const reports = await getManagedUserIds(auth.companyId, auth.userId)
  if (!reports.includes(assignee.id)) {
    throw errors.forbidden('فقط می‌توانید به اعضای تیم خودتان تسک بدهید')
  }
  return assignee
}

/** Assert the team exists in this tenant, and that a manager may use it. */
export async function assertUsableTeam(auth: AuthContext, teamId: string) {
  const db = createTenantClient(auth)
  const team = await db.team.findUnique({ where: { id: teamId }, select: { id: true, name: true } })
  if (!team) throw errors.badRequest('TEAM_NOT_FOUND', 'تیم انتخاب‌شده در این شرکت پیدا نشد')
  return team
}

// ---------------------------------------------------------------------------
// Transitions
// ---------------------------------------------------------------------------

/** Persian messages for every way a transition can be refused. */
const TRANSITION_ERRORS: Record<NonNullable<TransitionCheck['reason']>, { code: string, message: string }> = {
  UNKNOWN_ACTION: { code: 'UNKNOWN_ACTION', message: 'این عملیات پشتیبانی نمی‌شود' },
  INVALID_TRANSITION: {
    code: 'INVALID_TRANSITION',
    message: 'این تغییر وضعیت با وضعیت فعلی تسک سازگار نیست',
  },
  NOT_ASSIGNEE: {
    code: 'NOT_ASSIGNEE',
    message: 'فقط انجام‌دهندهٔ تسک می‌تواند این کار را انجام دهد',
  },
  SELF_REVIEW: {
    code: 'SELF_REVIEW',
    message: 'نمی‌توانید تسک خودتان را بازبینی یا تأیید کنید',
  },
  NOT_REVIEWER: {
    code: 'NOT_REVIEWER',
    message: 'برای بازبینی تسک باید نقش مدیر داشته باشید',
  },
}

/**
 * Guard a lifecycle move, throwing the right HTTP error when it is refused.
 *
 * The decision itself is delegated to the shared, unit-tested `checkTransition`
 * so the API and the UI can never disagree about what is legal. The status
 * codes are chosen to be meaningful: a *permission* problem is 403, a *state*
 * problem is 409.
 */
export function assertTransitionAllowed(
  auth: AuthContext,
  task: { status: TaskStatus, assignee: { id: string } | null },
  action: TaskAction,
): void {
  const result = checkTransition(task.status, action, {
    isAssignee: task.assignee?.id === auth.userId,
    canReview: can(auth.role, 'task:review'),
  })
  if (result.allowed) return

  const reason = result.reason ?? 'INVALID_TRANSITION'
  const detail = TRANSITION_ERRORS[reason]
  const statusCode = reason === 'INVALID_TRANSITION' || reason === 'UNKNOWN_ACTION' ? 409 : 403
  throw apiError(statusCode, detail.code, detail.message)
}

/**
 * Record a lifecycle event.
 *
 * Every status change writes one, so the task page can show a truthful history
 * and a manager can see how many times a piece of work bounced.
 */
export async function recordTaskEvent(
  db: TaskWriteClient,
  input: {
    companyId: string
    taskId: string
    actorId: string | null
    action: string
    fromStatus?: TaskStatus | null
    toStatus?: TaskStatus | null
    note?: string | null
  },
): Promise<void> {
  await db.taskEvent.create({
    data: {
      companyId: input.companyId,
      taskId: input.taskId,
      actorId: input.actorId,
      action: input.action,
      fromStatus: input.fromStatus ?? null,
      toStatus: input.toStatus ?? null,
      note: input.note?.trim() || null,
    },
  })
}

/**
 * Notify a user about their task, unless they did it to themselves.
 *
 * Self-notifications are pure noise — nobody needs a bell for a button they
 * just pressed — so the caller's own id is filtered out here rather than at
 * each of the five call sites.
 */
export async function notifyTask(
  db: TaskWriteClient,
  input: {
    companyId: string
    userId: string | null | undefined
    actorId: string
    type: 'TASK_ASSIGNED' | 'TASK_SUBMITTED' | 'TASK_REVIEWED'
    title: string
    body?: string | null
    taskId: string
  },
): Promise<void> {
  if (!input.userId || input.userId === input.actorId) return
  await db.notification.create({
    data: {
      companyId: input.companyId,
      userId: input.userId,
      type: input.type,
      title: input.title,
      body: input.body ?? null,
      data: { taskId: input.taskId },
    },
  })
}

// ---------------------------------------------------------------------------
// Query fan-out
// ---------------------------------------------------------------------------

/**
 * Run independent queries with a bounded number in flight.
 *
 * The dashboards issue a dozen independent reads, and firing them all at once
 * with `Promise.all` is how you exhaust a connection pool: each Prisma query
 * checks out a connection, so N parallel queries need N connections. Under a
 * pooler — or the single-instance local dev database — the surplus queries do
 * not queue politely, they fail with "server has closed the connection".
 *
 * Four at a time keeps the round-trip win of parallelism (the dashboard is
 * still ~3x faster than sequential) while never asking for more connections
 * than the pool is configured for.
 *
 * Results come back in the order the thunks were given, so callers can keep
 * destructuring them positionally.
 */
export async function fanOut<T extends readonly (() => Promise<unknown>)[]>(
  thunks: T,
  limit = 4,
): Promise<{ -readonly [K in keyof T]: Awaited<ReturnType<T[K]>> }> {
  const results = Array.from({ length: thunks.length }) as unknown[]
  let cursor = 0

  async function worker(): Promise<void> {
    while (cursor < thunks.length) {
      const index = cursor++
      results[index] = await thunks[index]!()
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, thunks.length) }, () => worker()),
  )

  return results as { -readonly [K in keyof T]: Awaited<ReturnType<T[K]>> }
}
