import { describe, expect, it } from 'vitest'

import {
  balanceAfterRedemption,
  canCancelOwnRedemption,
  canTransitionRedemption,
  CATALOG_STATUSES,
  checkRedemption,
  hasStock,
  initialRedemptionStatus,
  isLiveRedemption,
  isTerminalRedemption,
  LIVE_REDEMPTION_STATUSES,
  nextStock,
  REDEEM_BLOCK_CODES,
  REDEMPTION_ACTIONS,
  REDEMPTION_STATUSES,
  REDEMPTION_TRANSITIONS,
  remainingAllowance,
  resolveRedemptionTransition,
  rewardAvailability,
  rewardStanding,
  REWARD_TYPES,
  refundsCoins,
  TERMINAL_REDEMPTION_STATUSES,
  type RedeemCandidate,
  type RewardPolicy,
} from '#shared/utils/marketplace'
import { redemptionKey, redemptionRefundKey } from '#shared/utils/rewards'

/**
 * Reward-marketplace rules, without a database.
 *
 * The marketplace makes five promises, and each one is a rule in the pure module
 * rather than something an endpoint happens to do:
 *
 *  1. **Prices are data, not code** — the company decides what a reward costs;
 *     the rule engine treats 300 and 3 000 identically;
 *  2. **Everything is checked before money moves** — the account, then the
 *     reward (listing, window, stock), then the person (cap, level, note), then
 *     their coins, always in that order, so the answer is the *first* thing
 *     standing in the way;
 *  3. **Stock is null-or-a-number** — `null` means unlimited and is never
 *     mistaken for zero, and a stock count never goes negative;
 *  4. **The status machine is closed** — only the listed moves are legal, the
 *     settled statuses accept nothing, and the machine itself says which moves
 *     give the coins back;
 *  5. **A repeated request replays instead of charging twice** — the ledger keys
 *     that make that possible are stable, and the debit and the refund cannot be
 *     confused for one another.
 */

const policy = (overrides: Partial<RewardPolicy> = {}): RewardPolicy => ({
  coinCost: 500,
  status: 'ACTIVE',
  stock: 5,
  autoApprove: false,
  maxPerUser: null,
  minLevel: null,
  requiresNote: false,
  availableFrom: null,
  availableUntil: null,
  ...overrides,
})

const candidate = (overrides: Partial<RedeemCandidate> = {}): RedeemCandidate => ({
  balance: 5_000,
  level: 5,
  liveRedemptions: 0,
  accountActive: true,
  note: null,
  now: new Date('2026-09-04T09:00:00.000Z'),
  ...overrides,
})

const AT = new Date('2026-09-04T09:00:00.000Z')

describe('stock semantics', () => {
  it('reads null as unlimited rather than as zero', () => {
    expect(hasStock(null)).toBe(true)
    expect(hasStock(1)).toBe(true)
    expect(hasStock(0)).toBe(false)
    expect(hasStock(-3)).toBe(false)
  })

  it('never decrements below zero, and leaves unlimited stock alone', () => {
    expect(nextStock(5, 1)).toBe(4)
    expect(nextStock(1, 1)).toBe(0)
    expect(nextStock(0, 1)).toBe(0)
    expect(nextStock(null, 3)).toBeNull()
  })

  it('reports an empty shelf before anything else about the reward', () => {
    const result = checkRedemption(policy({ stock: 0 }), candidate())
    expect(result.ok).toBe(false)
    expect(result.ok === false && result.code).toBe('OUT_OF_STOCK')
  })
})

describe('availability', () => {
  it.each(['DRAFT', 'PAUSED', 'ARCHIVED'] as const)('treats a %s reward as not listed', (status) => {
    expect(rewardAvailability(policy({ status }), AT)).toEqual({ available: false, code: 'NOT_LISTED' })
  })

  it('accepts an ACTIVE reward inside its window', () => {
    expect(rewardAvailability(policy(), AT)).toEqual({ available: true, code: null })
    expect(checkRedemption(policy(), candidate()).ok).toBe(true)
  })

  it('honours the window, including its half-open edges', () => {
    expect(rewardAvailability(policy({ availableFrom: new Date(AT.getTime() + 1_000) }), AT).code)
      .toBe('NOT_AVAILABLE_YET')
    // Opening *at* the instant is open.
    expect(rewardAvailability(policy({ availableFrom: AT }), AT).available).toBe(true)
    expect(rewardAvailability(policy({ availableUntil: new Date(AT.getTime() - 1_000) }), AT).code)
      .toBe('EXPIRED')
    // Closing *at* the instant is closed — redeemable up to it, not through it.
    expect(rewardAvailability(policy({ availableUntil: AT }), AT).code).toBe('EXPIRED')
  })

  it('reads the window from whatever the database hands back', () => {
    // Prisma gives Dates, a JSON body gives strings; both must mean the same.
    expect(rewardAvailability(policy({ availableUntil: '2026-09-04T08:00:00.000Z' }), AT).code).toBe('EXPIRED')
    expect(rewardAvailability(policy({ availableUntil: AT.getTime() }), AT).code).toBe('EXPIRED')
    // A value that cannot be read is not a window at all, so it cannot lock
    // somebody out of a reward they can afford.
    expect(rewardAvailability(policy({ availableUntil: 'not-a-date' }), AT).available).toBe(true)
  })

  it('names the shelf states and the kinds of reward it knows', () => {
    expect(CATALOG_STATUSES).toEqual(['DRAFT', 'ACTIVE', 'PAUSED', 'ARCHIVED'])
    expect(REWARD_TYPES).toEqual([
      'PHYSICAL', 'VOUCHER', 'TIME_OFF', 'DONATION', 'MEAL', 'TICKET', 'BONUS', 'CUSTOM',
    ])
  })
})

describe('the order of checks', () => {
  it('answers with the first thing standing in the way, not the last', () => {
    // Paused *and* sold out *and* unaffordable: the listing wins, because that
    // is the reason the employee cannot act on it at all.
    const result = checkRedemption(
      policy({ status: 'PAUSED', stock: 0, coinCost: 90_000 }),
      candidate({ balance: 10 }),
    )
    expect(result.ok).toBe(false)
    expect(result.ok === false && result.code).toBe('NOT_LISTED')
  })

  it('puts the reward before the person', () => {
    // Sold out *and* over the personal cap: the shelf is the reward's own state.
    const result = checkRedemption(
      policy({ stock: 0, maxPerUser: 1 }),
      candidate({ liveRedemptions: 1 }),
    )
    expect(result.ok === false && result.code).toBe('OUT_OF_STOCK')
  })

  it('puts the person before their money', () => {
    // Level-gated *and* unaffordable: the level is the reason to come back
    // later; "earn more coins" is not.
    const result = checkRedemption(policy({ minLevel: 5 }), candidate({ level: 2, balance: 0 }))
    expect(result.ok === false && result.code).toBe('LEVEL_REQUIRED')
  })

  it('asks for the cap before the level, and for the note before the coins', () => {
    expect(checkRedemption(
      policy({ maxPerUser: 1, minLevel: 9, requiresNote: true }),
      candidate({ liveRedemptions: 1, level: 1, note: null, balance: 0 }),
    )).toEqual({ ok: false, code: 'LIMIT_REACHED' })

    expect(checkRedemption(
      policy({ minLevel: 9, requiresNote: true }),
      candidate({ level: 1, note: null, balance: 0 }),
    )).toEqual({ ok: false, code: 'LEVEL_REQUIRED' })

    expect(checkRedemption(
      policy({ requiresNote: true }),
      candidate({ note: null, balance: 0 }),
    )).toEqual({ ok: false, code: 'NOTE_REQUIRED' })
  })

  it('checks the balance last, and only when everything else passes', () => {
    expect(checkRedemption(policy({ coinCost: 500 }), candidate({ balance: 499 })))
      .toEqual({ ok: false, code: 'INSUFFICIENT_COINS' })
    expect(checkRedemption(policy({ coinCost: 500 }), candidate({ balance: 500 })).ok).toBe(true)
  })

  it('refuses a suspended or deactivated account before anything else', () => {
    // Even for a free, unlimited, listed reward: the account is the gate.
    const result = checkRedemption(policy({ coinCost: 0, stock: null }), candidate({ accountActive: false }))
    expect(result).toEqual({ ok: false, code: 'INACTIVE_ACCOUNT' })
  })

  it('counts the personal cap against live requests only', () => {
    const capped = policy({ maxPerUser: 2 })
    expect(checkRedemption(capped, candidate({ liveRedemptions: 1 })).ok).toBe(true)
    expect(checkRedemption(capped, candidate({ liveRedemptions: 2 }))).toEqual({ ok: false, code: 'LIMIT_REACHED' })
    expect(checkRedemption(capped, candidate({ liveRedemptions: 5 }))).toEqual({ ok: false, code: 'LIMIT_REACHED' })
  })

  it('treats an uncapped reward as unlimited per person', () => {
    expect(checkRedemption(policy({ maxPerUser: null }), candidate({ liveRedemptions: 40 })).ok).toBe(true)
  })

  it('accepts a note that says something and refuses one that does not', () => {
    const noted = policy({ requiresNote: true })
    expect(checkRedemption(noted, candidate({ note: 'برای خیریهٔ محک' })).ok).toBe(true)
    expect(checkRedemption(noted, candidate({ note: '   ' }))).toEqual({ ok: false, code: 'NOTE_REQUIRED' })
    expect(checkRedemption(noted, candidate({ note: undefined }))).toEqual({ ok: false, code: 'NOTE_REQUIRED' })
    // A reward that asks for nothing accepts nothing written.
    expect(checkRedemption(policy({ requiresNote: false }), candidate({ note: null })).ok).toBe(true)
  })

  it('keeps every block code the interface has copy for', () => {
    expect(REDEEM_BLOCK_CODES).toEqual([
      'INACTIVE_ACCOUNT',
      'NOT_LISTED',
      'NOT_AVAILABLE_YET',
      'EXPIRED',
      'OUT_OF_STOCK',
      'LIMIT_REACHED',
      'LEVEL_REQUIRED',
      'NOTE_REQUIRED',
      'INSUFFICIENT_COINS',
    ])
  })
})

describe('prices are the company’s data, never a table in the code', () => {
  // The brief's own examples — 500 for extra leave, 1 000 for a bonus, 300 for
  // a gift card — plus numbers nobody anticipated. The engine must decide each
  // the same way, because it only ever reads `policy.coinCost`.
  it.each([
    ['extra leave', 500, 500, true],
    ['extra leave', 500, 499, false],
    ['bonus', 1_000, 1_000, true],
    ['bonus', 1_000, 999, false],
    ['gift card', 300, 300, true],
    ['an arbitrary price', 4_271, 4_271, true],
    ['an arbitrary price', 4_271, 4_270, false],
    ['one coin', 1, 1, true],
    ['a free reward', 0, 0, true],
  ])('decides %s costing %i against a balance of %i as redeemable=%s', (_label, coinCost, balance, ok) => {
    expect(checkRedemption(policy({ coinCost }), candidate({ balance })).ok).toBe(ok)
  })

  it('never lets a purchase drive the balance negative', () => {
    expect(balanceAfterRedemption(500, 500)).toBe(0)
    expect(balanceAfterRedemption(480, 500)).toBe(0)
    expect(balanceAfterRedemption(260, 120)).toBe(140)
  })
})

describe('the standing shown next to a reward', () => {
  it('separates availability, affordability and eligibility', () => {
    expect(rewardStanding(policy({ coinCost: 500 }), candidate({ balance: 260 }))).toEqual({
      available: true,
      affordable: false,
      eligible: true,
      code: 'INSUFFICIENT_COINS',
      redeemable: false,
    })
  })

  it('reports a sold-out reward as available=false while the person stays eligible', () => {
    expect(rewardStanding(policy({ stock: 0 }), candidate({ balance: 50_000 }))).toEqual({
      available: false,
      affordable: true,
      eligible: true,
      code: 'OUT_OF_STOCK',
      redeemable: false,
    })
  })

  it('marks the person ineligible when the block is about them', () => {
    expect(rewardStanding(policy({ minLevel: 9 }), candidate({ level: 2, balance: 0 }))).toEqual({
      available: true,
      affordable: false,
      eligible: false,
      code: 'LEVEL_REQUIRED',
      redeemable: false,
    })
    expect(rewardStanding(policy({ maxPerUser: 1 }), candidate({ liveRedemptions: 1 })).eligible).toBe(false)
    expect(rewardStanding(policy({ requiresNote: true }), candidate({ note: null })).eligible).toBe(false)
    expect(rewardStanding(policy(), candidate({ accountActive: false })).eligible).toBe(false)
  })

  it('marks a reward that can be taken right now as redeemable, with no code', () => {
    expect(rewardStanding(policy({ coinCost: 120 }), candidate({ balance: 260 }))).toEqual({
      available: true,
      affordable: true,
      eligible: true,
      code: null,
      redeemable: true,
    })
  })

  it('agrees with the decision the purchase would make, in every combination', () => {
    // The card and the API are one rule; this walks the space to prove it.
    const rewards = [
      policy(),
      policy({ status: 'DRAFT' }),
      policy({ stock: 0 }),
      policy({ coinCost: 9_000 }),
      policy({ minLevel: 9 }),
      policy({ maxPerUser: 1 }),
      policy({ requiresNote: true }),
      policy({ availableUntil: new Date(AT.getTime() - 1) }),
    ]
    const candidates = [
      candidate(),
      candidate({ balance: 0 }),
      candidate({ level: 1 }),
      candidate({ liveRedemptions: 3 }),
      candidate({ note: 'چیزی' }),
      candidate({ accountActive: false }),
    ]

    for (const reward of rewards) {
      for (const person of candidates) {
        const standing = rewardStanding(reward, person)
        expect(standing.redeemable).toBe(checkRedemption(reward, person).ok)
        expect(standing.code === null).toBe(standing.redeemable)
      }
    }
  })
})

describe('allowances', () => {
  it('counts down from the cap over live requests', () => {
    expect(remainingAllowance(3, 0)).toBe(3)
    expect(remainingAllowance(3, 1)).toBe(2)
    expect(remainingAllowance(3, 3)).toBe(0)
  })

  it('reports no limit when the company set none', () => {
    expect(remainingAllowance(null, 7)).toBeNull()
  })

  it('never goes negative if a cap is lowered under existing requests', () => {
    expect(remainingAllowance(1, 4)).toBe(0)
  })
})

describe('the redemption status machine', () => {
  it('knows exactly the five statuses the product speaks of', () => {
    expect(REDEMPTION_STATUSES).toEqual(['PENDING', 'APPROVED', 'REJECTED', 'FULFILLED', 'CANCELLED'])
    expect(TERMINAL_REDEMPTION_STATUSES).toEqual(['FULFILLED', 'REJECTED', 'CANCELLED'])
  })

  it('opens a manual request as pending and an auto-approved one as approved', () => {
    expect(initialRedemptionStatus({ autoApprove: false })).toBe('PENDING')
    expect(initialRedemptionStatus({ autoApprove: true })).toBe('APPROVED')
  })

  it('holds every legal move as data, not as branches in a handler', () => {
    expect(REDEMPTION_ACTIONS).toEqual(['APPROVE', 'REJECT', 'FULFIL', 'CANCEL'])
    expect(REDEMPTION_TRANSITIONS).toEqual({
      APPROVE: { from: ['PENDING'], to: 'APPROVED', refunds: false },
      REJECT: { from: ['PENDING', 'APPROVED'], to: 'REJECTED', refunds: true },
      FULFIL: { from: ['APPROVED'], to: 'FULFILLED', refunds: false },
      CANCEL: { from: ['PENDING', 'APPROVED'], to: 'CANCELLED', refunds: true },
    })
    // Every move lands on a status the product actually has.
    for (const action of REDEMPTION_ACTIONS) {
      expect(REDEMPTION_STATUSES).toContain(REDEMPTION_TRANSITIONS[action].to)
    }
    expect(resolveRedemptionTransition('PENDING', 'APPROVE')).toEqual({ ok: true, to: 'APPROVED', refunds: false })
    expect(resolveRedemptionTransition('PENDING', 'REJECT')).toEqual({ ok: true, to: 'REJECTED', refunds: true })
    expect(resolveRedemptionTransition('PENDING', 'CANCEL')).toEqual({ ok: true, to: 'CANCELLED', refunds: true })
    // An approved request can still be turned down before it is handed over.
    expect(resolveRedemptionTransition('APPROVED', 'REJECT')).toEqual({ ok: true, to: 'REJECTED', refunds: true })
    expect(resolveRedemptionTransition('APPROVED', 'CANCEL')).toEqual({ ok: true, to: 'CANCELLED', refunds: true })
    expect(resolveRedemptionTransition('APPROVED', 'FULFIL')).toEqual({ ok: true, to: 'FULFILLED', refunds: false })
  })

  it('refuses to skip a step: nothing is fulfilled before it is approved', () => {
    expect(resolveRedemptionTransition('PENDING', 'FULFIL')).toEqual({ ok: false, code: 'ILLEGAL_TRANSITION' })
    expect(canTransitionRedemption('PENDING', 'FULFIL')).toBe(false)
  })

  it('refuses an action it has never heard of', () => {
    expect(resolveRedemptionTransition('PENDING', 'SHIP_IT')).toEqual({ ok: false, code: 'UNKNOWN_ACTION' })
    expect(canTransitionRedemption('PENDING', 'SHIP_IT')).toBe(false)
  })

  it('accepts nothing once a request is settled', () => {
    for (const status of TERMINAL_REDEMPTION_STATUSES) {
      for (const action of REDEMPTION_ACTIONS) {
        expect(resolveRedemptionTransition(status, action).ok).toBe(false)
        expect(canTransitionRedemption(status, action)).toBe(false)
      }
      expect(isTerminalRedemption(status)).toBe(true)
    }
  })

  it('says which moves give the coins back — the ones that do not deliver', () => {
    const refunding = REDEMPTION_ACTIONS.filter(action => refundsCoins(action))
    expect(refunding).toEqual(['REJECT', 'CANCEL'])
    expect(refundsCoins('APPROVE')).toBe(false)
    expect(refundsCoins('FULFIL')).toBe(false)
    expect(refundsCoins('MADE_UP')).toBe(false)
  })

  it('counts a pending or approved request as still holding coins and stock', () => {
    expect(LIVE_REDEMPTION_STATUSES).toEqual(['PENDING', 'APPROVED'])
    expect(isLiveRedemption('PENDING')).toBe(true)
    expect(isLiveRedemption('APPROVED')).toBe(true)
    expect(isLiveRedemption('REJECTED')).toBe(false)
    expect(isLiveRedemption('CANCELLED')).toBe(false)
    // Live and settled are complementary, never overlapping.
    for (const status of REDEMPTION_STATUSES) {
      expect(isLiveRedemption(status) || isTerminalRedemption(status)).toBe(true)
      expect(isLiveRedemption(status) && isTerminalRedemption(status)).toBe(false)
    }
  })
})

describe('cancelling your own request', () => {
  it('is allowed while the request is still pending', () => {
    expect(canCancelOwnRedemption('PENDING')).toBe(true)
  })

  it.each(['APPROVED', 'REJECTED', 'FULFILLED', 'CANCELLED'] as const)(
    'is refused once the request is %s — that call belongs to the company',
    (status) => {
      expect(canCancelOwnRedemption(status)).toBe(false)
    },
  )
})

describe('ledger keys', () => {
  it('is stable per redemption and per purpose', () => {
    expect(redemptionKey('r1')).toBe('redemption:r1:debit')
    expect(redemptionKey('r1')).toBe(redemptionKey('r1'))
    expect(redemptionRefundKey('r1')).toBe('redemption:r1:refund')
  })

  it('keeps the debit and the refund apart, so one cannot mask the other', () => {
    expect(redemptionKey('r1')).not.toBe(redemptionRefundKey('r1'))
    expect(redemptionKey('r1')).not.toBe(redemptionKey('r2'))
    expect(redemptionRefundKey('r1')).not.toBe(redemptionRefundKey('r2'))
  })
})
