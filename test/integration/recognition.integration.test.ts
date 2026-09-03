import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { ApiClient, assertHarnessReady, requestCode } from './helpers'
import { closeDb, query } from './db'

/**
 * The recognition system, end to end.
 *
 * `test/recognition.test.ts` proves the cycle-window and winner-tally maths;
 * this file proves the *system*: voting (with self-vote, duplicate-vote and
 * cross-company rejection), admin configuration, and cycle finalization — that
 * winners are tallied, results are sealed, rewards are paid through the ledgers
 * exactly once, and that re-finalizing pays nothing twice.
 *
 * Fixture (tenant A = «نواندیشان پایا»):
 *   +989120000001  ساینا رستمی   OWNER
 *   +989120000005  نگار احمدی    EMPLOYEE
 *   +989120000006  پویا محمدی    EMPLOYEE
 *   +989120000008  سینا فرهادی   EMPLOYEE
 * Tenant B = «داده‌کاوان آریا»: +989130000001 OWNER.
 */

const OWNER_A = '+989120000001'
const EMPLOYEE_A = '+989120000005'
const EMPLOYEE_B = '+989120000006'
const EMPLOYEE_C = '+989120000008'
const OWNER_B = '+989130000001'

const owner = new ApiClient()
const employeeA = new ApiClient()
const employeeB = new ApiClient()
const employeeC = new ApiClient()
const ownerB = new ApiClient()

const ids: Record<string, string> = {}

async function login(client: ApiClient, phone: string): Promise<void> {
  const code = await requestCode(client, phone)
  const result = await client.request('/api/auth/otp/verify', {
    method: 'POST',
    body: { phone, code },
  })
  expect(result.status, JSON.stringify(result.body)).toBe(200)
}

async function userId(phone: string): Promise<string> {
  const rows = await query<{ id: string }>(`SELECT id FROM "User" WHERE phone = $1`, [phone])
  return rows[0]!.id
}

interface BoardResponse {
  cycle: { id: string, frequency: 'WEEKLY' | 'MONTHLY', endsAt: string }
  categories: Array<{ id: string, name: string, myVote: { fullName: string } | null }>
  results: Array<{
    winners: Array<{
      voteCount: number
      titleName: string | null
      user: { fullName: string }
      category: { name: string }
    }>
  }>
}

async function board(client: ApiClient = employeeA): Promise<BoardResponse> {
  const result = await client.request<BoardResponse>('/api/recognition')
  expect(result.status, JSON.stringify(result.body)).toBe(200)
  return result.body
}

function envelope(result: { status: number, body: unknown }) {
  return (result.body ?? {}) as { code?: string, message?: string }
}

beforeAll(() => {
  assertHarnessReady()
})

beforeAll(async () => {
  await login(owner, OWNER_A)
  await login(employeeA, EMPLOYEE_A)
  await login(employeeB, EMPLOYEE_B)
  await login(employeeC, EMPLOYEE_C)
  await login(ownerB, OWNER_B)

  ids.ownerA = await userId(OWNER_A)
  ids.employeeA = await userId(EMPLOYEE_A)
  ids.employeeB = await userId(EMPLOYEE_B)
  ids.employeeC = await userId(EMPLOYEE_C)
  ids.ownerB = await userId(OWNER_B)
})

afterAll(async () => {
  await query(`DELETE FROM "RecognitionCategory" WHERE name LIKE 'آزمون قدردانی%'`).catch(() => undefined)
  await closeDb()
})

describe('voting', () => {
  it('lets an employee nominate one coworker per category', async () => {
    const before = await board(employeeA)
    const category = before.categories[0]!

    const result = await employeeA.request('/api/recognition/vote', {
      method: 'POST',
      body: { categoryId: category.id, nomineeId: ids.employeeB },
    })
    expect(result.status, JSON.stringify(result.body)).toBe(200)

    const after = await board(employeeA)
    const voted = after.categories.find(cat => cat.id === category.id)
    expect(voted?.myVote).not.toBeNull()
    expect(voted?.myVote?.fullName).toBe('پویا محمدی')
  })

  it('refuses a self-vote', async () => {
    const category = (await board(employeeA)).categories[0]!

    const result = await employeeA.request('/api/recognition/vote', {
      method: 'POST',
      body: { categoryId: category.id, nomineeId: ids.employeeA },
    })
    expect(result.status).toBe(400)
    expect(envelope(result).code).toBe('SELF_VOTE')
  })

  it('refuses a duplicate vote in the same category and cycle', async () => {
    const category = (await board(employeeA)).categories[0]!

    const result = await employeeA.request('/api/recognition/vote', {
      method: 'POST',
      body: { categoryId: category.id, nomineeId: ids.employeeC },
    })
    expect(result.status).toBe(409)
    expect(envelope(result).code).toBe('ALREADY_VOTED')
  })

  it('refuses to vote for someone in another company', async () => {
    const category = (await board(employeeA)).categories[1]!

    const result = await employeeA.request('/api/recognition/vote', {
      method: 'POST',
      body: { categoryId: category.id, nomineeId: ids.ownerB },
    })
    // The nominee resolves to nothing in tenant A — a 404, not a leak.
    expect(result.status).toBe(404)
  })

  it('refuses to vote against another company\'s category', async () => {
    const category = (await board(employeeA)).categories[0]!

    const result = await ownerB.request('/api/recognition/vote', {
      method: 'POST',
      body: { categoryId: category.id, nomineeId: ids.ownerB },
    })
    expect(result.status).toBe(404)
  })
})

describe('admin configuration', () => {
  it('lets an admin create a category and disable it again', async () => {
    const create = await owner.request<{ category: { id: string } }>('/api/recognition/categories', {
      method: 'POST',
      body: {
        name: `آزمون قدردانی — ${Math.random().toString(36).slice(2, 8)}`,
        description: 'دسته آزمایشی',
        xpReward: 40,
        coinReward: 20,
      },
    })
    expect(create.status, JSON.stringify(create.body)).toBe(200)
    const categoryId = create.body.category.id

    const disable = await owner.request(`/api/recognition/categories/${categoryId}`, {
      method: 'PATCH',
      body: { isActive: false },
    })
    expect(disable.status, JSON.stringify(disable.body)).toBe(200)

    // A disabled category is invisible to the board and refuses votes.
    const boardAfter = await board(employeeA)
    expect(boardAfter.categories.some(cat => cat.id === categoryId)).toBe(false)

    const vote = await employeeA.request('/api/recognition/vote', {
      method: 'POST',
      body: { categoryId, nomineeId: ids.employeeB },
    })
    expect(vote.status).toBe(404)
  })

  it('does not let an employee manage categories or the cadence', async () => {
    const create = await employeeA.request('/api/recognition/categories', {
      method: 'POST',
      body: { name: 'دسته غیرمجاز' },
    })
    expect(create.status).toBe(403)

    const cycle = await employeeA.request('/api/recognition/cycle', {
      method: 'PUT',
      body: { frequency: 'MONTHLY' },
    })
    expect(cycle.status).toBe(403)
  })

  it('lets an admin switch the cadence', async () => {
    const result = await owner.request<{ cycle: { frequency: string } }>('/api/recognition/cycle', {
      method: 'PUT',
      body: { frequency: 'MONTHLY' },
    })
    expect(result.status, JSON.stringify(result.body)).toBe(200)
    expect(result.body.cycle.frequency).toBe('MONTHLY')
  })
})

describe('cycle finalization', () => {
  it('tallies winners, seals results and pays rewards exactly once', async () => {
    const created = await owner.request<{ category: { id: string } }>('/api/recognition/categories', {
      method: 'POST',
      body: {
        name: `آزمون قدردانی — ${Math.random().toString(36).slice(2, 8)}`,
        xpReward: 50,
        coinReward: 25,
      },
    })
    expect(created.status, JSON.stringify(created.body)).toBe(200)
    const categoryId = created.body.category.id

    // Two coworkers nominate the same person.
    for (const client of [employeeA, employeeC]) {
      const vote = await client.request('/api/recognition/vote', {
        method: 'POST',
        body: { categoryId, nomineeId: ids.employeeB },
      })
      expect(vote.status, JSON.stringify(vote.body)).toBe(200)
    }

    // Expire the active cycle(s) so finalization has something to do.
    await query(`UPDATE "RecognitionCycle" SET "endsAt" = now() - interval '1 minute' WHERE status = 'ACTIVE'`)

    const finalize = await owner.request<{ finalized: number }>('/api/recognition/finalize', { method: 'POST' })
    expect(finalize.status, JSON.stringify(finalize.body)).toBe(200)

    // The sealed result row, with the winner and the aggregate count.
    const results = await query<{ id: string, winnerId: string, voteCount: number, xpReward: number, coinReward: number }>(
      `SELECT id, "winnerId", "voteCount", "xpReward", "coinReward"
       FROM "RecognitionResult" WHERE "categoryId" = $1::uuid`,
      [categoryId],
    )
    expect(results).toHaveLength(1)
    const result = results[0]!
    expect(result.winnerId).toBe(ids.employeeB)
    expect(result.voteCount).toBe(2)
    expect(result.xpReward).toBe(50)
    expect(result.coinReward).toBe(25)

    // Both rewards paid through the ledgers, keyed on the result.
    const coins = await query<{ amount: number, type: string, source: string }>(
      `SELECT amount, type, source FROM "CoinTransaction" WHERE "referenceId" = $1::uuid`,
      [result.id],
    )
    expect(coins).toHaveLength(1)
    expect(coins[0]).toMatchObject({ amount: 25, type: 'RECOGNITION_REWARD', source: 'RECOGNITION' })

    const xp = await query<{ amount: number, source: string }>(
      `SELECT amount, source FROM "XpTransaction" WHERE "referenceId" = $1::uuid`,
      [result.id],
    )
    expect(xp).toHaveLength(1)
    expect(xp[0]).toMatchObject({ amount: 50, source: 'RECOGNITION' })

    // The winner is notified.
    const notifications = await query<{ type: string }>(
      `SELECT type FROM "Notification" WHERE "userId" = $1::uuid AND type = 'RECOGNITION_RECEIVED'`,
      [ids.employeeB],
    )
    expect(notifications.length).toBeGreaterThanOrEqual(1)

    // Aggregated on the board: winner + count, never the underlying votes.
    const after = await board(employeeA)
    const winners = after.results.flatMap(cycle => cycle.winners)
    const mine = winners.find(winner => winner.category.name.startsWith('آزمون قدردانی'))
    expect(mine).toBeDefined()
    expect(mine!.user.fullName).toBe('پویا محمدی')
    expect(mine!.voteCount).toBe(2)
    // The board shape exposes no vote detail.
    expect(Object.keys(mine!)).not.toContain('voters')
    expect(Object.keys(mine!)).not.toContain('votes')

    // Re-finalizing pays nothing twice.
    const again = await owner.request<{ finalized: number }>('/api/recognition/finalize', { method: 'POST' })
    expect(again.status).toBe(200)

    const coinsAfter = await query<{ n: number }>(
      `SELECT count(*)::int AS n FROM "CoinTransaction" WHERE "referenceId" = $1::uuid`,
      [result.id],
    )
    const xpAfter = await query<{ n: number }>(
      `SELECT count(*)::int AS n FROM "XpTransaction" WHERE "referenceId" = $1::uuid`,
      [result.id],
    )
    expect(coinsAfter[0]!.n).toBe(1)
    expect(xpAfter[0]!.n).toBe(1)
  })
})
