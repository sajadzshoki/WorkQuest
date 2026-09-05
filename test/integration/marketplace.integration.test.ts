import type {
  ApiErrorBody,
  MemberListResponse,
  RedeemRewardResponse,
  RedemptionDecisionResponse,
  RedemptionListResponse,
  RewardAdminResponse,
  RewardCatalogueResponse,
  RewardDetailResponse,
  RewardMutationResponse,
} from '#shared/types/api'

import { randomUUID } from 'node:crypto'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { ApiClient, assertHarnessReady, requestCode } from './helpers'
import { closeDb, query } from './db'

/**
 * The reward marketplace, end to end.
 *
 * `test/marketplace.test.ts` proves the *rules*. This file proves the *system*:
 * that redeeming actually moves money through the ledger, that it moves it
 * exactly once no matter how hard you push, that a refusal leaves nothing
 * behind, that a rejection gives the coins — and the stock — back, and that
 * nobody can spend, decide or price anything they are not allowed to.
 *
 * The five cases the brief asks for by name are all here: insufficient balance,
 * concurrent redemption, out of stock, duplicate redemption, and the integrity
 * of the transaction ledger.
 *
 * Seeded fixture (tenant A = «نواندیشان پایا»):
 *   +989120000001  ساینا رستمی   OWNER
 *   +989120000003  مریم نوروزی   MANAGER, leads محصول
 *   +989120000005  نگار احمدی    EMPLOYEE in محصول
 * Tenant B = «داده‌کاوان آریا»: +989130000001 OWNER.
 */

const OWNER_A = '+989120000001'
const MANAGER_A = '+989120000003'
const EMPLOYEE_A = '+989120000005'
const OWNER_B = '+989130000001'

/** Every reward this file creates carries this prefix, so cleanup is exact. */
const PREFIX = 'آزمون بازارچه'

const owner = new ApiClient()
const manager = new ApiClient()
const employee = new ApiClient()
const ownerB = new ApiClient()

const ids = { employeeUser: '', managerUser: '' }
const createdRewards: string[] = []

// ===========================================================================
// Helpers
// ===========================================================================

interface WalletBody {
  xp: number
  level: { current: number, percent: number }
  coins: { balance: number, lifetimeEarned: number, lifetimeSpent: number }
}

function envelope(result: { status: number, body: unknown }): ApiErrorBody {
  return (result.body ?? {}) as ApiErrorBody
}

/** Fail loudly with the server's own words rather than a bare status code. */
function why(result: { status: number, body: unknown }): string {
  return `${result.status} ${JSON.stringify(result.body)}`
}

async function login(client: ApiClient, phone: string): Promise<void> {
  const code = await requestCode(client, phone)
  const result = await client.request('/api/auth/otp/verify', {
    method: 'POST',
    body: { phone, code },
  })
  expect(result.status, why(result)).toBe(200)
}

/** Put a reward on the shelf as the owner, and remember it for cleanup. */
async function createReward(title: string, body: Record<string, unknown> = {}): Promise<string> {
  const result = await owner.request<RewardMutationResponse>('/api/rewards', {
    method: 'POST',
    body: { title: `${PREFIX} — ${title}`, coinCost: 10, ...body },
  })
  expect(result.status, why(result)).toBe(200)
  createdRewards.push(result.body.reward.id)
  return result.body.reward.id
}

function patchReward(id: string, body: Record<string, unknown>) {
  return owner.request<RewardMutationResponse>(`/api/rewards/${id}`, { method: 'PATCH', body })
}

function catalogue(client: ApiClient, params: Record<string, string> = {}) {
  return client.request<RewardCatalogueResponse>('/api/rewards', { query: params })
}

function detail(client: ApiClient, id: string) {
  return client.request<RewardDetailResponse>(`/api/rewards/${id}`)
}

function redeem(client: ApiClient, id: string, body: Record<string, unknown> = {}) {
  return client.request<RedeemRewardResponse>(`/api/rewards/${id}/redeem`, { method: 'POST', body })
}

function decide(id: string, action: string, note?: string) {
  return owner.request<RedemptionDecisionResponse>(`/api/rewards/admin/redemptions/${id}/decision`, {
    method: 'POST',
    body: { action, ...(note === undefined ? {} : { note }) },
  })
}

function cancelOwn(client: ApiClient, redemptionId: string) {
  return client.request<RedemptionDecisionResponse>(`/api/rewards/redemptions/${redemptionId}/cancel`, {
    method: 'POST',
  })
}

function shelf(params: Record<string, string> = {}) {
  return owner.request<RewardAdminResponse>('/api/rewards/admin', { query: params })
}

function adminQueue(params: Record<string, string> = {}) {
  return owner.request<RedemptionListResponse>('/api/rewards/admin/redemptions', { query: params })
}

function myRedemptions(client: ApiClient, params: Record<string, string> = {}) {
  return client.request<RedemptionListResponse>('/api/rewards/redemptions', { query: params })
}

async function balanceOf(client: ApiClient): Promise<number> {
  const result = await client.request<WalletBody>('/api/wallet')
  expect(result.status, why(result)).toBe(200)
  return result.body.coins.balance
}

/**
 * Give a buyer room to spend, through the product's own manual lever.
 *
 * The suite charges real coins for real rewards, and a seeded balance is not
 * sized for fifty purchases. `POST /api/wallet/adjust` is the only endpoint that
 * may move a balance by hand, and it moves it *through the ledger* — so the
 * fixture cannot break the invariant the suite goes on to assert.
 */
async function ensureBalance(client: ApiClient, userId: string, minimum: number): Promise<void> {
  const balance = await balanceOf(client)
  if (balance >= minimum) return

  const result = await owner.request<{ balance: number }>('/api/wallet/adjust', {
    method: 'POST',
    body: { userId, amount: minimum - balance, reason: 'شارژ کیف پول برای آزمون بازارچهٔ پاداش' },
  })
  expect(result.status, why(result)).toBe(200)
  expect(result.body.balance).toBe(minimum)
}

async function levelOf(client: ApiClient): Promise<number> {
  const result = await client.request<RewardCatalogueResponse>('/api/rewards')
  expect(result.status, why(result)).toBe(200)
  return result.body.level
}

// --- rows the API deliberately does not expose -----------------------------

async function stockOf(rewardId: string): Promise<number | null> {
  const rows = await query<{ stock: number | null }>(`SELECT stock FROM "Reward" WHERE id = $1::uuid`, [rewardId])
  return rows[0]?.stock ?? null
}

async function ledgerOf(redemptionId: string) {
  return query<{ amount: number, type: string, source: string, idempotencyKey: string | null, balanceAfter: number | null }>(
    `SELECT amount, type, source, "idempotencyKey", "balanceAfter"
       FROM "CoinTransaction"
      WHERE "referenceId" = $1::uuid
      ORDER BY "createdAt"`,
    [redemptionId],
  )
}

async function redemptionRow(redemptionId: string) {
  const rows = await query<{ id: string, status: string, coinCost: number, note: string | null, decisionNote: string | null }>(
    `SELECT id, status, "coinCost", note, "decisionNote" FROM "RewardRedemption" WHERE id = $1::uuid`,
    [redemptionId],
  )
  return rows[0] ?? null
}

async function redemptionsOf(rewardId: string) {
  return query<{ id: string, status: string, coinCost: number, userId: string }>(
    `SELECT id, status, "coinCost", "userId" FROM "RewardRedemption" WHERE "rewardId" = $1::uuid ORDER BY "requestedAt"`,
    [rewardId],
  )
}

/** The wallet must always equal the sum of its own ledger. */
async function walletInvariant(userId: string) {
  const rows = await query<{ balance: number, ledger: number }>(
    `SELECT w.balance, COALESCE(SUM(c.amount), 0)::int AS ledger
       FROM "Wallet" w
       LEFT JOIN "CoinTransaction" c ON c."walletId" = w.id
      WHERE w."userId" = $1::uuid
      GROUP BY w.balance`,
    [userId],
  )
  return rows[0] ?? { balance: 0, ledger: 0 }
}

beforeAll(() => {
  assertHarnessReady()
})

beforeAll(async () => {
  await login(owner, OWNER_A)
  await login(manager, MANAGER_A)
  await login(employee, EMPLOYEE_A)
  await login(ownerB, OWNER_B)

  const members = await owner.request<MemberListResponse>('/api/members', {
    query: { scope: 'all', pageSize: '100' },
  })
  const find = (phone: string) => members.body.members.find(row => row.phone === phone)
  ids.employeeUser = find(EMPLOYEE_A)!.id
  ids.managerUser = find(MANAGER_A)!.id

  await ensureBalance(employee, ids.employeeUser, 5_000)
  await ensureBalance(manager, ids.managerUser, 5_000)
})

afterAll(async () => {
  // Undo every coin this file moved, then remove the rows that moved it. The
  // wallet invariant is asserted *by* the suite, so the cleanup has to respect
  // it too: balances are restored from the ledger before the ledger goes.
  await query(
    `WITH mine AS (
       SELECT c."userId",
              SUM(c.amount)::int AS net,
              SUM(CASE WHEN c.amount < 0 THEN -c.amount ELSE 0 END)::int AS spent,
              SUM(CASE WHEN c.amount > 0 THEN c.amount ELSE 0 END)::int AS earned
         FROM "CoinTransaction" c
        WHERE c."referenceType" = 'RewardRedemption'
          AND c."referenceId" IN (
            SELECT r.id FROM "RewardRedemption" r
             WHERE r."rewardId" IN (SELECT id FROM "Reward" WHERE title LIKE $1)
          )
        GROUP BY c."userId"
     )
     UPDATE "Wallet" w
        SET balance = w.balance - mine.net,
            "lifetimeSpent" = w."lifetimeSpent" - mine.spent,
            "lifetimeEarned" = w."lifetimeEarned" - mine.earned
       FROM mine
      WHERE w."userId" = mine."userId"`,
    [`${PREFIX}%`],
  ).catch(() => undefined)

  await query(
    `UPDATE "UserProgress" p SET coins = w.balance
       FROM "Wallet" w
      WHERE w."userId" = p."userId" AND p."userId" = ANY($1::uuid[])`,
    [[ids.employeeUser, ids.managerUser]],
  ).catch(() => undefined)

  await query(
    `DELETE FROM "CoinTransaction"
      WHERE "referenceType" = 'RewardRedemption'
        AND "referenceId" IN (
          SELECT r.id FROM "RewardRedemption" r
           WHERE r."rewardId" IN (SELECT id FROM "Reward" WHERE title LIKE $1)
        )`,
    [`${PREFIX}%`],
  ).catch(() => undefined)

  await query(
    `DELETE FROM "Notification"
      WHERE type = 'REDEMPTION_UPDATE'
        AND data->>'redemptionId' IN (
          SELECT r.id FROM "RewardRedemption" r
           WHERE r."rewardId" IN (SELECT id FROM "Reward" WHERE title LIKE $1)
        )`,
    [`${PREFIX}%`],
  ).catch(() => undefined)

  await query(
    `DELETE FROM "AuditLog"
      WHERE "targetType" IN ('RewardRedemption', 'Reward')
        AND ("targetId" IN (
               SELECT r.id FROM "RewardRedemption" r
                WHERE r."rewardId" IN (SELECT id FROM "Reward" WHERE title LIKE $1)
             )
             OR "targetId" IN (SELECT id FROM "Reward" WHERE title LIKE $1))`,
    [`${PREFIX}%`],
  ).catch(() => undefined)

  // Cascade takes the redemptions with the reward.
  await query(`DELETE FROM "Reward" WHERE title LIKE $1`, [`${PREFIX}%`]).catch(() => undefined)
  await closeDb()
})

// ===========================================================================
describe('the shop an employee sees', () => {
  it('lists the company’s own catalogue with a price, a stock and a verdict', async () => {
    const result = await catalogue(employee)
    expect(result.status, why(result)).toBe(200)

    const { balance, level, items } = result.body
    expect(balance).toBe(await balanceOf(employee))
    expect(level).toBeGreaterThan(0)
    expect(items.length).toBeGreaterThan(0)

    for (const item of items) {
      // The price and the verdict come from the company's rows, never from a
      // table in the code.
      expect(item.coinCost).toBeGreaterThan(0)
      expect(item.standing.affordable).toBe(balance >= item.coinCost)
      // Employees only ever see listed rewards, but a listed reward can still be
      // outside its window or sold out — and then the card says which.
      if (!item.standing.available) {
        expect(['NOT_AVAILABLE_YET', 'EXPIRED', 'OUT_OF_STOCK']).toContain(item.standing.code)
      }
      expect(item.standing.redeemable).toBe(item.standing.code === null)
      expect(item.remainingAllowance === null || item.remainingAllowance >= 0).toBe(true)
    }
  })

  it('hides a draft from the shop but keeps it on the admin shelf', async () => {
    const id = await createReward('پیش‌نویس', { coinCost: 10, status: 'DRAFT' })

    const shop = await catalogue(employee)
    expect(shop.body.items.some(item => item.id === id)).toBe(false)

    const admin = await shelf()
    const row = admin.body.items.find(item => item.id === id)
    expect(row?.status).toBe('DRAFT')
    expect(row?.availability).toEqual({ available: false, code: 'NOT_LISTED' })
  })

  it('filters the shop by type', async () => {
    await createReward('ژتون تایم‌آف', { coinCost: 10, type: 'TIME_OFF' })

    const filtered = await catalogue(employee, { type: 'TIME_OFF' })
    expect(filtered.status).toBe(200)
    expect(filtered.body.items.length).toBeGreaterThan(0)
    expect(filtered.body.items.every(item => item.type === 'TIME_OFF')).toBe(true)
  })

  it('serves the detail of one reward with the employee’s own history', async () => {
    const id = await createReward('جزئیات', { coinCost: 10 })
    const bought = await redeem(employee, id)
    expect(bought.status, why(bought)).toBe(200)

    const result = await detail(employee, id)
    expect(result.status, why(result)).toBe(200)
    expect(result.body.reward.id).toBe(id)
    expect(result.body.redemptions).toHaveLength(1)
    expect(result.body.redemptions[0]!.id).toBe(bought.body.redemption.id)
    // Own history only: the employee never sees who else asked for it.
    expect(result.body.redemptions[0]!.user).toBeUndefined()
  })

  it('answers 404 for a reward that does not exist', async () => {
    const result = await detail(employee, randomUUID())
    expect(result.status).toBe(404)
  })

  // `/api/rewards/admin` and `/api/rewards/redemptions` sit next to
  // `/api/rewards/:id` in the same folder. If the router ever preferred the
  // parameter over the literal, both would be swallowed by the detail handler
  // and fail on "not a uuid".
  it('routes the literal segments past the :id handler', async () => {
    expect((await shelf()).status).toBe(200)
    expect((await adminQueue()).status).toBe(200)
    expect((await myRedemptions(employee)).status).toBe(200)
  })
})

// ===========================================================================
describe('buying a reward', () => {
  it('charges the price through the ledger, takes the stock, and opens a request', async () => {
    const before = await balanceOf(employee)
    const id = await createReward('ماگ آزمون', { coinCost: 25, stock: 3 })

    const result = await redeem(employee, id)
    expect(result.status, why(result)).toBe(200)
    expect(result.body.charged).toBe(true)
    expect(result.body.balance).toBe(before - 25)
    expect(result.body.redemption.status).toBe('PENDING') // no autoApprove → a human decides
    expect(result.body.redemption.coinCost).toBe(25)
    expect(result.body.redemption.cancellable).toBe(true)

    expect(await balanceOf(employee)).toBe(before - 25)
    expect(await stockOf(id)).toBe(2)

    const rows = await ledgerOf(result.body.redemption.id)
    expect(rows).toHaveLength(1)
    expect(rows[0]!.amount).toBe(-25)
    expect(rows[0]!.type).toBe('REWARD_REDEMPTION')
    expect(rows[0]!.source).toBe('REWARD_REDEMPTION')
    expect(rows[0]!.balanceAfter).toBe(before - 25)
    expect(rows[0]!.idempotencyKey).toBe(`redemption:${result.body.redemption.id}:debit`)
  })

  it('auto-approves a reward the company flagged as automatic', async () => {
    const id = await createReward('قهوهٔ خودکار', { coinCost: 15, rules: { autoApprove: true } })

    const result = await redeem(employee, id)
    expect(result.status, why(result)).toBe(200)
    expect(result.body.redemption.status).toBe('APPROVED')
    expect(result.body.charged).toBe(true)
    // Approved, so it is past the point where the employee may take it back —
    // and the summary says so instead of offering a button the server refuses.
    expect(result.body.redemption.availableActions).toEqual([])
    expect(result.body.redemption.cancellable).toBe(false)

    // It still lands in the queue, because it still has to be handed over.
    const queued = await adminQueue({ status: 'APPROVED', rewardId: id })
    const row = queued.body.items.find(item => item.id === result.body.redemption.id)
    expect(row).toBeDefined()
    // No APPROVE among the admin's moves: the company already decided that.
    expect(row!.availableActions).toEqual(['REJECT', 'FULFIL', 'CANCEL'])
  })

  it('leaves a manual reward in the queue for an admin', async () => {
    const id = await createReward('مرخصی دستی', { coinCost: 15 })
    const result = await redeem(employee, id)
    expect(result.body.redemption.status).toBe('PENDING')
    expect(result.body.redemption.availableActions).toEqual(['CANCEL']) // the employee's own move

    // Scoped to this reward: the queue is oldest-first and paged, so a fresh
    // request is not necessarily on page one of everything.
    const pending = await adminQueue({ status: 'PENDING', rewardId: id })
    const row = pending.body.items.find(item => item.id === result.body.redemption.id)
    expect(row).toBeDefined()
    // The admin's moves, computed from the status machine — never an illegal one.
    expect(row!.availableActions).toEqual(['APPROVE', 'REJECT', 'CANCEL'])
    expect(row!.user?.id).toBe(ids.employeeUser)
  })

  it('reads the price from the reward row, never from the request', async () => {
    const before = await balanceOf(employee)
    const id = await createReward('قیمت سروری', { coinCost: 30 })

    // A client that could set its own price could buy anything for one coin.
    const result = await redeem(employee, id, { coinCost: 1, price: 1, amount: 1 })
    expect(result.status, why(result)).toBe(200)
    expect(result.body.redemption.coinCost).toBe(30)
    expect(result.body.balance).toBe(before - 30)
  })

  it('never decrements an unlimited shelf', async () => {
    const id = await createReward('نامحدود', { coinCost: 5, stock: null })
    expect(await stockOf(id)).toBeNull()

    await redeem(employee, id)
    await redeem(manager, id)

    expect(await stockOf(id)).toBeNull()
    expect(await redemptionsOf(id)).toHaveLength(2)
  })

  it('stores the note a reward asks for, and refuses to guess one', async () => {
    const id = await createReward('کمک خیریه', { coinCost: 12, rules: { requiresNote: true } })

    const withoutNote = await redeem(employee, id)
    expect(withoutNote.status).toBe(400)
    expect(envelope(withoutNote).code).toBe('NOTE_REQUIRED')
    expect(await redemptionsOf(id)).toHaveLength(0) // nothing was written

    const blank = await redeem(employee, id, { note: '   ' })
    expect(envelope(blank).code).toBe('NOTE_REQUIRED')

    const withNote = await redeem(employee, id, { note: 'به نام مادرم' })
    expect(withNote.status, why(withNote)).toBe(200)
    expect(withNote.body.redemption.note).toBe('به نام مادرم')
    expect((await redemptionRow(withNote.body.redemption.id))?.note).toBe('به نام مادرم')
  })

  it('shows the employee their own requests, newest first, and nobody else’s', async () => {
    const id = await createReward('تاریخچه', { coinCost: 8 })
    const mine = await redeem(employee, id)
    await redeem(manager, id)

    const result = await myRedemptions(employee)
    expect(result.status, why(result)).toBe(200)
    expect(result.body.items.some(row => row.id === mine.body.redemption.id)).toBe(true)
    // Newest first, like a bank statement.
    const stamps = result.body.items.map(row => Date.parse(row.requestedAt))
    expect(stamps).toEqual([...stamps].sort((left, right) => right - left))
    // The employee's own list never carries anybody's name — not even their own.
    expect(result.body.items.every(row => !row.user)).toBe(true)

    // The same request, seen by an admin: attributed, and only this reward's.
    const queue = await adminQueue({ rewardId: id })
    expect(queue.body.items).toHaveLength(2)
    expect(queue.body.items.find(row => row.id === mine.body.redemption.id)?.user?.id).toBe(ids.employeeUser)

    // And the manager's request is in the queue but not in the employee's history.
    const managerRequest = queue.body.items.find(row => row.id !== mine.body.redemption.id)
    expect(managerRequest?.user?.id).toBe(ids.managerUser)
    expect(result.body.items.some(row => row.id === managerRequest?.id)).toBe(false)
  })
})

// ===========================================================================
describe('refusing a redemption', () => {
  it('refuses an insufficient balance and leaves nothing behind', async () => {
    const before = await balanceOf(employee)
    const id = await createReward('گران', { coinCost: before + 1, stock: 4 })

    const result = await redeem(employee, id)
    expect(result.status).toBe(400)
    expect(envelope(result).code).toBe('INSUFFICIENT_COINS')

    expect(await balanceOf(employee)).toBe(before)
    expect(await redemptionsOf(id)).toHaveLength(0)
    expect(await stockOf(id)).toBe(4) // a refusal reserves nothing
  })

  it('treats exactly-the-price as affordable and one coin more as not', async () => {
    const before = await balanceOf(employee)
    const affordable = await createReward('دقیقاً به اندازه', { coinCost: before })
    const bought = await redeem(employee, affordable)
    expect(bought.status, why(bought)).toBe(200)
    expect(await balanceOf(employee)).toBe(0)

    const oneMore = await createReward('یکی گران‌تر', { coinCost: 1 })
    const refused = await redeem(employee, oneMore)
    expect(refused.status).toBe(400)
    expect(envelope(refused).code).toBe('INSUFFICIENT_COINS')

    // An empty wallet would starve every later test, so the coins go straight
    // back the way they are meant to: a rejection, through the ledger.
    expect((await decide(bought.body.redemption.id, 'REJECT', 'پایان آزمون')).status).toBe(200)
    expect(await balanceOf(employee)).toBe(before)
  })

  it('refuses a reward whose window has not opened, or has closed', async () => {
    const future = await createReward('آینده', {
      coinCost: 5,
      rules: { availableFrom: new Date(Date.now() + 7 * 86_400_000).toISOString() },
    })
    const notYet = await redeem(manager, future)
    expect(notYet.status).toBe(409)
    expect(envelope(notYet).code).toBe('NOT_AVAILABLE_YET')

    const past = await createReward('گذشته', {
      coinCost: 5,
      rules: { availableUntil: new Date(Date.now() - 86_400_000).toISOString() },
    })
    const expired = await redeem(manager, past)
    expect(expired.status).toBe(409)
    expect(envelope(expired).code).toBe('EXPIRED')

    expect(await redemptionsOf(future)).toHaveLength(0)
    expect(await redemptionsOf(past)).toHaveLength(0)
  })

  it('refuses a reward taken off the shelf', async () => {
    const id = await createReward('توقف‌یافته', { coinCost: 5 })
    expect((await patchReward(id, { status: 'PAUSED' })).status).toBe(200)

    const result = await redeem(employee, id)
    expect(result.status).toBe(409)
    expect(envelope(result).code).toBe('NOT_LISTED')
    expect(await redemptionsOf(id)).toHaveLength(0)
  })

  it('refuses a level the employee has not reached', async () => {
    const level = await levelOf(employee)
    const id = await createReward('سطح بالا', { coinCost: 5, rules: { minLevel: level + 50 } })

    const result = await redeem(employee, id)
    expect(result.status).toBe(403)
    expect(envelope(result).code).toBe('LEVEL_REQUIRED')

    // And the card already said so, before anybody clicked.
    const shop = await catalogue(employee)
    expect(shop.body.items.find(item => item.id === id)?.standing.code).toBe('LEVEL_REQUIRED')
  })

  it('enforces the per-person cap', async () => {
    const id = await createReward('سقف یک', { coinCost: 5, rules: { maxPerUser: 1 } })

    const first = await redeem(employee, id)
    expect(first.status, why(first)).toBe(200)

    // A *different* idempotency key: this is a second, genuine attempt, not a
    // retry — and the cap is what stops it.
    const second = await redeem(employee, id, { idempotencyKey: randomUUID() })
    expect(second.status).toBe(409)
    expect(envelope(second).code).toBe('LIMIT_REACHED')

    expect(await redemptionsOf(id)).toHaveLength(1)
    const shop = await catalogue(employee)
    const item = shop.body.items.find(row => row.id === id)
    expect(item?.remainingAllowance).toBe(0)
    expect(item?.myLiveRedemptions).toBe(1)
    expect(item?.standing.code).toBe('LIMIT_REACHED')
  })

  it('gives the allowance back once a request is no longer live', async () => {
    const id = await createReward('سقف برگشتی', { coinCost: 5, rules: { maxPerUser: 1 } })
    const first = await redeem(employee, id)
    expect(envelope(await redeem(employee, id, { idempotencyKey: randomUUID() })).code).toBe('LIMIT_REACHED')

    // Cancelled means the coins and the slot both come back.
    expect((await cancelOwn(employee, first.body.redemption.id)).status).toBe(200)
    const second = await redeem(employee, id, { idempotencyKey: randomUUID() })
    expect(second.status, why(second)).toBe(200)
    expect(await redemptionsOf(id)).toHaveLength(2)
  })

  it('is not reachable without a session', async () => {
    const id = await createReward('بدون نشست', { coinCost: 5 })
    // A suspended account is refused by the pure check the endpoint runs, which
    // `test/marketplace.test.ts` exercises directly; here the gate before it.
    const anonymous = new ApiClient()
    const result = await anonymous.request(`/api/rewards/${id}/redeem`, { method: 'POST', body: {} })
    expect(result.status).toBe(401)
    expect(await redemptionsOf(id)).toHaveLength(0)
  })
})

// ===========================================================================
describe('out of stock', () => {
  it('sells the last unit and then refuses the next buyer', async () => {
    const id = await createReward('آخرین واحد', { coinCost: 5, stock: 1 })

    const first = await redeem(employee, id)
    expect(first.status, why(first)).toBe(200)
    expect(await stockOf(id)).toBe(0)

    const second = await redeem(manager, id)
    expect(second.status).toBe(409)
    expect(envelope(second).code).toBe('OUT_OF_STOCK')

    expect(await stockOf(id)).toBe(0)
    expect(await redemptionsOf(id)).toHaveLength(1) // the refusal wrote nothing

    // The shop says so without anybody having to click.
    const shop = await catalogue(manager)
    expect(shop.body.items.find(item => item.id === id)?.standing.code).toBe('OUT_OF_STOCK')
  })

  it('lets two buyers race for one unit, and exactly one of them wins', async () => {
    const id = await createReward('رقابت', { coinCost: 5, stock: 1 })

    // Two sessions, two idempotency keys, one unit — fired together so the row
    // lock, not luck, decides.
    const [a, b] = await Promise.all([
      redeem(employee, id, { idempotencyKey: randomUUID() }),
      redeem(manager, id, { idempotencyKey: randomUUID() }),
    ])

    const outcomes = [a, b]
    const winners = outcomes.filter(result => result.status === 200)

    // Never two winners: that is the oversell this test exists to catch. The
    // loser's exact status is less portable — the sandbox database serves every
    // connection from one PostgreSQL protocol state, so two queries in flight at
    // once can collide on it (08P01) and surface as a 500. Against a real server
    // it is a clean 409 OUT_OF_STOCK, which the sequential test above asserts.
    expect(winners.length).toBeLessThanOrEqual(1)
    for (const result of outcomes.filter(item => item.status !== 200)) {
      expect([409, 500]).toContain(result.status)
      if (result.status === 409) expect(envelope(result).code).toBe('OUT_OF_STOCK')
    }

    // Whatever the race did to the HTTP responses, the shelf is unambiguous:
    // one unit, sold once, to one person, paid for once.
    expect(await stockOf(id)).toBe(0)
    const rows = await redemptionsOf(id)
    expect(rows).toHaveLength(1)
    expect(await ledgerOf(rows[0]!.id)).toHaveLength(1)
    if (winners.length === 1) {
      expect(winners[0]!.body.charged).toBe(true)
      expect(rows[0]!.id).toBe(winners[0]!.body.redemption.id)
    }

    // And nobody who did not get the reward paid for it.
    const paid = await query<{ n: number }>(
      `SELECT COUNT(*)::int AS n FROM "CoinTransaction"
        WHERE "referenceType" = 'RewardRedemption' AND amount < 0
          AND "referenceId" IN (SELECT id FROM "RewardRedemption" WHERE "rewardId" = $1::uuid)`,
      [id],
    )
    expect(paid[0]!.n).toBe(1)
  })

  it('restores the unit when a request is rejected', async () => {
    const id = await createReward('بازگشت موجودی', { coinCost: 5, stock: 1 })
    const bought = await redeem(employee, id)
    expect(await stockOf(id)).toBe(0)

    const rejected = await decide(bought.body.redemption.id, 'REJECT', 'امکان تأمین نداریم')
    expect(rejected.status, why(rejected)).toBe(200)
    expect(await stockOf(id)).toBe(1)

    // Somebody else can now have it.
    expect((await redeem(manager, id)).status).toBe(200)
    expect(await stockOf(id)).toBe(0)
  })
})

// ===========================================================================
describe('a repeated redemption', () => {
  it('replays the same idempotency key instead of charging twice', async () => {
    const before = await balanceOf(employee)
    const id = await createReward('کلیک دوباره', { coinCost: 20 })
    const key = randomUUID()

    const first = await redeem(employee, id, { idempotencyKey: key })
    expect(first.status, why(first)).toBe(200)
    expect(first.body.charged).toBe(true)

    const retry = await redeem(employee, id, { idempotencyKey: key })
    expect(retry.status, why(retry)).toBe(200)
    expect(retry.body.charged).toBe(false) // nothing moved
    expect(retry.body.redemption.id).toBe(first.body.redemption.id)
    expect(retry.body.balance).toBe(first.body.balance)

    const third = await redeem(employee, id, { idempotencyKey: key })
    expect(third.body.charged).toBe(false)

    expect(await balanceOf(employee)).toBe(before - 20) // one debit, not three
    expect(await redemptionsOf(id)).toHaveLength(1)
    expect(await ledgerOf(first.body.redemption.id)).toHaveLength(1)
  })

  it('survives the same key arriving twice at once', async () => {
    const before = await balanceOf(employee)
    const id = await createReward('رقابت کلید', { coinCost: 20 })
    const key = randomUUID()

    const [a, b] = await Promise.all([
      redeem(employee, id, { idempotencyKey: key }),
      redeem(employee, id, { idempotencyKey: key }),
    ])

    // One of them charged. The other either replayed the winner (the intended
    // answer, and what a real PostgreSQL always gives) or lost to the sandbox
    // database's single shared protocol state — but it never charged twice.
    const successes = [a, b].filter(result => result.status === 200)
    expect(successes.length).toBeGreaterThanOrEqual(1)
    expect(successes.filter(result => result.body.charged)).toHaveLength(1)
    expect(new Set(successes.map(result => result.body.redemption.id)).size).toBe(1)
    for (const result of [a, b].filter(item => item.status !== 200)) {
      expect([409, 500]).toContain(result.status)
    }

    expect(await balanceOf(employee)).toBe(before - 20)
    expect(await redemptionsOf(id)).toHaveLength(1)
    expect(await ledgerOf(successes[0]!.body.redemption.id)).toHaveLength(1)
  })

  it('is the unique index, not application logic, that enforces it', async () => {
    const id = await createReward('کلید در پایگاه', { coinCost: 5 })
    const bought = await redeem(employee, id, { idempotencyKey: randomUUID() })
    const redemptionId = bought.body.redemption.id

    const rows = await ledgerOf(redemptionId)
    expect(rows[0]!.idempotencyKey).toBeTruthy()

    // Replaying the very same ledger row must be refused by the database.
    await expect(
      query(
        `INSERT INTO "CoinTransaction"
           (id, "companyId", "userId", "walletId", amount, type, source, "referenceType", "referenceId", "idempotencyKey", "createdAt")
         SELECT gen_random_uuid(), "companyId", "userId", "walletId", amount, type, source, "referenceType", "referenceId", "idempotencyKey", now()
           FROM "CoinTransaction" WHERE "referenceId" = $1::uuid`,
        [redemptionId],
      ),
    ).rejects.toThrow()
  })

  it('treats a request without a key as a fresh decision, bounded by the cap', async () => {
    const id = await createReward('بدون کلید', { coinCost: 5, rules: { maxPerUser: 3 } })

    expect((await redeem(employee, id)).status).toBe(200)
    expect((await redeem(employee, id)).status).toBe(200)
    expect((await redeem(employee, id)).status).toBe(200)
    expect(envelope(await redeem(employee, id)).code).toBe('LIMIT_REACHED')

    expect(await redemptionsOf(id)).toHaveLength(3)
  })
})

// ===========================================================================
describe('the ledger', () => {
  it('keeps the wallet equal to the sum of its transactions', async () => {
    const id = await createReward('یکپارچگی', { coinCost: 7 })
    await redeem(employee, id)

    const state = await walletInvariant(ids.employeeUser)
    expect(state.balance).toBe(state.ledger)
  })

  it('writes one debit per redemption and one refund per reversal — never a bare balance edit', async () => {
    const id = await createReward('شمارش ردیف‌ها', { coinCost: 6, stock: 10 })
    const kept = await redeem(employee, id)
    const refunded = await redeem(employee, id, { idempotencyKey: randomUUID() })
    await decide(refunded.body.redemption.id, 'REJECT', 'بودجه تمام شد')

    const debit = await ledgerOf(kept.body.redemption.id)
    expect(debit).toHaveLength(1)
    expect(debit[0]!.amount).toBe(-6)

    const both = await ledgerOf(refunded.body.redemption.id)
    expect(both).toHaveLength(2)
    expect(both[0]!.amount).toBe(-6)
    expect(both[0]!.source).toBe('REWARD_REDEMPTION')
    expect(both[1]!.amount).toBe(6) // the coins came back as their own row
    expect(both[1]!.source).toBe('REFUND')
    expect(both[1]!.idempotencyKey).toBe(`redemption:${refunded.body.redemption.id}:refund`)

    // Every charged request has a ledger row, and no ledger row exists without
    // a request: the two sets are the same size.
    const counts = await query<{ redemptions: number, debits: number }>(
      `SELECT (SELECT COUNT(*) FROM "RewardRedemption" WHERE "rewardId" = $1::uuid)::int AS redemptions,
              (SELECT COUNT(*) FROM "CoinTransaction"
                WHERE "referenceType" = 'RewardRedemption' AND source = 'REWARD_REDEMPTION'
                  AND "referenceId" IN (SELECT id FROM "RewardRedemption" WHERE "rewardId" = $1::uuid))::int AS debits`,
      [id],
    )
    expect(counts[0]!.debits).toBe(counts[0]!.redemptions)
  })

  it('stamps a running balance on every row, so a statement needs no re-sum', async () => {
    const id = await createReward('ماندهٔ جاری', { coinCost: 4, stock: 10 })
    const before = await balanceOf(employee)

    const first = await redeem(employee, id)
    const second = await redeem(employee, id, { idempotencyKey: randomUUID() })

    // Each row carries the balance it left behind, so a statement can be read
    // without re-summing — and the second purchase starts where the first ended.
    expect(first.body.balance).toBe(before - 4)
    expect(second.body.balance).toBe(first.body.balance - 4)

    // Identified by their own redemption, never by a timestamp the suite shares
    // with other ledgers: two rows written in the same millisecond have no order.
    const [firstRow] = await ledgerOf(first.body.redemption.id)
    const [secondRow] = await ledgerOf(second.body.redemption.id)
    expect(firstRow!.balanceAfter).toBe(first.body.balance)
    expect(secondRow!.balanceAfter).toBe(firstRow!.balanceAfter + secondRow!.amount)
    expect(secondRow!.balanceAfter).toBe(await balanceOf(employee))
  })

  it('snapshots the price, so repricing cannot rewrite what somebody paid', async () => {
    const id = await createReward('بازقیمت‌گذاری', { coinCost: 40 })
    const before = await balanceOf(employee)
    const bought = await redeem(employee, id)

    expect((await patchReward(id, { coinCost: 400 })).status).toBe(200)

    const row = await redemptionRow(bought.body.redemption.id)
    expect(row?.coinCost).toBe(40) // what they paid, not what it costs now
    expect((await ledgerOf(bought.body.redemption.id))[0]!.amount).toBe(-40)
    expect(await balanceOf(employee)).toBe(before - 40)

    // And the next buyer pays the new price.
    const next = await redeem(manager, id)
    expect(next.body.redemption.coinCost).toBe(400)
  })

  it('refuses a refund twice, even if the decision is retried', async () => {
    const id = await createReward('بازگشت دوباره', { coinCost: 9 })
    const bought = await redeem(employee, id)
    const before = await balanceOf(employee)

    const rejected = await decide(bought.body.redemption.id, 'REJECT', 'ناموجود')
    expect(rejected.status).toBe(200)
    expect(rejected.body.refunded).toBe(9)
    expect(rejected.body.balance).toBe(before + 9)

    const again = await decide(bought.body.redemption.id, 'REJECT', 'دوباره')
    expect(again.status).toBe(409) // settled requests accept nothing

    expect(await ledgerOf(bought.body.redemption.id)).toHaveLength(2) // debit + one refund
    expect(await balanceOf(employee)).toBe(before + 9)
  })
})

// ===========================================================================
describe('the admin queue', () => {
  it('approves, then fulfils, without moving any more money', async () => {
    const id = await createReward('تأیید و تحویل', { coinCost: 11, stock: 2 })
    const bought = await redeem(employee, id)
    const afterPurchase = await balanceOf(employee)

    const approved = await decide(bought.body.redemption.id, 'APPROVE', 'حتماً')
    expect(approved.status, why(approved)).toBe(200)
    expect(approved.body.redemption.status).toBe('APPROVED')
    expect(approved.body.redemption.decisionNote).toBe('حتماً')
    expect(approved.body.refunded).toBe(0)
    expect(await balanceOf(employee)).toBe(afterPurchase) // approval moves nothing
    expect(await ledgerOf(bought.body.redemption.id)).toHaveLength(1)

    const fulfilled = await decide(bought.body.redemption.id, 'FULFIL')
    expect(fulfilled.status, why(fulfilled)).toBe(200)
    expect(fulfilled.body.redemption.status).toBe('FULFILLED')
    expect(fulfilled.body.redemption.fulfilledAt).toBeTruthy()
    expect(fulfilled.body.refunded).toBe(0)
    expect(fulfilled.body.redemption.availableActions).toEqual([]) // settled
    expect(await ledgerOf(bought.body.redemption.id)).toHaveLength(1)
    expect(await stockOf(id)).toBe(1) // a fulfilled unit does not come back
  })

  it('rejects a pending request and gives the coins and the stock back', async () => {
    const id = await createReward('رد درخواست', { coinCost: 13, stock: 4 })
    const before = await balanceOf(employee)
    const bought = await redeem(employee, id)

    const rejected = await decide(bought.body.redemption.id, 'REJECT', 'این فصل بودجه نداریم')
    expect(rejected.status, why(rejected)).toBe(200)
    expect(rejected.body.redemption.status).toBe('REJECTED')
    expect(rejected.body.redemption.refunded).toBe(true)
    expect(rejected.body.redemption.decisionNote).toBe('این فصل بودجه نداریم')
    expect(rejected.body.refunded).toBe(13)
    expect(rejected.body.balance).toBe(before)

    expect(await balanceOf(employee)).toBe(before)
    expect(await stockOf(id)).toBe(4)
  })

  it('lets an admin cancel an approved request, which refunds it too', async () => {
    const id = await createReward('لغو مدیر', { coinCost: 14, stock: 2 })
    const before = await balanceOf(employee)
    const bought = await redeem(employee, id)
    expect((await decide(bought.body.redemption.id, 'APPROVE')).status).toBe(200)

    const cancelled = await decide(bought.body.redemption.id, 'CANCEL', 'لغو شد')
    expect(cancelled.status, why(cancelled)).toBe(200)
    expect(cancelled.body.redemption.status).toBe('CANCELLED')
    expect(cancelled.body.refunded).toBe(14)
    expect(await balanceOf(employee)).toBe(before)
    expect(await stockOf(id)).toBe(2)
  })

  it('refuses to skip a step or to move a settled request', async () => {
    const id = await createReward('حرکت نامعتبر', { coinCost: 6 })
    const bought = await redeem(employee, id)

    const skipped = await decide(bought.body.redemption.id, 'FULFIL')
    expect(skipped.status).toBe(409) // PENDING cannot be fulfilled directly
    expect(envelope(skipped).code).toBe('CONFLICT')
    expect((await redemptionRow(bought.body.redemption.id))?.status).toBe('PENDING')

    expect((await decide(bought.body.redemption.id, 'APPROVE')).status).toBe(200)
    expect((await decide(bought.body.redemption.id, 'APPROVE')).status).toBe(409) // APPROVED → APPROVED is nothing

    const settled = await decide(bought.body.redemption.id, 'FULFIL')
    expect(settled.status).toBe(200)
    for (const action of ['APPROVE', 'REJECT', 'FULFIL', 'CANCEL']) {
      expect((await decide(bought.body.redemption.id, action)).status).toBe(409)
    }
  })

  it('filters and pages the queue', async () => {
    const id = await createReward('صفحه‌بندی', { coinCost: 3, stock: 30 })
    for (let index = 0; index < 3; index += 1) {
      await redeem(employee, id, { idempotencyKey: randomUUID() })
    }

    const page = await adminQueue({ status: 'PENDING', pageSize: '2', page: '1' })
    expect(page.status, why(page)).toBe(200)
    expect(page.body.items).toHaveLength(2)
    expect(page.body.page).toBe(1)
    expect(page.body.pageSize).toBe(2)
    expect(page.body.total).toBeGreaterThanOrEqual(3)

    const second = await adminQueue({ status: 'PENDING', pageSize: '2', page: '2' })
    expect(second.body.items.map(row => row.id)).not.toEqual(page.body.items.map(row => row.id))

    const byReward = await adminQueue({ rewardId: id })
    expect(byReward.body.items.every(row => row.reward.id === id)).toBe(true)
    expect(byReward.body.total).toBe(3)

    const byUser = await adminQueue({ userId: ids.employeeUser })
    expect(byUser.body.items.every(row => row.user?.id === ids.employeeUser)).toBe(true)
  })

  it('reports what the shelf has collected', async () => {
    const id = await createReward('گزارش قفسه', { coinCost: 10, stock: 5 })
    const kept = await redeem(employee, id)
    const refunded = await redeem(employee, id, { idempotencyKey: randomUUID() })
    await decide(refunded.body.redemption.id, 'REJECT')

    const result = await shelf()
    const row = result.body.items.find(item => item.id === id)
    expect(row?.redemptions.total).toBe(2)
    expect(row?.redemptions.pending).toBe(1)
    expect(row?.redemptions.rejected).toBe(1)
    // Ten coins in, ten given back: only the kept request took money out of
    // circulation.
    expect(row?.coinsCollected).toBe(10)
    expect(row?.stock).toBe(4) // the rejected unit is back on the shelf
    expect(result.body.queue.pending).toBeGreaterThanOrEqual(1)

    const queued = await adminQueue({ status: 'PENDING', rewardId: id })
    expect(queued.body.items.some(item => item.id === kept.body.redemption.id)).toBe(true)
  })
})

// ===========================================================================
describe('cancelling your own request', () => {
  it('cancels while it is still pending, and refunds', async () => {
    const id = await createReward('لغو خودم', { coinCost: 17, stock: 3 })
    const before = await balanceOf(employee)
    const bought = await redeem(employee, id)

    const result = await cancelOwn(employee, bought.body.redemption.id)
    expect(result.status, why(result)).toBe(200)
    expect(result.body.redemption.status).toBe('CANCELLED')
    expect(result.body.refunded).toBe(17)
    expect(await balanceOf(employee)).toBe(before)
    expect(await stockOf(id)).toBe(3)
  })

  it('refuses once an admin has approved it — that call is the company’s', async () => {
    const id = await createReward('لغو دیرهنگام', { coinCost: 18 })
    const bought = await redeem(employee, id)
    expect((await decide(bought.body.redemption.id, 'APPROVE')).status).toBe(200)

    const result = await cancelOwn(employee, bought.body.redemption.id)
    expect(result.status).toBe(409)
    expect((await redemptionRow(bought.body.redemption.id))?.status).toBe('APPROVED')

    // And the catalogue agrees: nothing left for the employee to do.
    const mine = await myRedemptions(employee, { status: 'APPROVED' })
    expect(mine.body.items.find(row => row.id === bought.body.redemption.id)?.cancellable).toBe(false)
  })

  it('refuses to cancel somebody else’s request', async () => {
    const id = await createReward('لغو دیگران', { coinCost: 19, stock: 5 })
    const bought = await redeem(employee, id)

    const byManager = await cancelOwn(manager, bought.body.redemption.id)
    expect(byManager.status).toBe(403)
    expect((await redemptionRow(bought.body.redemption.id))?.status).toBe('PENDING')

    const byOtherTenant = await cancelOwn(ownerB, bought.body.redemption.id)
    expect(byOtherTenant.status).toBe(404) // another company's request does not exist here
  })

  it('refuses to cancel a request that is already settled', async () => {
    const id = await createReward('لغو بسته', { coinCost: 21 })
    const bought = await redeem(employee, id)
    expect((await decide(bought.body.redemption.id, 'APPROVE')).status).toBe(200)
    expect((await decide(bought.body.redemption.id, 'FULFIL')).status).toBe(200)

    // The request is theirs, so this is not a permission problem — it is a
    // settled request that cannot be unsettled, which is a conflict.
    expect((await cancelOwn(employee, bought.body.redemption.id)).status).toBe(409)
    expect((await redemptionRow(bought.body.redemption.id))?.status).toBe('FULFILLED')
  })
})

// ===========================================================================
describe('who may do what', () => {
  it('keeps the shelf and the queue away from everybody but an admin', async () => {
    const id = await createReward('دسترسی', { coinCost: 5 })
    const bought = await redeem(employee, id)

    expect((await employee.request('/api/rewards/admin')).status).toBe(403)
    expect((await employee.request('/api/rewards/admin/redemptions')).status).toBe(403)
    expect((await manager.request('/api/rewards/admin')).status).toBe(403)
    expect((await manager.request('/api/rewards/admin/redemptions')).status).toBe(403)

    expect((await employee.request('/api/rewards', { method: 'POST', body: { title: 'تلاش', coinCost: 1 } })).status).toBe(403)
    expect((await manager.request('/api/rewards', { method: 'POST', body: { title: 'تلاش', coinCost: 1 } })).status).toBe(403)
    expect((await employee.request(`/api/rewards/${id}`, { method: 'PATCH', body: { coinCost: 1 } })).status).toBe(403)

    const decidedByEmployee = await employee.request(
      `/api/rewards/admin/redemptions/${bought.body.redemption.id}/decision`,
      { method: 'POST', body: { action: 'APPROVE' } },
    )
    expect(decidedByEmployee.status).toBe(403)

    // A manager may spend, but may not decide.
    expect((await manager.request(`/api/rewards/admin/redemptions/${bought.body.redemption.id}/decision`, {
      method: 'POST',
      body: { action: 'APPROVE' },
    })).status).toBe(403)
    expect((await redeem(manager, id)).status).toBe(200)
  })

  it('does not let one company see, price or decide another company’s rewards', async () => {
    const id = await createReward('مرز شرکت‌ها', { coinCost: 5 })
    const bought = await redeem(employee, id)

    expect((await detail(ownerB, id)).status).toBe(404)
    expect((await redeem(ownerB, id)).status).toBe(404)
    expect((await ownerB.request(`/api/rewards/${id}`, { method: 'PATCH', body: { coinCost: 1 } })).status).toBe(404)

    const decided = await ownerB.request(
      `/api/rewards/admin/redemptions/${bought.body.redemption.id}/decision`,
      { method: 'POST', body: { action: 'REJECT' } },
    )
    expect(decided.status).toBe(404)

    const queue = await ownerB.request<RedemptionListResponse>('/api/rewards/admin/redemptions')
    expect(queue.status).toBe(200)
    expect(queue.body.items.some(row => row.id === bought.body.redemption.id)).toBe(false)

    // Nothing moved while tenant B was knocking.
    expect((await redemptionRow(bought.body.redemption.id))?.status).toBe('PENDING')
  })

  it('requires a session at all', async () => {
    const anonymous = new ApiClient()
    expect((await anonymous.request('/api/rewards')).status).toBe(401)
    expect((await anonymous.request('/api/rewards/admin')).status).toBe(401)
    expect((await anonymous.request('/api/rewards/redemptions')).status).toBe(401)
  })
})

// ===========================================================================
describe('managing the shelf', () => {
  it('creates a reward with the company’s own price, stock and rules', async () => {
    const id = await createReward('قفسهٔ تازه', {
      coinCost: 500,
      stock: 12,
      type: 'TIME_OFF',
      description: 'یک روز مرخصی تشویقی',
      rules: { autoApprove: false, maxPerUser: 2, minLevel: 3, requiresNote: true },
    })

    const result = await shelf()
    const row = result.body.items.find(item => item.id === id)
    expect(row?.coinCost).toBe(500)
    expect(row?.stock).toBe(12)
    expect(row?.type).toBe('TIME_OFF')
    expect(row?.status).toBe('ACTIVE')
    expect(row?.rules).toEqual({
      autoApprove: false,
      maxPerUser: 2,
      minLevel: 3,
      requiresNote: true,
      availableFrom: null,
      availableUntil: null,
    })
    expect(row?.availability).toEqual({ available: true, code: null })
    expect(result.body.counts.ACTIVE).toBeGreaterThanOrEqual(1)
  })

  it('edits, reprices, restocks and disables without deleting history', async () => {
    const id = await createReward('ویرایش', { coinCost: 20, stock: 2 })
    const bought = await redeem(employee, id)

    expect((await patchReward(id, { title: `${PREFIX} — ویرایش‌شده`, coinCost: 45, stock: 9 })).status).toBe(200)
    let row = (await shelf()).body.items.find(item => item.id === id)
    expect(row?.title).toBe(`${PREFIX} — ویرایش‌شده`)
    expect(row?.coinCost).toBe(45)
    // Restocking states how many are on the shelf *now*; it is not a delta, and
    // the unit already sold is not conjured back.
    expect(row?.stock).toBe(9)

    // Disabling is a status, not a deletion: the request keeps its reward.
    expect((await patchReward(id, { status: 'ARCHIVED' })).status).toBe(200)
    row = (await shelf({ status: 'ARCHIVED' })).body.items.find(item => item.id === id)
    expect(row?.status).toBe('ARCHIVED')
    expect(row?.availability.code).toBe('NOT_LISTED')
    expect((await redemptionRow(bought.body.redemption.id))?.coinCost).toBe(20)
    expect(envelope(await redeem(employee, id)).code).toBe('NOT_LISTED')

    // It is off the shop, but a direct link still answers honestly rather than
    // pretending the reward never existed — with the reason it cannot be taken.
    const archived = await detail(employee, id)
    expect(archived.status, why(archived)).toBe(200)
    expect(archived.body.reward.standing).toMatchObject({ available: false, code: 'NOT_LISTED', redeemable: false })
  })

  it('changes only the rules it was sent', async () => {
    const id = await createReward('قاعدهٔ جزئی', {
      coinCost: 10,
      rules: { autoApprove: true, maxPerUser: 5, minLevel: 2, requiresNote: true },
    })

    expect((await patchReward(id, { rules: { maxPerUser: 1 } })).status).toBe(200)

    const row = (await shelf()).body.items.find(item => item.id === id)
    // A default inside the rules object would have silently switched these off.
    expect(row?.rules).toMatchObject({ autoApprove: true, maxPerUser: 1, minLevel: 2, requiresNote: true })
  })

  it('refuses a price, a title or a stock that makes no sense', async () => {
    expect(envelope(await owner.request('/api/rewards', {
      method: 'POST',
      body: { title: `${PREFIX} — رایگان`, coinCost: 0 },
    })).code).toBe('VALIDATION_FAILED')

    const zero = await owner.request('/api/rewards', { method: 'POST', body: { title: `${PREFIX} — رایگان`, coinCost: 0 } })
    expect(zero.status).toBe(422)
    expect((await owner.request('/api/rewards', { method: 'POST', body: { title: 'x', coinCost: 10 } })).status).toBe(422)
    expect((await owner.request('/api/rewards', { method: 'POST', body: { title: `${PREFIX} — منفی`, coinCost: 10, stock: -5 } })).status).toBe(422)
    expect((await owner.request('/api/rewards', { method: 'POST', body: { title: `${PREFIX} — کسری`, coinCost: 10.5 } })).status).toBe(422)
    expect((await owner.request('/api/rewards', { method: 'POST', body: { title: `${PREFIX} — نوع نامعتبر`, coinCost: 10, type: 'CRYPTO' } })).status).toBe(422)

    const id = await createReward('نامعتبر', { coinCost: 10 })
    expect((await patchReward(id, { coinCost: 0 })).status).toBe(422)
    expect((await patchReward(id, { coinCost: 1_000_001 })).status).toBe(422)
    expect((await patchReward(id, { status: 'SOLD_OUT' })).status).toBe(422)
    // Nothing was written by any of it.
    expect((await shelf()).body.items.find(item => item.id === id)?.coinCost).toBe(10)
  })

  it('refuses an idempotency key that is not a key', async () => {
    const id = await createReward('کلید نامعتبر', { coinCost: 5 })
    expect((await redeem(employee, id, { idempotencyKey: 'not-a-uuid' })).status).toBe(422)
    expect(await redemptionsOf(id)).toHaveLength(0)
  })

  it('counts the shelf by status', async () => {
    await createReward('شمارش الف', { coinCost: 5, status: 'DRAFT' })
    await createReward('شمارش ب', { coinCost: 5, status: 'PAUSED' })

    const result = await shelf()
    expect(result.body.counts.DRAFT).toBeGreaterThanOrEqual(1)
    expect(result.body.counts.PAUSED).toBeGreaterThanOrEqual(1)
    expect(result.body.counts.ACTIVE).toBeGreaterThanOrEqual(1)
    expect(result.body.items.length).toBe(
      Object.values(result.body.counts).reduce((sum, count) => sum + count, 0),
    )
  })
})
