import type { ApiErrorBody, MemberListResponse } from '#shared/types/api'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { ApiClient, assertHarnessReady, requestCode } from './helpers'
import { closeDb, query } from './db'

/**
 * The reward engine, end to end.
 *
 * `test/rewards.test.ts` proves the *arithmetic*. This file proves the
 * *system*: that approving a task actually moves money, that it moves it
 * exactly once no matter how hard you push, that balances are only ever
 * reached through the ledger, and that nobody can pay themselves.
 *
 * Seeded fixture (tenant A = «نواندیشان پایا»):
 *   +989120000001  ساینا رستمی   OWNER
 *   +989120000003  مریم نوروزی   MANAGER, leads محصول
 *   +989120000004  امیر شریفی    MANAGER, leads مهندسی
 *   +989120000005  نگار احمدی    EMPLOYEE in محصول
 * Tenant B = «داده‌کاوان آریا»: +989130000001 OWNER.
 */

const OWNER_A = '+989120000001'
const MANAGER_A = '+989120000003'
const OTHER_MANAGER_A = '+989120000004'
const EMPLOYEE_A = '+989120000005'
const OWNER_B = '+989130000001'

const owner = new ApiClient()
const manager = new ApiClient()
const otherManager = new ApiClient()
const employee = new ApiClient()
const ownerB = new ApiClient()

const ids = { employeeUser: '', managerUser: '' }
const createdTaskIds: string[] = []

interface RewardBody {
  reward: {
    score: number
    band: string
    multiplierBp: number
    xp: number
    coins: number
    onTime: boolean
    overdue: boolean
    ruleVersion: number
    factors: Array<{ key: string, bp: number, kind: string }>
  } | null
  payout: {
    applied: boolean
    xp: number
    coins: number
    balance: number
    level: number
    levelUp: boolean
  } | null
}

interface WalletBody {
  xp: number
  level: { current: number, percent: number }
  coins: { balance: number, lifetimeEarned: number, lifetimeSpent: number }
  recentTransactions: Array<{
    id: string
    amount: number
    type: string
    reason: string | null
    balanceAfter: number | null
  }>
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

async function createTask(overrides: Record<string, unknown> = {}) {
  const result = await manager.request<{ task: { id: string } }>('/api/tasks', {
    method: 'POST',
    body: {
      title: `آزمون پاداش — ${Math.random().toString(36).slice(2, 8)}`,
      assigneeId: ids.employeeUser,
      priority: 'MEDIUM',
      xpReward: 100,
      coinReward: 50,
      ...overrides,
    },
  })
  expect(result.status, JSON.stringify(result.body)).toBe(201)
  createdTaskIds.push(result.body.task.id)
  return result.body.task
}

/** Drive a task all the way to SUBMITTED as the assignee. */
async function submitTask(taskId: string): Promise<void> {
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

function approve(taskId: string, body: Record<string, unknown>, client: ApiClient = manager) {
  return client.request<RewardBody>(`/api/tasks/${taskId}/transition`, {
    method: 'POST',
    body: { action: 'approve', ...body },
  })
}

async function walletOf(client: ApiClient): Promise<WalletBody> {
  const result = await client.request<WalletBody>('/api/wallet')
  expect(result.status, JSON.stringify(result.body)).toBe(200)
  return result.body
}

/** Ledger rows the API does not expose, read straight from the database. */
async function coinRows(taskId: string) {
  return query<{ amount: number, type: string, idempotencyKey: string | null, balanceAfter: number }>(
    `SELECT amount, type, "idempotencyKey", "balanceAfter"
     FROM "CoinTransaction" WHERE "referenceId" = $1::uuid ORDER BY "createdAt"`,
    [taskId],
  )
}

async function xpRows(taskId: string) {
  return query<{ amount: number }>(
    `SELECT amount FROM "XpTransaction" WHERE "referenceId" = $1::uuid`,
    [taskId],
  )
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
})

afterAll(async () => {
  await query(`DELETE FROM "Task" WHERE title LIKE 'آزمون پاداش%'`).catch(() => undefined)
  await closeDb()
})

// ===========================================================================
describe('paying out an approved task', () => {
  it('credits XP and coins according to the engine, and records both ledgers', async () => {
    const before = await walletOf(employee)
    const task = await createTask({ priority: 'MEDIUM', xpReward: 100, coinReward: 50 })
    await submitTask(task.id)

    const result = await approve(task.id, { score: 95, qualityScore: 4, note: 'عالی بود' })
    expect(result.status, JSON.stringify(result.body)).toBe(200)

    // No due date on this task, so timing is neutral: band 1.0 × priority 1.0.
    expect(result.body.reward?.band).toBe('EXCELLENT')
    expect(result.body.reward?.xp).toBe(100)
    expect(result.body.reward?.coins).toBe(50)
    expect(result.body.payout?.applied).toBe(true)

    const after = await walletOf(employee)
    expect(after.coins.balance).toBe(before.coins.balance + 50)
    expect(after.xp).toBe(before.xp + 100)

    const coins = await coinRows(task.id)
    expect(coins).toHaveLength(1)
    expect(coins[0]!.amount).toBe(50)
    expect(coins[0]!.type).toBe('TASK_REWARD')
    // The running balance is stamped on the row, so a statement needs no re-sum.
    expect(coins[0]!.balanceAfter).toBe(after.coins.balance)

    expect(await xpRows(task.id)).toHaveLength(1)
  })

  it('applies priority weighting and the score band together', async () => {
    const task = await createTask({ priority: 'HIGH', xpReward: 100, coinReward: 50 })
    await submitTask(task.id)

    const result = await approve(task.id, { score: 85 })
    expect(result.status).toBe(200)
    // band 0.8 × priority 1.3 = 1.04
    expect(result.body.reward?.coins).toBe(Math.round(50 * 1.3 * 0.8))
    expect(result.body.reward?.xp).toBe(Math.round(100 * 1.3 * 0.8))
  })

  it('penalises an overdue submission', async () => {
    const task = await createTask({
      priority: 'MEDIUM',
      dueDate: new Date(Date.now() - 3 * 86_400_000).toISOString(),
    })
    await submitTask(task.id)

    const result = await approve(task.id, { score: 95 })
    expect(result.status).toBe(200)
    expect(result.body.reward?.overdue).toBe(true)
    // 1.0 − 0.25 overdue
    expect(result.body.reward?.multiplierBp).toBe(7_500)
    expect(result.body.reward?.coins).toBe(38)
  })

  it('rewards an on-time submission', async () => {
    const task = await createTask({
      priority: 'MEDIUM',
      dueDate: new Date(Date.now() + 5 * 86_400_000).toISOString(),
    })
    await submitTask(task.id)

    const result = await approve(task.id, { score: 95 })
    expect(result.status).toBe(200)
    expect(result.body.reward?.onTime).toBe(true)
    // Submitted more than `earlyDays` ahead, so this is the early bonus.
    expect(result.body.reward?.multiplierBp).toBe(12_000)
  })

  it('charges the revision penalty after a rework loop', async () => {
    const task = await createTask({ priority: 'MEDIUM' })
    await submitTask(task.id)

    const bounce = await manager.request(`/api/tasks/${task.id}/transition`, {
      method: 'POST',
      body: { action: 'request_revision', note: 'لطفاً بازبینی کنید' },
    })
    expect(bounce.status).toBe(200)

    await submitTask(task.id)

    const result = await approve(task.id, { score: 95 })
    expect(result.status).toBe(200)
    // 1.0 − 0.10 for one revision
    expect(result.body.reward?.multiplierBp).toBe(9_000)
  })

  it('freezes the breakdown and rule version onto the review', async () => {
    const task = await createTask()
    await submitTask(task.id)
    await approve(task.id, { score: 92, qualityScore: 5, timelinessScore: 4 })

    const rows = await query<{
      score: number
      qualityScore: number
      timelinessScore: number
      xpAwarded: number
      coinsAwarded: number
      rewardBreakdown: { multiplierBp: number, ruleVersion: number }
    }>(
      `SELECT score, "qualityScore", "timelinessScore", "xpAwarded", "coinsAwarded", "rewardBreakdown"
       FROM "TaskReview" WHERE "taskId" = $1::uuid`,
      [task.id],
    )

    expect(rows).toHaveLength(1)
    const review = rows[0]!
    expect(review.score).toBe(92)
    expect(review.qualityScore).toBe(5)
    expect(review.timelinessScore).toBe(4)
    expect(review.coinsAwarded).toBeGreaterThan(0)
    // Frozen so a payout stays explainable after the rules change.
    expect(review.rewardBreakdown.ruleVersion).toBeGreaterThanOrEqual(1)
    expect(review.rewardBreakdown.multiplierBp).toBe(11_500)
  })
})

// ===========================================================================
describe('duplicate approval and duplicate reward prevention', () => {
  it('refuses a second approval and pays nothing further', async () => {
    const task = await createTask()
    await submitTask(task.id)

    const first = await approve(task.id, { score: 95 })
    expect(first.status).toBe(200)
    const balanceAfterFirst = (await walletOf(employee)).coins.balance

    // The lifecycle rejects APPROVED → APPROVED before rewards are even reached.
    const second = await approve(task.id, { score: 95 })
    expect(second.status).toBe(409)
    expect(envelope(second).code).toBe('INVALID_TRANSITION')

    expect((await walletOf(employee)).coins.balance).toBe(balanceAfterFirst)
    expect(await coinRows(task.id)).toHaveLength(1)
    expect(await xpRows(task.id)).toHaveLength(1)
  })

  it('survives concurrent approvals of the same task', async () => {
    const task = await createTask()
    await submitTask(task.id)

    const before = (await walletOf(employee)).coins.balance

    // Five reviewers hitting approve at once. Exactly one may pay.
    const results = await Promise.all(
      Array.from({ length: 5 }, () => approve(task.id, { score: 95 })),
    )

    const succeeded = results.filter(r => r.status === 200)
    expect(succeeded.length).toBeGreaterThanOrEqual(1)

    // Whatever the race did to the HTTP responses, the money is unambiguous:
    // one ledger row, one payment.
    const coins = await coinRows(task.id)
    expect(coins).toHaveLength(1)
    expect(await xpRows(task.id)).toHaveLength(1)
    expect((await walletOf(employee)).coins.balance).toBe(before + coins[0]!.amount)
  })

  it('keys the payout on the task, so the ledger row is idempotent by construction', async () => {
    const task = await createTask()
    await submitTask(task.id)
    await approve(task.id, { score: 95 })

    const coins = await coinRows(task.id)
    expect(coins[0]!.idempotencyKey).toBe(`task:${task.id}:reward`)

    // The unique index — not application logic — is what enforces it.
    await expect(
      query(
        `INSERT INTO "CoinTransaction" (id, "companyId", "userId", amount, type, source, "idempotencyKey", "createdAt")
         SELECT gen_random_uuid(), "companyId", "userId", amount, type, source, "idempotencyKey", now()
         FROM "CoinTransaction" WHERE "referenceId" = $1::uuid`,
        [task.id],
      ),
    ).rejects.toThrow()
  })

  it('keeps the wallet balance equal to the sum of its ledger', async () => {
    const task = await createTask()
    await submitTask(task.id)
    await approve(task.id, { score: 88 })

    const rows = await query<{ balance: number, ledger: number }>(
      `SELECT w.balance, COALESCE(SUM(c.amount), 0)::int AS ledger
       FROM "Wallet" w
       LEFT JOIN "CoinTransaction" c ON c."walletId" = w.id
       WHERE w."userId" = $1::uuid
       GROUP BY w.balance`,
      [ids.employeeUser],
    )
    expect(rows).toHaveLength(1)
    // The invariant the whole design exists to protect.
    expect(rows[0]!.balance).toBe(rows[0]!.ledger)
  })
})

// ===========================================================================
describe('invalid scores', () => {
  it('rejects a negative score', async () => {
    const task = await createTask()
    await submitTask(task.id)

    const result = await approve(task.id, { score: -10 })
    expect(result.status).toBe(422)
    expect(await coinRows(task.id)).toHaveLength(0)
  })

  it('rejects a score above 100', async () => {
    const task = await createTask()
    await submitTask(task.id)

    const result = await approve(task.id, { score: 150 })
    expect(result.status).toBe(422)
    expect(await coinRows(task.id)).toHaveLength(0)
  })

  it('rejects a non-numeric score', async () => {
    const task = await createTask()
    await submitTask(task.id)

    expect((await approve(task.id, { score: 'عالی' })).status).toBe(422)
  })

  it('rejects an approval with no score at all', async () => {
    const task = await createTask()
    await submitTask(task.id)

    const result = await approve(task.id, {})
    expect(result.status).toBe(400)
    expect(envelope(result).code).toBe('SCORE_REQUIRED')
  })

  it('rejects out-of-range quality sub-scores', async () => {
    const task = await createTask()
    await submitTask(task.id)

    expect((await approve(task.id, { score: 90, qualityScore: 0 })).status).toBe(422)
    expect((await approve(task.id, { score: 90, qualityScore: 6 })).status).toBe(422)
    expect((await approve(task.id, { score: 90, timelinessScore: 9 })).status).toBe(422)
    // None of the rejected attempts paid anything.
    expect(await coinRows(task.id)).toHaveLength(0)
  })
})

// ===========================================================================
describe('authorization', () => {
  it('does not let an employee approve their own task', async () => {
    const task = await createTask()
    await submitTask(task.id)

    const result = await approve(task.id, { score: 100 }, employee)
    expect(result.status).toBe(403)
    expect(await coinRows(task.id)).toHaveLength(0)
  })

  it('does not let a manager outside the scope approve', async () => {
    const task = await createTask()
    await submitTask(task.id)

    const result = await approve(task.id, { score: 100 }, otherManager)
    // Out of scope tasks are not acknowledged to exist.
    expect([403, 404]).toContain(result.status)
    expect(await coinRows(task.id)).toHaveLength(0)
  })

  it('does not let another tenant approve', async () => {
    const task = await createTask()
    await submitTask(task.id)

    const result = await approve(task.id, { score: 100 }, ownerB)
    expect(result.status).toBe(404)
    expect(await coinRows(task.id)).toHaveLength(0)
  })

  it('requires a session for the wallet', async () => {
    const anonymous = new ApiClient()
    expect((await anonymous.request('/api/wallet')).status).toBe(401)
    expect((await anonymous.request('/api/wallet/transactions')).status).toBe(401)
  })

  it('scopes the wallet to the caller — there is no way to read another', async () => {
    const employeeWallet = await walletOf(employee)
    const managerWallet = await walletOf(manager)

    // No userId parameter exists; supplying one changes nothing.
    const spoofed = await manager.request<WalletBody>('/api/wallet', {
      query: { userId: ids.employeeUser },
    })
    expect(spoofed.status).toBe(200)
    expect(spoofed.body.coins.balance).toBe(managerWallet.coins.balance)
    expect(spoofed.body.coins.balance).not.toBe(employeeWallet.coins.balance)
  })
})

// ===========================================================================
describe('manual adjustments', () => {
  it('does not let a MANAGER adjust a balance', async () => {
    const before = (await walletOf(employee)).coins.balance

    const result = await manager.request('/api/wallet/adjust', {
      method: 'POST',
      body: { userId: ids.employeeUser, amount: 5_000, reason: 'پاداش ویژه' },
    })
    // The whole point: managers cannot manufacture coins for their reports.
    expect(result.status).toBe(403)
    expect((await walletOf(employee)).coins.balance).toBe(before)
  })

  it('does not let an EMPLOYEE adjust their own balance', async () => {
    const result = await employee.request('/api/wallet/adjust', {
      method: 'POST',
      body: { userId: ids.employeeUser, amount: 1_000, reason: 'خودپاداش' },
    })
    expect(result.status).toBe(403)
  })

  it('lets an OWNER adjust, through the ledger, with a reason', async () => {
    const before = (await walletOf(employee)).coins.balance

    const result = await owner.request<{ balance: number }>('/api/wallet/adjust', {
      method: 'POST',
      body: { userId: ids.employeeUser, amount: 120, reason: 'جبران خطای سیستمی' },
    })
    expect(result.status, JSON.stringify(result.body)).toBe(200)
    expect(result.body.balance).toBe(before + 120)

    const after = await walletOf(employee)
    expect(after.coins.balance).toBe(before + 120)

    // It appears in the statement, labelled and attributed.
    const latest = after.recentTransactions[0]!
    expect(latest.type).toBe('ADMIN_ADJUSTMENT')
    expect(latest.amount).toBe(120)
    expect(latest.reason).toBe('جبران خطای سیستمی')
  })

  it('rejects an adjustment with no reason, and a zero amount', async () => {
    expect((await owner.request('/api/wallet/adjust', {
      method: 'POST',
      body: { userId: ids.employeeUser, amount: 50, reason: '' },
    })).status).toBe(422)

    expect((await owner.request('/api/wallet/adjust', {
      method: 'POST',
      body: { userId: ids.employeeUser, amount: 0, reason: 'بدون اثر' },
    })).status).toBe(422)
  })

  it('refuses to overdraw a wallet', async () => {
    const before = (await walletOf(employee)).coins.balance

    const result = await owner.request('/api/wallet/adjust', {
      method: 'POST',
      body: { userId: ids.employeeUser, amount: -(before + 10_000), reason: 'کسر بیش از موجودی' },
    })
    // Either the schema bound (422) or the insufficient-funds check (400)
    // stops it; either way the balance cannot go negative.
    expect([400, 422]).toContain(result.status)
    expect((await walletOf(employee)).coins.balance).toBe(before)
  })

  it('cannot reach a user in another tenant', async () => {
    const result = await ownerB.request('/api/wallet/adjust', {
      method: 'POST',
      body: { userId: ids.employeeUser, amount: 100, reason: 'میان‌مستاجری' },
    })
    expect(result.status).toBe(404)
  })
})

// ===========================================================================
describe('reward preview', () => {
  it('previews exactly what approving will pay', async () => {
    const task = await createTask({ priority: 'HIGH', xpReward: 100, coinReward: 50 })
    await submitTask(task.id)

    const preview = await manager.request<RewardBody>('/api/rewards/preview', {
      method: 'POST',
      body: { taskId: task.id, score: 84, qualityScore: 5 },
    })
    expect(preview.status, JSON.stringify(preview.body)).toBe(200)

    const approved = await approve(task.id, { score: 84, qualityScore: 5 })
    expect(approved.status).toBe(200)

    // The preview and the payout must agree; a preview that lies is worse
    // than no preview.
    expect(approved.body.reward?.xp).toBe(preview.body.reward?.xp)
    expect(approved.body.reward?.coins).toBe(preview.body.reward?.coins)
    expect(approved.body.reward?.multiplierBp).toBe(preview.body.reward?.multiplierBp)
  })

  it('writes nothing — previewing does not consume the payout', async () => {
    const task = await createTask()
    await submitTask(task.id)

    for (let i = 0; i < 3; i += 1) {
      await manager.request('/api/rewards/preview', {
        method: 'POST',
        body: { taskId: task.id, score: 90 },
      })
    }
    expect(await coinRows(task.id)).toHaveLength(0)

    const approved = await approve(task.id, { score: 90 })
    expect(approved.status).toBe(200)
    expect(approved.body.payout?.applied).toBe(true)
    expect(await coinRows(task.id)).toHaveLength(1)
  })

  it('does not preview a task the caller cannot review', async () => {
    const task = await createTask()
    await submitTask(task.id)

    const asEmployee = await employee.request('/api/rewards/preview', {
      method: 'POST',
      body: { taskId: task.id, score: 100 },
    })
    expect(asEmployee.status).toBe(403)

    const asOtherTenant = await ownerB.request('/api/rewards/preview', {
      method: 'POST',
      body: { taskId: task.id, score: 100 },
    })
    expect(asOtherTenant.status).toBe(404)
  })

  it('validates the score on preview too', async () => {
    const task = await createTask()
    const result = await manager.request('/api/rewards/preview', {
      method: 'POST',
      body: { taskId: task.id, score: 500 },
    })
    expect(result.status).toBe(422)
  })
})

// ===========================================================================
describe('reward rules', () => {
  it('exposes the active economy to any member', async () => {
    const result = await employee.request<{ rules: { baseXp: number, version: number } }>(
      '/api/rewards/rules',
    )
    expect(result.status).toBe(200)
    // Employees can see the rules that decide their pay.
    expect(result.body.rules.baseXp).toBeGreaterThan(0)
  })

  it('does not let a MANAGER rewrite the economy', async () => {
    const current = await manager.request<{ rules: Record<string, number> }>('/api/rewards/rules')
    const result = await manager.request('/api/rewards/rules', {
      method: 'PUT',
      body: { ...current.body.rules, baseCoins: 99_999 },
    })
    expect(result.status).toBe(403)
  })

  it('versions a new rule set rather than mutating the old one', async () => {
    const before = await owner.request<{ rules: Record<string, number> }>('/api/rewards/rules')
    const beforeVersion = before.body.rules.version!

    const published = await owner.request<{ rules: { version: number, baseCoins: number } }>(
      '/api/rewards/rules',
      {
        method: 'PUT',
        body: {
          baseXp: 200,
          baseCoins: 100,
          lowPriorityBp: 8_000,
          mediumPriorityBp: 10_000,
          highPriorityBp: 13_000,
          excellentBp: 10_000,
          goodBp: 8_000,
          fairBp: 6_000,
          poorBp: 3_000,
          onTimeBonusBp: 1_000,
          earlyBonusBp: 2_000,
          highQualityBonusBp: 1_500,
          overduePenaltyBp: 2_500,
          revisionPenaltyBp: 1_000,
          maxRevisionPenaltyBp: 5_000,
          minMultiplierBp: 0,
          maxMultiplierBp: 20_000,
          earlyDays: 1,
          highQualityThreshold: 5,
        },
      },
    )
    expect(published.status, JSON.stringify(published.body)).toBe(200)
    expect(published.body.rules.version).toBe(beforeVersion + 1)

    // The old version still exists; it was superseded, not overwritten.
    const rows = await query<{ n: number }>(
      `SELECT count(*)::int AS n FROM "RewardRule" WHERE version = $1`,
      [beforeVersion],
    )
    expect(rows[0]!.n).toBeGreaterThan(0)

    // And exactly one row is active per company.
    const active = await query<{ n: number }>(
      `SELECT count(*)::int AS n FROM "RewardRule" r
       JOIN "User" u ON u."companyId" = r."companyId"
       WHERE u.id = $1::uuid AND r."isActive"`,
      [ids.employeeUser],
    )
    expect(active[0]!.n).toBe(1)

    // Restore v1-equivalent defaults so later runs start from a known economy.
    await owner.request('/api/rewards/rules', {
      method: 'PUT',
      body: {
        baseXp: 100,
        baseCoins: 50,
        lowPriorityBp: 8_000,
        mediumPriorityBp: 10_000,
        highPriorityBp: 13_000,
        excellentBp: 10_000,
        goodBp: 8_000,
        fairBp: 6_000,
        poorBp: 3_000,
        onTimeBonusBp: 1_000,
        earlyBonusBp: 2_000,
        highQualityBonusBp: 1_500,
        overduePenaltyBp: 2_500,
        revisionPenaltyBp: 1_000,
        maxRevisionPenaltyBp: 5_000,
        minMultiplierBp: 0,
        maxMultiplierBp: 20_000,
        earlyDays: 1,
        highQualityThreshold: 5,
      },
    })
  })

  it('rejects an inverted multiplier range', async () => {
    const current = await owner.request<{ rules: Record<string, number> }>('/api/rewards/rules')
    const result = await owner.request('/api/rewards/rules', {
      method: 'PUT',
      body: { ...current.body.rules, minMultiplierBp: 20_000, maxMultiplierBp: 1_000 },
    })
    expect(result.status).toBe(400)
    expect(envelope(result).code).toBe('INVALID_RANGE')
  })
})

// ===========================================================================
describe('the coin statement', () => {
  it('pages the caller’s own transactions, newest first', async () => {
    const result = await employee.request<{
      items: Array<{ createdAt: string, amount: number }>
      total: number
      page: number
    }>('/api/wallet/transactions', { query: { page: '1', pageSize: '5' } })

    expect(result.status).toBe(200)
    expect(result.body.items.length).toBeLessThanOrEqual(5)
    expect(result.body.total).toBeGreaterThan(0)

    const times = result.body.items.map(row => new Date(row.createdAt).getTime())
    expect([...times].sort((a, b) => b - a)).toEqual(times)
  })

  it('filters by transaction type', async () => {
    const result = await employee.request<{ items: Array<{ type: string }> }>(
      '/api/wallet/transactions',
      { query: { type: 'TASK_REWARD', pageSize: '50' } },
    )
    expect(result.status).toBe(200)
    expect(result.body.items.every(row => row.type === 'TASK_REWARD')).toBe(true)
  })

  it('rejects an unknown type', async () => {
    const result = await employee.request('/api/wallet/transactions', {
      query: { type: 'FREE_MONEY' },
    })
    expect(result.status).toBe(422)
  })
})

// ===========================================================================
describe('XP, levels and separation of the two currencies', () => {
  it('advances the level as XP accumulates, independently of coins', async () => {
    const before = await walletOf(employee)

    // A task's own reward fields are a *base*, and 0 means "unset" (it is the
    // column default), so the company base applies. The two currencies are
    // therefore scaled independently rather than one implying the other.
    const task = await createTask({ xpReward: 900, coinReward: 20, priority: 'MEDIUM' })
    await submitTask(task.id)
    const result = await approve(task.id, { score: 95 })
    expect(result.status).toBe(200)

    const after = await walletOf(employee)
    expect(after.xp).toBe(before.xp + 900)
    expect(after.coins.balance).toBe(before.coins.balance + 20)
    // XP is what drives the ladder; coins never do.
    expect(after.level.current).toBeGreaterThanOrEqual(before.level.current)
  })

  it('lets XP and coins scale by different amounts for the same task', async () => {
    const before = await walletOf(employee)

    const task = await createTask({ xpReward: 300, coinReward: 30, priority: 'MEDIUM' })
    await submitTask(task.id)
    await approve(task.id, { score: 75 })

    const after = await walletOf(employee)
    const xpGain = after.xp - before.xp
    const coinGain = after.coins.balance - before.coins.balance
    // Same 0.6 band multiplier, different bases: 180 XP vs 18 coins.
    expect(xpGain).toBe(180)
    expect(coinGain).toBe(18)
  })

  it('never decreases XP — it is permanent', async () => {
    const before = await walletOf(employee)

    const task = await createTask({ priority: 'LOW' })
    await submitTask(task.id)
    // A poor score pays little, but it cannot subtract.
    await approve(task.id, { score: 5 })

    expect((await walletOf(employee)).xp).toBeGreaterThanOrEqual(before.xp)
  })
})
