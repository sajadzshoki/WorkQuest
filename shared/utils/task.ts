/**
 * Task lifecycle rules.
 *
 * Pure and dependency-free on purpose: the same functions decide what the
 * server allows and what the UI offers, and they are unit-tested without a
 * database or an HTTP server.
 *
 * The lifecycle:
 *
 *   TODO ──▶ IN_PROGRESS ──▶ SUBMITTED ──▶ APPROVED
 *                 ▲              │
 *                 └── NEEDS_REVISION ◀┘
 *
 * APPROVED is terminal. Everything else is reachable only along the edges
 * declared in `TASK_TRANSITIONS`, and each edge names the *actor kind* allowed
 * to walk it — which is what stops an employee approving their own work.
 */

export const TASK_STATUSES = [
  'TODO',
  'IN_PROGRESS',
  'SUBMITTED',
  'NEEDS_REVISION',
  'APPROVED',
] as const
export type TaskStatus = (typeof TASK_STATUSES)[number]

export const TASK_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'] as const
export type TaskPriority = (typeof TASK_PRIORITIES)[number]

export const REVIEW_DECISIONS = ['APPROVED', 'CHANGES_REQUESTED'] as const
export type ReviewDecision = (typeof REVIEW_DECISIONS)[number]

/** Statuses that count as "the work is still open". */
export const OPEN_TASK_STATUSES: readonly TaskStatus[] = [
  'TODO',
  'IN_PROGRESS',
  'NEEDS_REVISION',
]

/** Statuses an employee is actively working through. */
export const ACTIVE_TASK_STATUSES: readonly TaskStatus[] = ['IN_PROGRESS', 'NEEDS_REVISION']

/** Terminal statuses — no transition leaves them. */
export const CLOSED_TASK_STATUSES: readonly TaskStatus[] = ['APPROVED']

/**
 * Named actions rather than raw target statuses.
 *
 * Endpoints take an action (`start`, `submit`, `approve`, …) instead of a
 * status, so a client can never invent a state; the action determines both the
 * target status and who is allowed to perform it.
 */
export const TASK_ACTIONS = [
  'start',
  'submit',
  'approve',
  'request_revision',
  'reopen',
] as const
export type TaskAction = (typeof TASK_ACTIONS)[number]

/**
 * Who may perform a transition.
 *
 * - `assignee` — only the person the task is assigned to.
 * - `reviewer` — someone holding `task:review` who is **not** the assignee.
 *   The exclusion is the rule "employees cannot approve their own tasks", and
 *   it applies to managers too: a manager reviewing their own task would be
 *   marking their own homework.
 */
export type TaskActorKind = 'assignee' | 'reviewer'

export interface TaskTransition {
  action: TaskAction
  from: readonly TaskStatus[]
  to: TaskStatus
  actor: TaskActorKind
}

export const TASK_TRANSITIONS: readonly TaskTransition[] = [
  // The employee picks the task up, or picks it back up after a revision request.
  { action: 'start', from: ['TODO', 'NEEDS_REVISION'], to: 'IN_PROGRESS', actor: 'assignee' },
  // …and hands it in.
  { action: 'submit', from: ['IN_PROGRESS'], to: 'SUBMITTED', actor: 'assignee' },
  // A reviewer accepts…
  { action: 'approve', from: ['SUBMITTED'], to: 'APPROVED', actor: 'reviewer' },
  // …or sends it back with feedback.
  { action: 'request_revision', from: ['SUBMITTED'], to: 'NEEDS_REVISION', actor: 'reviewer' },
  // A reviewer can pull a submission back to the board (mis-assignment, scope change).
  { action: 'reopen', from: ['SUBMITTED', 'NEEDS_REVISION'], to: 'TODO', actor: 'reviewer' },
]

export function isTaskStatus(value: unknown): value is TaskStatus {
  return typeof value === 'string' && (TASK_STATUSES as readonly string[]).includes(value)
}

export function isTaskAction(value: unknown): value is TaskAction {
  return typeof value === 'string' && (TASK_ACTIONS as readonly string[]).includes(value)
}

export function findTransition(action: TaskAction): TaskTransition | undefined {
  return TASK_TRANSITIONS.find(transition => transition.action === action)
}

/** True when `action` is legal from `status`, ignoring who is asking. */
export function canTransition(status: TaskStatus, action: TaskAction): boolean {
  const transition = findTransition(action)
  return Boolean(transition && transition.from.includes(status))
}

/** The status a task lands in after `action`, or undefined when illegal. */
export function nextStatus(status: TaskStatus, action: TaskAction): TaskStatus | undefined {
  const transition = findTransition(action)
  if (!transition || !transition.from.includes(status)) return undefined
  return transition.to
}

export interface TaskActorContext {
  /** True when the caller is the task's assignee. */
  isAssignee: boolean
  /** True when the caller holds `task:review` (MANAGER and above). */
  canReview: boolean
}

export interface TransitionCheck {
  allowed: boolean
  /** Machine-readable reason, mirrored by the API error codes. */
  reason?: 'UNKNOWN_ACTION' | 'INVALID_TRANSITION' | 'NOT_ASSIGNEE' | 'SELF_REVIEW' | 'NOT_REVIEWER'
}

/**
 * The single authority on "may this person move this task like that".
 *
 * Both the API and the UI call it, so an affordance is never shown that the
 * server would reject, and — more importantly — never *hidden* in a way that
 * gives the illusion of a check the server does not perform.
 */
export function checkTransition(
  status: TaskStatus,
  action: TaskAction,
  actor: TaskActorContext,
): TransitionCheck {
  const transition = findTransition(action)
  if (!transition) return { allowed: false, reason: 'UNKNOWN_ACTION' }
  if (!transition.from.includes(status)) return { allowed: false, reason: 'INVALID_TRANSITION' }

  if (transition.actor === 'assignee') {
    return actor.isAssignee ? { allowed: true } : { allowed: false, reason: 'NOT_ASSIGNEE' }
  }

  // reviewer
  if (!actor.canReview) return { allowed: false, reason: 'NOT_REVIEWER' }
  // Nobody reviews their own work — not even a manager who assigned it to
  // themselves. This is the rule the spec calls out explicitly.
  if (actor.isAssignee) return { allowed: false, reason: 'SELF_REVIEW' }
  return { allowed: true }
}

/** Every action the actor could take right now — drives the card's buttons. */
export function availableActions(status: TaskStatus, actor: TaskActorContext): TaskAction[] {
  return TASK_ACTIONS.filter(action => checkTransition(status, action, actor).allowed)
}

// ---------------------------------------------------------------------------
// Due dates
// ---------------------------------------------------------------------------

/**
 * A task is overdue when it has a due date in the past and is not finished.
 *
 * An APPROVED task is never overdue, however late it was: the work is done and
 * flagging it red forever would only add noise. A SUBMITTED task past its date
 * *is* overdue — it is still waiting on someone.
 */
export function isOverdue(
  task: { status: TaskStatus, dueDate: Date | string | null | undefined },
  now: Date = new Date(),
): boolean {
  if (!task.dueDate) return false
  if (CLOSED_TASK_STATUSES.includes(task.status)) return false
  return new Date(task.dueDate).getTime() < now.getTime()
}

/**
 * Whole days until the due date, in the given timezone's calendar days.
 *
 * Calendar days rather than 24-hour blocks: a task due tomorrow at 09:00 is
 * "1 day left" whether it is now 08:00 or 22:00. Negative means overdue,
 * `null` means no due date.
 */
export function daysUntilDue(
  dueDate: Date | string | null | undefined,
  now: Date = new Date(),
  timeZone = 'Asia/Tehran',
): number | null {
  if (!dueDate) return null
  const due = startOfDayUtc(new Date(dueDate), timeZone)
  const today = startOfDayUtc(now, timeZone)
  return Math.round((due - today) / 86_400_000)
}

/** True when the due date falls on today's calendar date in `timeZone`. */
export function isDueToday(
  dueDate: Date | string | null | undefined,
  now: Date = new Date(),
  timeZone = 'Asia/Tehran',
): boolean {
  return daysUntilDue(dueDate, now, timeZone) === 0
}

/**
 * Midnight of `date`'s calendar day in `timeZone`, as a UTC timestamp.
 *
 * `en-CA` yields `YYYY-MM-DD`, which is the shortest reliable way to ask Intl
 * for a wall-clock date in another zone without pulling in a date library.
 */
function startOfDayUtc(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
  return Date.parse(`${parts}T00:00:00Z`)
}

/**
 * Completion rate as a percentage, 0-100.
 *
 * Returns 0 rather than NaN for an empty team so the dashboard never has to
 * special-case it.
 */
export function completionRate(approved: number, total: number): number {
  if (total <= 0) return 0
  return Math.round((approved / total) * 100)
}

/** Sort weight so HIGH floats to the top of a list. */
export const PRIORITY_WEIGHT: Record<TaskPriority, number> = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
}
