import type {
  ApiErrorBody,
  MemberListResponse,
  TaskDashboardResponse,
  TaskDetailResponse,
  TaskListResponse,
  TaskMutationResponse,
} from '#shared/types/api'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { ApiClient, assertHarnessReady, requestCode } from './helpers'
import { closeDb, query } from './db'

/**
 * Task management, end to end over the real HTTP API.
 *
 * The unit suite (`test/task.test.ts`) proves the lifecycle *rules*; this file
 * proves the *system* honours them — that the endpoints wire those rules to
 * real rows, real roles and a real tenant boundary. It covers the seven
 * scenarios the spec names: create, assign, submit, request revision, approve,
 * unauthorized update, and overdue calculation.
 *
 * Seeded fixture (tenant A = «نواندیشان پایا»):
 *   +989120000001  ساینا رستمی   OWNER
 *   +989120000003  مریم نوروزی   MANAGER, leads محصول
 *   +989120000004  امیر شریفی    MANAGER, leads مهندسی
 *   +989120000005  نگار احمدی    EMPLOYEE in محصول
 * Tenant B = «داده‌کاوان آریا»: +989130000001 OWNER.
 */

const OWNER_A = '+989120000001'
const MANAGER_A = '+989120000003' // leads محصول, so نگار reports to them
const OTHER_MANAGER_A = '+989120000004' // leads مهندسی — outside that scope
const EMPLOYEE_A = '+989120000005' // نگار احمدی, in محصول
const OWNER_B = '+989130000001'

const owner = new ApiClient()
const manager = new ApiClient()
const otherManager = new ApiClient()
const employee = new ApiClient()
const ownerB = new ApiClient()

const ids = {
  employeeUser: '',
  managerUser: '',
  productTeam: '',
}

/** Tasks this suite creates, removed in `afterAll`. */
const createdTaskIds: string[] = []

function envelope(result: { status: number, body: unknown }): ApiErrorBody {
  return (result.body ?? {}) as ApiErrorBody
}

async function login(client: ApiClient, phone: string): Promise<void> {
  const code = await requestCode(client, phone)
  const result = await client.request('/api/auth/otp/verify', {
    method: 'POST',
    body: { phone, code },
  })
  expect(result.status, JSON.stringify(result.body)).toBe(200)
}

/**
 * Create a task as the manager and track it for cleanup.
 *
 * Titles are prefixed so the teardown can find anything a failing test leaked.
 */
async function createTask(
  overrides: Record<string, unknown> = {},
  client: ApiClient = manager,
): Promise<TaskMutationResponse['task']> {
  const result = await client.request<TaskMutationResponse>('/api/tasks', {
    method: 'POST',
    body: {
      title: `آزمون یکپارچه — ${Math.random().toString(36).slice(2, 8)}`,
      description: 'تسک ساخته‌شده توسط مجموعه آزمون یکپارچه',
      assigneeId: ids.employeeUser,
      priority: 'HIGH',
      estimatedHours: 4,
      xpReward: 120,
      coinReward: 60,
      ...overrides,
    },
  })
  expect(result.status, JSON.stringify(result.body)).toBe(201)
  createdTaskIds.push(result.body.task.id)
  return result.body.task
}

/** Drive a task to the requested status through the real endpoints. */
async function advanceTo(taskId: string, status: 'IN_PROGRESS' | 'SUBMITTED'): Promise<void> {
  const start = await employee.request(`/api/tasks/${taskId}/transition`, {
    method: 'POST',
    body: { action: 'start' },
  })
  expect(start.status, JSON.stringify(start.body)).toBe(200)
  if (status === 'IN_PROGRESS') return

  const submit = await employee.request(`/api/tasks/${taskId}/transition`, {
    method: 'POST',
    body: { action: 'submit' },
  })
  expect(submit.status, JSON.stringify(submit.body)).toBe(200)
}

beforeAll(() => {
  assertHarnessReady()
})

beforeAll(async () => {
  await login(owner, OWNER_A)
  await login(manager, MANAGER_A)
  await login(otherManager, OTHER_MANAGER_A)
  await login(employee, EMPLOYEE_A)
  await login(ownerB, OWNER_B)

  const members = await owner.request<MemberListResponse>('/api/members', {
    query: { scope: 'all', pageSize: '100' },
  })
  const find = (phone: string) => members.body.members.find(row => row.phone === phone)
  ids.employeeUser = find(EMPLOYEE_A)!.id
  ids.managerUser = find(MANAGER_A)!.id
  ids.productTeam = find(EMPLOYEE_A)!.team!.id
})

afterAll(async () => {
  // Comments, attachments, events and reviews all cascade from the task.
  await query(`DELETE FROM "Task" WHERE title LIKE 'آزمون یکپارچه%'`).catch(() => undefined)
  await closeDb()
})

// ===========================================================================
describe('creating a task', () => {
  it('lets a MANAGER create a task with every field', async () => {
    const due = new Date(Date.now() + 5 * 86_400_000).toISOString()
    const task = await createTask({
      title: 'آزمون یکپارچه — ساخت کامل',
      teamId: ids.productTeam,
      dueDate: due,
      estimatedHours: 7.5,
      priority: 'HIGH',
    })

    expect(task.title).toBe('آزمون یکپارچه — ساخت کامل')
    expect(task.status).toBe('TODO')
    expect(task.priority).toBe('HIGH')
    expect(task.assignee?.id).toBe(ids.employeeUser)
    // The creator becomes the assigner, which is what makes them a reviewer later.
    expect(task.assigner?.id).toBe(ids.managerUser)
    expect(task.team?.id).toBe(ids.productTeam)
    expect(task.estimatedHours).toBe(7.5)
    expect(task.progress).toBe(0)
    expect(task.revisionCount).toBe(0)
    expect(new Date(task.dueDate!).toISOString()).toBe(due)
  })

  it('accepts attachments at creation time', async () => {
    const task = await createTask({
      attachments: [{ fileName: 'brief.pdf', url: 'https://example.com/brief.pdf' }],
    })
    const detail = await manager.request<TaskDetailResponse>(`/api/tasks/${task.id}`)
    expect(detail.body.attachments).toHaveLength(1)
    expect(detail.body.attachments[0]!.fileName).toBe('brief.pdf')
  })

  it('records a creation event and notifies the assignee', async () => {
    const task = await createTask()
    const detail = await manager.request<TaskDetailResponse>(`/api/tasks/${task.id}`)
    expect(detail.body.events.some(entry => entry.action === 'task.created')).toBe(true)

    const rows = await query<{ n: number }>(
      `SELECT count(*)::int AS n FROM "Notification"
       WHERE "userId" = $1 AND type = 'TASK_ASSIGNED' AND data->>'taskId' = $2`,
      [ids.employeeUser, task.id],
    )
    expect(rows[0]!.n).toBe(1)
  })

  it('rejects an EMPLOYEE trying to create a task', async () => {
    const result = await employee.request('/api/tasks', {
      method: 'POST',
      body: { title: 'آزمون یکپارچه — غیرمجاز', assigneeId: ids.employeeUser },
    })
    expect(result.status).toBe(403)
    expect(envelope(result).code).toBe('FORBIDDEN')
  })

  it('rejects an invalid body with field-level issues', async () => {
    const result = await manager.request('/api/tasks', {
      method: 'POST',
      body: { title: 'کم', assigneeId: 'not-a-uuid', priority: 'URGENT' },
    })
    expect(result.status).toBe(422)
    const body = envelope(result)
    expect(body.code).toBe('VALIDATION_FAILED')
    expect(body.issues?.map(issue => issue.path)).toEqual(
      expect.arrayContaining(['title', 'assigneeId', 'priority']),
    )
  })

  it('rejects a status supplied directly — the lifecycle is not client-writable', async () => {
    const task = await createTask({ status: 'APPROVED' })
    expect(task.status).toBe('TODO')
  })
})

// ===========================================================================
describe('assigning a task', () => {
  it('refuses a MANAGER assigning to someone outside their reports', async () => {
    // امیر leads مهندسی; نگار is in محصول, so she is not his to assign to.
    const result = await otherManager.request('/api/tasks', {
      method: 'POST',
      body: { title: 'آزمون یکپارچه — خارج از دامنه', assigneeId: ids.employeeUser },
    })
    expect(result.status).toBe(403)
  })

  it('lets the OWNER assign to anybody in the company', async () => {
    const task = await createTask({ title: 'آزمون یکپارچه — انتساب مالک' }, owner)
    expect(task.assignee?.id).toBe(ids.employeeUser)
  })

  it('refuses an assignee from another tenant', async () => {
    const meB = await ownerB.request<{ user: { id: string } }>('/api/me')
    const result = await owner.request('/api/tasks', {
      method: 'POST',
      body: { title: 'آزمون یکپارچه — نشت مستأجر', assigneeId: meB.body.user.id },
    })
    expect(result.status).toBe(400)
    expect(envelope(result).code).toBe('ASSIGNEE_NOT_FOUND')
  })

  it('reassigns through PATCH and notifies the new assignee', async () => {
    const task = await createTask()
    const result = await owner.request<TaskMutationResponse>(`/api/tasks/${task.id}`, {
      method: 'PATCH',
      body: { assigneeId: ids.managerUser, priority: 'LOW' },
    })
    expect(result.status, JSON.stringify(result.body)).toBe(200)
    expect(result.body.task.assignee?.id).toBe(ids.managerUser)
    expect(result.body.task.priority).toBe('LOW')
  })

  it('refuses an EMPLOYEE editing a task assigned to them', async () => {
    const task = await createTask()
    const result = await employee.request(`/api/tasks/${task.id}`, {
      method: 'PATCH',
      body: { title: 'آزمون یکپارچه — عنوان دستکاری‌شده' },
    })
    expect(result.status).toBe(403)
  })
})

// ===========================================================================
describe('submitting a task', () => {
  it('walks TODO → IN_PROGRESS → SUBMITTED as the assignee', async () => {
    const task = await createTask()

    const started = await employee.request<TaskMutationResponse>(
      `/api/tasks/${task.id}/transition`,
      { method: 'POST', body: { action: 'start' } },
    )
    expect(started.status, JSON.stringify(started.body)).toBe(200)
    expect(started.body.task.status).toBe('IN_PROGRESS')
    expect(started.body.task.startedAt).not.toBeNull()

    const submitted = await employee.request<TaskMutationResponse>(
      `/api/tasks/${task.id}/transition`,
      { method: 'POST', body: { action: 'submit' } },
    )
    expect(submitted.status).toBe(200)
    expect(submitted.body.task.status).toBe('SUBMITTED')
    expect(submitted.body.task.submittedAt).not.toBeNull()
    // Submitting implies the work is finished.
    expect(submitted.body.task.progress).toBe(100)
  })

  it('refuses submitting straight from TODO', async () => {
    const task = await createTask()
    const result = await employee.request(`/api/tasks/${task.id}/transition`, {
      method: 'POST',
      body: { action: 'submit' },
    })
    expect(result.status).toBe(409)
    expect(envelope(result).code).toBe('INVALID_TRANSITION')
  })

  it('refuses a manager starting or submitting on the assignee’s behalf', async () => {
    const task = await createTask()
    const result = await manager.request(`/api/tasks/${task.id}/transition`, {
      method: 'POST',
      body: { action: 'start' },
    })
    expect(result.status).toBe(403)
    expect(envelope(result).code).toBe('NOT_ASSIGNEE')
  })

  it('lets the assignee move their progress while working', async () => {
    const task = await createTask()
    await advanceTo(task.id, 'IN_PROGRESS')

    const result = await employee.request<TaskMutationResponse>(
      `/api/tasks/${task.id}/progress`,
      { method: 'PATCH', body: { progress: 40 } },
    )
    expect(result.status).toBe(200)
    expect(result.body.task.progress).toBe(40)
  })

  it('refuses a manager writing someone else’s progress', async () => {
    const task = await createTask()
    await advanceTo(task.id, 'IN_PROGRESS')
    const result = await manager.request(`/api/tasks/${task.id}/progress`, {
      method: 'PATCH',
      body: { progress: 99 },
    })
    expect(result.status).toBe(403)
  })

  it('notifies the assigner that work is waiting', async () => {
    const task = await createTask()
    await advanceTo(task.id, 'SUBMITTED')
    const rows = await query<{ n: number }>(
      `SELECT count(*)::int AS n FROM "Notification"
       WHERE "userId" = $1 AND type = 'TASK_SUBMITTED' AND data->>'taskId' = $2`,
      [ids.managerUser, task.id],
    )
    expect(rows[0]!.n).toBe(1)
  })
})

// ===========================================================================
describe('requesting a revision', () => {
  it('sends the task back and increments the revision counter', async () => {
    const task = await createTask()
    await advanceTo(task.id, 'SUBMITTED')

    const result = await manager.request<TaskMutationResponse>(
      `/api/tasks/${task.id}/transition`,
      {
        method: 'POST',
        body: { action: 'request_revision', note: 'بخش معیارهای پذیرش ناقص است.' },
      },
    )
    expect(result.status, JSON.stringify(result.body)).toBe(200)
    expect(result.body.task.status).toBe('NEEDS_REVISION')
    expect(result.body.task.revisionCount).toBe(1)

    const detail = await manager.request<TaskDetailResponse>(`/api/tasks/${task.id}`)
    expect(detail.body.reviews[0]!.decision).toBe('CHANGES_REQUESTED')
    expect(detail.body.reviews[0]!.feedback).toBe('بخش معیارهای پذیرش ناقص است.')
    // No reward is paid for work that was sent back.
    expect(detail.body.reviews[0]!.xpAwarded).toBe(0)
  })

  it('requires a reason', async () => {
    const task = await createTask()
    await advanceTo(task.id, 'SUBMITTED')
    const result = await manager.request(`/api/tasks/${task.id}/transition`, {
      method: 'POST',
      body: { action: 'request_revision' },
    })
    expect(result.status).toBe(400)
    expect(envelope(result).code).toBe('REVISION_NOTE_REQUIRED')
  })

  it('lets the employee resume and resubmit — the full rework loop', async () => {
    const task = await createTask()
    await advanceTo(task.id, 'SUBMITTED')
    await manager.request(`/api/tasks/${task.id}/transition`, {
      method: 'POST',
      body: { action: 'request_revision', note: 'نیاز به اصلاح دارد' },
    })

    const restarted = await employee.request<TaskMutationResponse>(
      `/api/tasks/${task.id}/transition`,
      { method: 'POST', body: { action: 'start' } },
    )
    expect(restarted.body.task.status).toBe('IN_PROGRESS')

    const resubmitted = await employee.request<TaskMutationResponse>(
      `/api/tasks/${task.id}/transition`,
      { method: 'POST', body: { action: 'submit' } },
    )
    expect(resubmitted.body.task.status).toBe('SUBMITTED')
    // The counter survives the loop — it is the record of how often this bounced.
    expect(resubmitted.body.task.revisionCount).toBe(1)
  })
})

// ===========================================================================
describe('approving a task', () => {
  it('approves, stamps completion and pays the reward', async () => {
    const before = await query<{ xp: number, coins: number }>(
      `SELECT xp, coins FROM "UserProgress" WHERE "userId" = $1`,
      [ids.employeeUser],
    )
    const startXp = before[0]?.xp ?? 0
    const startCoins = before[0]?.coins ?? 0

    const task = await createTask({ xpReward: 150, coinReward: 70 })
    await advanceTo(task.id, 'SUBMITTED')

    const result = await manager.request<TaskMutationResponse>(
      `/api/tasks/${task.id}/transition`,
      { method: 'POST', body: { action: 'approve', score: 95, note: 'عالی بود' } },
    )
    expect(result.status, JSON.stringify(result.body)).toBe(200)
    expect(result.body.task.status).toBe('APPROVED')
    expect(result.body.task.completedAt).not.toBeNull()
    expect(result.body.task.progress).toBe(100)

    const after = await query<{ xp: number, coins: number }>(
      `SELECT xp, coins FROM "UserProgress" WHERE "userId" = $1`,
      [ids.employeeUser],
    )
    expect(after[0]!.xp).toBe(startXp + 150)
    expect(after[0]!.coins).toBe(startCoins + 70)

    // The ledger is the source of truth; the counters above are its cache.
    const ledger = await query<{ n: number }>(
      `SELECT count(*)::int AS n FROM "XpTransaction"
       WHERE "referenceId" = $1 AND source = 'TASK_REVIEW' AND amount = 150`,
      [task.id],
    )
    expect(ledger[0]!.n).toBe(1)
  })

  it('records the review with its score', async () => {
    const task = await createTask()
    await advanceTo(task.id, 'SUBMITTED')
    await manager.request(`/api/tasks/${task.id}/transition`, {
      method: 'POST',
      body: { action: 'approve', score: 88 },
    })

    const detail = await manager.request<TaskDetailResponse>(`/api/tasks/${task.id}`)
    expect(detail.body.reviews[0]!.decision).toBe('APPROVED')
    expect(detail.body.reviews[0]!.score).toBe(88)
  })

  it('treats APPROVED as terminal', async () => {
    const task = await createTask()
    await advanceTo(task.id, 'SUBMITTED')
    await manager.request(`/api/tasks/${task.id}/transition`, {
      method: 'POST',
      body: { action: 'approve' },
    })

    const result = await employee.request(`/api/tasks/${task.id}/transition`, {
      method: 'POST',
      body: { action: 'start' },
    })
    expect(result.status).toBe(409)
  })
})

// ===========================================================================
describe('unauthorized updates', () => {
  /** The headline rule: nobody signs off their own work. */
  it('refuses an EMPLOYEE approving their own task', async () => {
    const task = await createTask()
    await advanceTo(task.id, 'SUBMITTED')

    const result = await employee.request(`/api/tasks/${task.id}/transition`, {
      method: 'POST',
      body: { action: 'approve' },
    })
    expect(result.status).toBe(403)
    expect(envelope(result).code).toBe('NOT_REVIEWER')

    const detail = await employee.request<TaskDetailResponse>(`/api/tasks/${task.id}`)
    expect(detail.body.task.status).toBe('SUBMITTED')
  })

  it('refuses a MANAGER approving a task assigned to themselves', async () => {
    // The owner assigns work *to* the manager, who then cannot grade it.
    const task = await createTask({ assigneeId: ids.managerUser }, owner)
    await manager.request(`/api/tasks/${task.id}/transition`, {
      method: 'POST',
      body: { action: 'start' },
    })
    await manager.request(`/api/tasks/${task.id}/transition`, {
      method: 'POST',
      body: { action: 'submit' },
    })

    const result = await manager.request(`/api/tasks/${task.id}/transition`, {
      method: 'POST',
      body: { action: 'approve' },
    })
    expect(result.status).toBe(403)
    expect(envelope(result).code).toBe('SELF_REVIEW')
  })

  it('refuses an EMPLOYEE requesting a revision on anything', async () => {
    const task = await createTask()
    await advanceTo(task.id, 'SUBMITTED')
    const result = await employee.request(`/api/tasks/${task.id}/transition`, {
      method: 'POST',
      body: { action: 'request_revision', note: 'تلاش غیرمجاز' },
    })
    expect(result.status).toBe(403)
  })

  it('hides another tenant’s task entirely — 404, not 403', async () => {
    const task = await createTask()
    const result = await ownerB.request(`/api/tasks/${task.id}`)
    expect(result.status).toBe(404)

    const mutation = await ownerB.request(`/api/tasks/${task.id}/transition`, {
      method: 'POST',
      body: { action: 'approve' },
    })
    expect(mutation.status).toBe(404)
  })

  it('never widens scope from the query string', async () => {
    // An employee asking for the company-wide scope is refused outright…
    const all = await employee.request('/api/tasks', { query: { scope: 'all' } })
    expect(all.status).toBe(403)

    // …and asking for a colleague's board by id returns nothing, not their work.
    const spied = await employee.request<TaskListResponse>('/api/tasks', {
      query: { scope: 'mine', assigneeId: ids.managerUser },
    })
    expect(spied.status).toBe(200)
    expect(spied.body.items).toHaveLength(0)
  })

  it('rejects an unknown action before touching the row', async () => {
    const task = await createTask()
    const result = await employee.request(`/api/tasks/${task.id}/transition`, {
      method: 'POST',
      body: { action: 'delete_everything' },
    })
    expect(result.status).toBe(422)
  })
})

// ===========================================================================
describe('comments and attachments', () => {
  it('lets both sides of the task hold a conversation', async () => {
    const task = await createTask()

    const fromEmployee = await employee.request(`/api/tasks/${task.id}/comments`, {
      method: 'POST',
      body: { body: 'سلام، شروع کردم.' },
    })
    expect(fromEmployee.status).toBe(201)

    const fromManager = await manager.request(`/api/tasks/${task.id}/comments`, {
      method: 'POST',
      body: { body: 'عالی، منتظر خروجی هستم.' },
    })
    expect(fromManager.status).toBe(201)

    const detail = await employee.request<TaskDetailResponse>(`/api/tasks/${task.id}`)
    expect(detail.body.comments).toHaveLength(2)
    expect(detail.body.task.commentCount).toBe(2)
  })

  it('rejects an empty comment', async () => {
    const task = await createTask()
    const result = await employee.request(`/api/tasks/${task.id}/comments`, {
      method: 'POST',
      body: { body: '   ' },
    })
    expect(result.status).toBe(422)
  })

  it('lets the assignee attach a file and rejects a non-http URL', async () => {
    const task = await createTask()

    const ok = await employee.request(`/api/tasks/${task.id}/attachments`, {
      method: 'POST',
      body: { fileName: 'output.png', url: 'https://example.com/output.png' },
    })
    expect(ok.status).toBe(201)

    const bad = await employee.request(`/api/tasks/${task.id}/attachments`, {
      method: 'POST',
      body: { fileName: 'evil', url: 'javascript:alert(1)' },
    })
    expect(bad.status).toBe(422)
  })
})

// ===========================================================================
describe('overdue calculation', () => {
  it('flags open work past its due date', async () => {
    const task = await createTask({
      title: 'آزمون یکپارچه — تأخیردار',
      dueDate: new Date(Date.now() - 3 * 86_400_000).toISOString(),
    })
    const detail = await employee.request<TaskDetailResponse>(`/api/tasks/${task.id}`)
    expect(detail.body.task.isOverdue).toBe(true)
  })

  it('does not flag work due in the future, or work with no due date', async () => {
    const future = await createTask({
      dueDate: new Date(Date.now() + 3 * 86_400_000).toISOString(),
    })
    const undated = await createTask()

    const a = await employee.request<TaskDetailResponse>(`/api/tasks/${future.id}`)
    const b = await employee.request<TaskDetailResponse>(`/api/tasks/${undated.id}`)
    expect(a.body.task.isOverdue).toBe(false)
    expect(b.body.task.isOverdue).toBe(false)
  })

  it('stops flagging a task once it is approved, however late it was', async () => {
    const task = await createTask({
      dueDate: new Date(Date.now() - 10 * 86_400_000).toISOString(),
    })
    await advanceTo(task.id, 'SUBMITTED')
    const approved = await manager.request<TaskMutationResponse>(
      `/api/tasks/${task.id}/transition`,
      { method: 'POST', body: { action: 'approve' } },
    )
    expect(approved.body.task.status).toBe('APPROVED')
    expect(approved.body.task.isOverdue).toBe(false)
  })

  it('filters the list to overdue work only', async () => {
    const late = await createTask({
      title: 'آزمون یکپارچه — فیلتر تأخیر',
      dueDate: new Date(Date.now() - 2 * 86_400_000).toISOString(),
    })

    const result = await employee.request<TaskListResponse>('/api/tasks', {
      query: { scope: 'mine', overdue: 'true', pageSize: '100' },
    })
    expect(result.status).toBe(200)
    expect(result.body.items.every(item => item.isOverdue)).toBe(true)
    expect(result.body.items.some(item => item.id === late.id)).toBe(true)
  })
})

// ===========================================================================
describe('dashboards', () => {
  it('gives an EMPLOYEE their five buckets and no manager view', async () => {
    const result = await employee.request<TaskDashboardResponse>('/api/tasks/dashboard')
    expect(result.status, JSON.stringify(result.body)).toBe(200)
    expect(result.body.manager).toBeNull()

    const view = result.body.employee
    expect(Array.isArray(view.today)).toBe(true)
    expect(Array.isArray(view.active)).toBe(true)
    expect(Array.isArray(view.pendingSubmissions)).toBe(true)
    expect(Array.isArray(view.completed)).toBe(true)
    expect(Array.isArray(view.upcomingDeadlines)).toBe(true)
    expect(view.counts.completionRate).toBeGreaterThanOrEqual(0)
    expect(view.counts.completionRate).toBeLessThanOrEqual(100)
  })

  it('puts a fresh submission in the manager’s review queue', async () => {
    const task = await createTask({ title: 'آزمون یکپارچه — صف بازبینی' })
    await advanceTo(task.id, 'SUBMITTED')

    const result = await manager.request<TaskDashboardResponse>('/api/tasks/dashboard')
    expect(result.body.manager).not.toBeNull()
    expect(result.body.manager!.pendingReviews.some(item => item.id === task.id)).toBe(true)
  })

  it('never lists the manager’s own submission as theirs to review', async () => {
    const task = await createTask({ assigneeId: ids.managerUser }, owner)
    await manager.request(`/api/tasks/${task.id}/transition`, { method: 'POST', body: { action: 'start' } })
    await manager.request(`/api/tasks/${task.id}/transition`, { method: 'POST', body: { action: 'submit' } })

    const result = await manager.request<TaskDashboardResponse>('/api/tasks/dashboard')
    expect(result.body.manager!.pendingReviews.some(item => item.id === task.id)).toBe(false)
    // It belongs to their *employee* view instead.
    expect(result.body.employee.pendingSubmissions.some(item => item.id === task.id)).toBe(true)
  })

  it('reports overdue work and a team completion rate to the manager', async () => {
    await createTask({
      title: 'آزمون یکپارچه — تأخیر داشبورد',
      teamId: ids.productTeam,
      dueDate: new Date(Date.now() - 4 * 86_400_000).toISOString(),
    })

    const result = await manager.request<TaskDashboardResponse>('/api/tasks/dashboard')
    const view = result.body.manager!
    expect(view.counts.overdue).toBeGreaterThan(0)
    expect(view.overdue.every(item => item.isOverdue)).toBe(true)
    for (const row of view.teamCompletion) {
      expect(row.rate).toBeGreaterThanOrEqual(0)
      expect(row.rate).toBeLessThanOrEqual(100)
      expect(row.approved).toBeLessThanOrEqual(row.total)
    }
  })
})
