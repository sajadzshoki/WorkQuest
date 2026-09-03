import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { ApiClient, assertHarnessReady, requestCode } from './helpers'
import { closeDb, query } from './db'

/**
 * The gamification engine, end to end.
 *
 * `test/gamification.test.ts` proves the streak and achievement *arithmetic*;
 * this file proves the *system*: that approving a task actually unlocks the
 * seeded `first_approved_task` achievement, that the unlock pays its XP and
 * coins through the ledgers exactly once, that the linked badge is handed out,
 * that the unlock is announced with a notification, and that a streak advances
 * at most once per calendar day.
 *
 * Fixture (tenant A = «نواندیشان پایا»):
 *   +989120000004  امیر شریفی   MANAGER, leads مهندسی
 *   +989120000008  سینا فرهادی  EMPLOYEE in مهندسی — seeded with *no*
 *                  achievements and no badges, so the first approval is also
 *                  the first-ever unlock.
 */

const MANAGER_A = '+989120000004'
const ENGINEER_A = '+989120000008'

const manager = new ApiClient()
const engineer = new ApiClient()

const ids = { engineerUser: '' }
const createdTaskIds: string[] = []

interface TransitionBody {
  reward: { xp: number, coins: number } | null
  payout: { applied: boolean, xp: number, coins: number, level: number, levelUp: boolean } | null
  gamification: {
    streak: { current: number, longest: number, changed: boolean }
    achievements: Array<{ key: string, title: string, xp: number, coins: number }>
    badges: Array<{ id: string, name: string }>
  } | null
}

async function login(client: ApiClient, phone: string): Promise<void> {
  const code = await requestCode(client, phone)
  const result = await client.request('/api/auth/otp/verify', {
    method: 'POST',
    body: { phone, code },
  })
  expect(result.status, JSON.stringify(result.body)).toBe(200)
}

async function createTask(): Promise<string> {
  const result = await manager.request<{ task: { id: string } }>('/api/tasks', {
    method: 'POST',
    body: {
      title: `آزمون گیمیفیکیشن — ${Math.random().toString(36).slice(2, 8)}`,
      assigneeId: ids.engineerUser,
      priority: 'MEDIUM',
      xpReward: 100,
      coinReward: 50,
    },
  })
  expect(result.status, JSON.stringify(result.body)).toBe(201)
  createdTaskIds.push(result.body.task.id)
  return result.body.task.id
}

async function submitTask(taskId: string): Promise<void> {
  const start = await engineer.request(`/api/tasks/${taskId}/transition`, {
    method: 'POST',
    body: { action: 'start' },
  })
  expect(start.status, JSON.stringify(start.body)).toBe(200)

  const submit = await engineer.request(`/api/tasks/${taskId}/transition`, {
    method: 'POST',
    body: { action: 'submit' },
  })
  expect(submit.status, JSON.stringify(submit.body)).toBe(200)
}

function approve(taskId: string, body: Record<string, unknown> = {}) {
  return manager.request<TransitionBody>(`/api/tasks/${taskId}/transition`, {
    method: 'POST',
    body: { action: 'approve', score: 95, ...body },
  })
}

async function unlockRows(key: string) {
  return query<{ n: number }>(
    `SELECT count(*)::int AS n FROM "UserAchievement" ua
     JOIN "Achievement" a ON a.id = ua."achievementId"
     WHERE ua."userId" = $1::uuid AND a.key = $2`,
    [ids.engineerUser, key],
  )
}

async function achievementLedgerRows() {
  const coins = await query<{ amount: number, type: string, idempotencyKey: string | null }>(
    `SELECT amount, type, "idempotencyKey" FROM "CoinTransaction"
     WHERE "userId" = $1::uuid AND type = 'ACHIEVEMENT_REWARD' ORDER BY "createdAt"`,
    [ids.engineerUser],
  )
  const xp = await query<{ amount: number, source: string }>(
    `SELECT amount, source FROM "XpTransaction"
     WHERE "userId" = $1::uuid AND source = 'ACHIEVEMENT' ORDER BY "createdAt"`,
    [ids.engineerUser],
  )
  return { coins, xp }
}

beforeAll(() => {
  assertHarnessReady()
})

beforeAll(async () => {
  await login(manager, MANAGER_A)
  await login(engineer, ENGINEER_A)

  const rows = await query<{ id: string }>(
    `SELECT id FROM "User" WHERE phone = $1`,
    [ENGINEER_A],
  )
  ids.engineerUser = rows[0]!.id
})

afterAll(async () => {
  await query(`DELETE FROM "Task" WHERE title LIKE 'آزمون گیمیفیکیشن%'`).catch(() => undefined)
  await closeDb()
})

describe('unlocking an achievement on task approval', () => {
  it('unlocks the first-task achievement and pays XP, coins, badge and notification once', async () => {
    const task = await createTask()
    await submitTask(task)

    const result = await approve(task)
    expect(result.status, JSON.stringify(result.body)).toBe(200)

    const unlocks = result.body.gamification?.achievements ?? []
    const first = unlocks.find(achievement => achievement.key === 'first_approved_task')
    expect(first).toBeDefined()
    expect(first).toMatchObject({ title: 'نخستین گام', xp: 50, coins: 20 })

    // The badge linked to the achievement travels with it.
    const badges = result.body.gamification?.badges ?? []
    expect(badges.map(badge => badge.name)).toContain('نشان شروع')

    // Exactly one unlock row…
    const rows = await unlockRows('first_approved_task')
    expect(rows[0]!.n).toBe(1)

    // …and exactly one ledger row per currency, keyed on the achievement id.
    const [achievementId] = await query<{ id: string }>(
      `SELECT id FROM "Achievement" WHERE key = 'first_approved_task'`,
    )
    const ledger = await achievementLedgerRows()
    expect(ledger.coins).toHaveLength(1)
    expect(ledger.coins[0]).toMatchObject({ amount: 20, type: 'ACHIEVEMENT_REWARD' })
    expect(ledger.coins[0]!.idempotencyKey).toBe(`achievement:${achievementId!.id}:${ids.engineerUser}:coins`)

    expect(ledger.xp).toHaveLength(1)
    expect(ledger.xp[0]).toMatchObject({ amount: 50, source: 'ACHIEVEMENT' })

    // The unlock is announced to the user.
    const notifications = await query<{ type: string }>(
      `SELECT type FROM "Notification"
       WHERE "userId" = $1::uuid AND type = 'ACHIEVEMENT_UNLOCKED'`,
      [ids.engineerUser],
    )
    expect(notifications).toHaveLength(1)
  })

  it('does not re-award the same achievement or pay it again', async () => {
    const task = await createTask()
    await submitTask(task)

    const result = await approve(task)
    expect(result.status, JSON.stringify(result.body)).toBe(200)

    // The second approval unlocks nothing new.
    expect(result.body.gamification?.achievements).toHaveLength(0)
    expect(result.body.gamification?.badges).toHaveLength(0)

    // The unique (userId, achievementId) gate held: still one unlock…
    expect((await unlockRows('first_approved_task'))[0]!.n).toBe(1)

    // …and still one ledger row per currency, so the reward was not duplicated.
    const ledger = await achievementLedgerRows()
    expect(ledger.coins).toHaveLength(1)
    expect(ledger.xp).toHaveLength(1)
  })

  it('advances the streak once per calendar day and persists it', async () => {
    // Pretend the last activity was yesterday, mid-streak.
    await query(
      `UPDATE "UserProgress"
       SET "currentStreak" = 3, "longestStreak" = 5,
           "lastActiveDate" = (now() AT TIME ZONE 'Asia/Tehran' - interval '1 day')::date
       WHERE "userId" = $1::uuid`,
      [ids.engineerUser],
    )

    const task = await createTask()
    await submitTask(task)

    const result = await approve(task)
    expect(result.status, JSON.stringify(result.body)).toBe(200)

    // 3 → 4, high-water mark unchanged, and the change is reported and persisted.
    expect(result.body.gamification?.streak).toMatchObject({
      current: 4,
      longest: 5,
      changed: true,
    })

    const progress = await query<{ currentStreak: number, longestStreak: number }>(
      `SELECT "currentStreak", "longestStreak" FROM "UserProgress" WHERE "userId" = $1::uuid`,
      [ids.engineerUser],
    )
    expect(progress[0]).toMatchObject({ currentStreak: 4, longestStreak: 5 })
  })
})
