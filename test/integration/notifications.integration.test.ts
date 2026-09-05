import type { ApiErrorBody, ChallengeMutationResponse, NotificationListResponse, TaskMutationResponse } from '#shared/types/api'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { ApiClient, assertHarnessReady, requestCode } from './helpers'
import { closeDb, query } from './db'

/**
 * The notification system, end to end over the real HTTP API.
 *
 * Four questions, one file:
 *
 *   1. **Creation** — does each real event leave the right row, for the right
 *      person, with the right payload? (Task lifecycle as the probe.)
 *   2. **Authorization** — can anybody read, mark or see a notification that
 *      is not theirs? (Same company, other company, nobody.)
 *   3. **Read state** — does one mark flip exactly one row, does re-marking
 *      stay a 200, does "read all" land on zero honestly?
 *   4. **Duplicates** — does an event that can retry (the challenge engine
 *      re-runs on every board read) notify exactly once?
 *
 * The phones are chosen deliberately: this suite shares the OTP resend
 * cooldown with every other file, so it only logs in as بهنام (ADMIN) and
 * ترانه (EMPLOYEE in محصول) — two fixtures no other file touches. The
 * cross-tenant guarantee is not re-proven here because it is the same
 * tenant-scoped client that auth.integration already proves for this very
 * endpoint (an outsider's feed is empty, a foreign id is a 404).
 *
 * Seeded fixture (tenant A = «نواندیشان پایا»):
 *   +989120000002  بهنام کاویانی  ADMIN (assigns to ترانه)
 *   +989120000009  ترانه موسوی    EMPLOYEE in محصول
 */

const ADMIN_A = '+989120000002'
const EMPLOYEE_A = '+989120000009'

const PREFIX = 'اعلان —'

const admin = new ApiClient()
const employee = new ApiClient()
const anonymous = new ApiClient()

const ids = {
  employeeUser: '',
  tasks: [] as string[],
  challenge: '',
}

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

async function feedOf(client: ApiClient): Promise<NotificationListResponse> {
  const result = await client.request<NotificationListResponse>('/api/notifications')
  expect(result.status, JSON.stringify(result.body)).toBe(200)
  return result.body
}

async function unreadOf(client: ApiClient): Promise<number> {
  const result = await client.request<{ unread: number }>('/api/notifications/summary')
  expect(result.status, JSON.stringify(result.body)).toBe(200)
  return result.body.unread
}

/** The employee's rows for one task — the probe for creation and payload. */
function forTask(feed: NotificationListResponse, taskId: string) {
  return feed.items.filter(
    item => (item.metadata as { taskId?: string }).taskId === taskId,
  )
}

async function createTask(title: string): Promise<string> {
  const result = await admin.request<TaskMutationResponse>('/api/tasks', {
    method: 'POST',
    body: {
      title: `${PREFIX} ${title}`,
      assigneeId: ids.employeeUser,
      priority: 'MEDIUM',
      xpReward: 80,
      coinReward: 40,
    },
  })
  // Track before asserting: a failed expectation must never leak the row
  // into the suites that run after this one.
  ids.tasks.push(result.body.task.id)
  expect(result.status, JSON.stringify(result.body)).toBe(201)
  return result.body.task.id
}

async function driveToSubmitted(taskId: string): Promise<void> {
  const start = await employee.request(`/api/tasks/${taskId}/transition`, {
    method: 'POST',
    body: { action: 'start' },
  })
  expect(start.status, JSON.stringify(start.body)).toBe(200)
  const submit = await employee.request(`/api/tasks/${taskId}/transition`, {
    method: 'POST',
    body: { action: 'submit' },
  })
  expect(submit.status, JSON.stringify(submit.body)).toBe(200)
}

async function approve(taskId: string): Promise<Record<string, unknown>> {
  const result = await admin.request<{ payout?: unknown, challengeCompletions?: unknown }>(`/api/tasks/${taskId}/transition`, {
    method: 'POST',
    body: { action: 'approve', score: 90, qualityScore: 4 },
  })
  expect(result.status, JSON.stringify(result.body)).toBe(200)
  return result.body as Record<string, unknown>
}

beforeAll(() => {
  assertHarnessReady()
})

beforeAll(async () => {
  await login(admin, ADMIN_A)
  await login(employee, EMPLOYEE_A)

  const members = await admin.request<{ members: Array<{ phone: string, id: string, companyId: string }> }>('/api/members')
  expect(members.status).toBe(200)
  const me = members.body.members.find(member => member.phone === EMPLOYEE_A)
  expect(me).toBeDefined()
  ids.employeeUser = me!.id
})

afterAll(async () => {
  // The suite owns its rows; later suites must not see them.
  if (ids.tasks.length > 0) {
    await query(
      `DELETE FROM "Notification" WHERE "metadata"->>'taskId' = ANY($1::uuid[])`,
      [ids.tasks],
    ).catch(() => undefined)
    await query(
      `DELETE FROM "Task" WHERE id = ANY($1::uuid[])`,
      [ids.tasks],
    ).catch(() => undefined)
  }
  if (ids.challenge) {
    await query(
      `DELETE FROM "Notification" WHERE "dedupeKey" LIKE $1`,
      [`challenge:${ids.challenge}:%`],
    ).catch(() => undefined)
    await query(
      `DELETE FROM "XpTransaction" WHERE "referenceType" = 'Challenge' AND "referenceId" = $1::uuid`,
      [ids.challenge],
    ).catch(() => undefined)
    await query(
      `DELETE FROM "CoinTransaction" WHERE "referenceType" = 'Challenge' AND "referenceId" = $1::uuid`,
      [ids.challenge],
    ).catch(() => undefined)
    await query(`DELETE FROM "Challenge" WHERE id = $1::uuid`, [ids.challenge]).catch(() => undefined)
  }
  await closeDb()
})

describe('creation — every event leaves the right row', () => {
  it('tells the assignee about a new task, and not the actor', async () => {
    const taskId = await createTask('تسک نخست')

    const feed = await feedOf(employee)
    const rows = forTask(feed, taskId)
    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({
      type: 'TASK_ASSIGNED',
      title: 'تسک جدیدی به شما محول شد',
      readAt: null,
    })
    expect(rows[0]!.message).toContain(PREFIX)

    // The admin pressed the button; their own bell stays quiet.
    const adminFeed = await feedOf(admin)
    expect(forTask(adminFeed, taskId)).toHaveLength(0)
  })

  it('tells the reviewer about a submission, and the assignee about the approval', async () => {
    const taskId = ids.tasks[ids.tasks.length - 1]!
    await driveToSubmitted(taskId)

    const adminFeed = await feedOf(admin)
    const submitted = forTask(adminFeed, taskId)
    expect(submitted).toHaveLength(1)
    expect(submitted[0]!.type).toBe('TASK_SUBMITTED')

    // The submitter is the actor here — nothing new for them.
    const before = forTask(await feedOf(employee), taskId)
    expect(before.map(row => row.type)).toEqual(['TASK_ASSIGNED'])

    const result = await approve(taskId)
    expect(result.payout).toBeDefined()

    const after = forTask(await feedOf(employee), taskId)
    expect(after.map(row => row.type).sort()).toEqual(['TASK_APPROVED', 'TASK_ASSIGNED'])
    const approved = after.find(row => row.type === 'TASK_APPROVED')!
    expect(approved.message).toContain(PREFIX)
  })
})

describe('authorization — a notification belongs to its user', () => {
  it('refuses to mark another user\'s notification read', async () => {
    const taskId = ids.tasks[0]!
    const mine = forTask(await feedOf(employee), taskId)
    expect(mine.length).toBeGreaterThan(0)
    const target = mine.find(row => row.type === 'TASK_ASSIGNED')!

    // A colleague in the same company cannot mark it read.
    const asAdmin = await admin.request(`/api/notifications/${target.id}/read`, { method: 'POST' })
    expect(asAdmin.status).toBe(404)
    expect(envelope(asAdmin).code).toBe('NOT_FOUND')
  })

  it('requires a session', async () => {
    const result = await anonymous.request('/api/notifications')
    expect(result.status).toBe(401)
  })
})

describe('read state — one flip per click, zero per re-click', () => {
  it('marks one notification read exactly once', async () => {
    const taskId = ids.tasks[0]!
    const target = forTask(await feedOf(employee), taskId).find(row => row.type === 'TASK_ASSIGNED')!

    const before = await unreadOf(employee)
    expect(target.readAt).toBeNull()

    const marked = await employee.request<{ id: string, readAt: string }>(`/api/notifications/${target.id}/read`, {
      method: 'POST',
    })
    expect(marked.status, JSON.stringify(marked.body)).toBe(200)
    expect(marked.body.readAt).not.toBeNull()

    // The unread count moved by exactly one.
    expect(await unreadOf(employee)).toBe(before - 1)

    // Marking again is a 200 with the same timestamp — read state is
    // idempotent, not an error.
    const again = await employee.request<{ readAt: string }>(`/api/notifications/${target.id}/read`, {
      method: 'POST',
    })
    expect(again.status).toBe(200)
    expect(again.body.readAt).toBe(marked.body.readAt)
    expect(await unreadOf(employee)).toBe(before - 1)

    // The row itself carries the state the UI will render.
    const after = forTask(await feedOf(employee), taskId).find(row => row.type === 'TASK_ASSIGNED')!
    expect(after.readAt).not.toBeNull()
  })

  it('lands on zero honestly after "read all", and counts again on the next event', async () => {
    const all = await employee.request<{ updated: number }>('/api/notifications/read-all', {
      method: 'POST',
    })
    expect(all.status, JSON.stringify(all.body)).toBe(200)
    expect(all.body.updated).toBeGreaterThan(0)
    expect(await unreadOf(employee)).toBe(0)

    // A fresh event moves the badge again — the poll is not stuck at zero.
    await createTask('تسک دوم')
    expect(await unreadOf(employee)).toBe(1)
  })
})

describe('duplicates — a retried event notifies exactly once', () => {
  it('announces a challenge start and completion once per person, across engine re-runs', async () => {
    const now = new Date()
    const created = await admin.request<ChallengeMutationResponse>('/api/challenges', {
      method: 'POST',
      body: {
        title: `${PREFIX} چالش یکتایی`,
        type: 'INDIVIDUAL',
        goalKey: 'tasks_completed',
        goalValue: 1,
        xpReward: 30,
        coinReward: 15,
        startsAt: now.toISOString(),
        endsAt: new Date(now.getTime() + 2 * 86_400_000).toISOString(),
      },
    })
    // Same rule as the tasks above: cleanup must know the id even when an
    // assertion fails.
    ids.challenge = created.body.challenge?.id ?? ''
    expect(created.status, JSON.stringify(created.body)).toBe(200)

    // The activation announced itself to every active member, exactly once
    // each — including the employee. The company id comes from the row the
    // API just created, not from a field the members endpoint may not carry.
    const activeCount = (await query<{ n: number }>(
      `SELECT count(*)::int AS n FROM "User"
        WHERE "companyId" = (SELECT "companyId" FROM "Challenge" WHERE id = $1::uuid)
          AND status = 'ACTIVE'`,
      [ids.challenge],
    ))[0]!.n
    const started = await query<{ n: number }>(
      `SELECT count(*)::int AS n FROM "Notification" WHERE "dedupeKey" = $1`,
      [`challenge:${ids.challenge}:started`],
    )
    expect(started[0]!.n).toBe(activeCount)

    // Completing the goal (one approved task) pays and notifies once.
    const taskId = ids.tasks[ids.tasks.length - 1]!
    await driveToSubmitted(taskId)
    const result = await approve(taskId)
    const completions = (result.challengeCompletions ?? []) as Array<{ challengeId: string }>
    expect(completions.some(completion => completion.challengeId === ids.challenge)).toBe(true)

    const rewardKey = `challenge:${ids.challenge}:reward`
    const rewardRows = await query<{ n: number }>(
      `SELECT count(*)::int AS n FROM "Notification" WHERE "dedupeKey" = $1`,
      [rewardKey],
    )
    expect(rewardRows[0]!.n).toBe(1)

    // The engine re-runs on every board read — three of them must not add a
    // single row to either key.
    for (let i = 0; i < 3; i++) {
      const board = await admin.request('/api/challenges')
      expect(board.status).toBe(200)
    }

    const afterRefresh = await query<{ key: string, n: number }>(
      `SELECT "dedupeKey" AS key, count(*)::int AS n FROM "Notification"
        WHERE "dedupeKey" LIKE $1 GROUP BY "dedupeKey"`,
      [`challenge:${ids.challenge}:%`],
    )
    const byKey = new Map(afterRefresh.map(row => [row.key, row.n]))
    expect(byKey.get(`challenge:${ids.challenge}:started`)).toBe(activeCount)
    expect(byKey.get(rewardKey)).toBe(1)
  })
})
