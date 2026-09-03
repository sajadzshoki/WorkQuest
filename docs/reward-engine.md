# Performance & Reward Engine — Implementation Report

Phase 2: task review scoring, a centralized reward calculation service, XP/level
progression, a transactional coin wallet, and the Persian-first RTL UI for both.

## The central constraint

> Managers must not be able to arbitrarily manipulate employee coins.

This is enforced structurally rather than by policy:

- **There is no endpoint that sets a balance.** The only way a number changes is
  `applyCoinDelta`, which appends an immutable `CoinTransaction` and moves the
  wallet in the same database transaction.
- **Managers cannot adjust balances at all.** `POST /api/wallet/adjust` requires
  the `wallet:adjust` permission, which only OWNER/ADMIN hold. A manager
  attempting it gets 403 — covered by a test.
- **Managers cannot tune the economy.** `PUT /api/rewards/rules` requires
  `reward:manage`, also OWNER/ADMIN only.
- **What a manager *can* do is score a task**, and the score is then priced by
  the backend. They choose a number from 0-100; they do not choose a payout.
- **Timing is not a matter of opinion.** On-time/early/overdue is derived from
  `dueDate` vs `submittedAt`, so a manager cannot mark a late task "on time" to
  inflate a reward. The reviewer's timeliness sub-score is recorded for
  reporting and is deliberately *not* an input to the payout.

Even the one manual lever (admin adjustment) is an ordinary ledger row: bounded
in size, requiring a written reason, attributed to an actor, visible in the
employee's own statement, and recorded in the audit log.

## XP and coins are separate systems

| | XP | Coins |
| --- | --- | --- |
| Purpose | progression / levels | spendable company currency |
| Direction | increases only | credited and debited |
| Storage | `UserProgress.xp` + `XpTransaction` | `Wallet` + `CoinTransaction` |
| Can go negative | never | never (asserted under a row lock) |

They share one multiplier — the same performance earned both — but have
independent base amounts, so a task can be worth a lot of XP and few coins.
`applyXpDelta` has no negative path at all; XP is permanent by construction.

## Reward calculation service

All of it lives in `shared/utils/rewards.ts` — pure, dependency-free, no I/O.
The same `calculateReward` function runs in three places: the payout, the
manager's live preview, and the tests. **No Vue component performs reward
arithmetic**; the review modal calls `POST /api/rewards/preview` and renders
what the server returns, which is why a preview can never disagree with the
payout that follows.

Order of operations (chosen so results are explainable):

1. start from the score-band multiplier — 90-100 → 100%, 80-89 → 80%,
   70-79 → 60%, below 70 → 30%;
2. add bonuses and subtract penalties, all **additive** in basis points rather
   than compounding — compounding gets surprising fast and this has to be
   defensible to an employee who feels short-changed;
3. clamp to `[minMultiplierBp, maxMultiplierBp]`;
4. apply the priority weight to the base (LOW 0.8× / MEDIUM 1.0× / HIGH 1.3×);
5. round once, at the end.

Bonuses: on time (+10%), early (+20%), high quality (+15%).
Penalties: overdue (−25%), per revision round (−10%, capped at −50%).

Early implies on-time, so the larger of the two is awarded rather than both —
finishing early is never worth less than finishing merely on time.

All rates are **integers in basis points** (10000 = 1.0×). Money-like values and
floats are a bad pair; integer arithmetic end-to-end means the ledger always
reconciles exactly.

### Configurable, versioned, not hardcoded

The economy is a `RewardRule` row per company, not a constant in code. Saving
new values **creates a new version and flips `isActive`** rather than mutating
the old row, because editing in place would silently rewrite the meaning of
every historical payout. Each review freezes its `RewardBreakdown` and
`ruleVersion`, so a payout from three months ago stays explainable after the
rules change.

## Level progression

One formula, in `shared/utils/xp.ts`:

```
minXp(n) = 500·(n−1) + 100·(n−1)·(n−2)
→ L1 0, L2 500, L3 1200, L4 2100, L5 3200 …
```

Each level costs 200 XP more than the last: early levels arrive quickly, later
ones demand sustained output. The seeded ladder (`DEFAULT_LEVELS`) is *derived*
from this function rather than written out by hand, so a seeded company and the
no-ladder fallback cannot disagree about what level 3 costs. Companies can
override it with explicit `Level` rows.

## Anti-fraud: idempotent payouts

A task pays out **at most once, ever**.

The idempotency key is `task:<taskId>:reward` — derived from the task, not the
review — so a second approval, a double-clicked button, a retried request or two
reviewers racing all collide on the same key. A unique index on
`(companyId, idempotencyKey)` rejects the duplicate. **The guarantee is the
database's, not the application's**: an application-level "have we already done
this?" check loses to concurrency.

A test fires five simultaneous approvals at one task and asserts exactly one
ledger row results. Another asserts that every wallet balance equals the sum of
its own ledger.

Spends additionally take `SELECT … FOR UPDATE` on the wallet, because two
concurrent purchases that both read a balance of 100 would each approve an
80-coin spend.

## Data model

- **`Wallet`** — balance, lifetime earned/spent. A cache of the ledger, never an
  independent truth.
- **`CoinTransaction`** — signed amount, `CoinTransactionType`
  (`TASK_REWARD`, `RECOGNITION_REWARD`, `CHALLENGE_REWARD`,
  `REWARD_REDEMPTION`, `ADMIN_ADJUSTMENT`), running `balanceAfter`, and
  `idempotencyKey`.
- **`XpTransaction`** — gained the same idempotency guarantee.
- **`RewardRule`** — the versioned economy.
- **`TaskReview`** — gained `qualityScore` (1-5), `timelinessScore` (1-5) and
  the frozen `rewardBreakdown`.

The migration backfills a wallet for every existing user from the old
`UserProgress.coins`, links historical coin rows to it and classifies them, so
no balance appears to reset. All new models are registered in `TENANT_MODELS`.

## API

| Endpoint | Purpose |
| --- | --- |
| `GET /api/wallet` | own XP, level, balance, recent ledger |
| `GET /api/wallet/transactions` | own paged statement, filterable by type |
| `POST /api/wallet/adjust` | OWNER/ADMIN manual adjustment, reason required |
| `POST /api/rewards/preview` | what a score would pay (writes nothing) |
| `GET /api/rewards/rules` | the active economy (readable by all) |
| `PUT /api/rewards/rules` | publish a new version (OWNER/ADMIN) |

Wallet reads are **self-scoped** — there is no `userId` parameter, so one
employee cannot read another's wallet. Approving now **requires a score**: an
approval without one is refused rather than silently paying zero or full.

## UI

- **`GamificationProgressCard`** — level ring, XP progress, coin balance,
  streak, lifetime totals and recent transactions.
- **`/wallet`** — the full paged statement with running balances and a type
  filter.
- **`TaskReviewModal`** — 1-5 quality and timeliness pickers, a 0-100 score
  slider, and a live preview showing XP, coins, the final multiplier and an
  **itemised breakdown of every bonus and penalty**, so the manager sees why
  the number is what it is before committing.

RTL throughout via CSS logical properties; all figures render in Persian digits.

## Verification

| Gate | Result |
| --- | --- |
| `npm run lint` | clean |
| `npm run typecheck` | clean |
| `npm test` | **168 passed** (8 files) |
| `npm run test:integration` | **176 passed** (4 files) |
| `npm run build` | success — 13.8 MB (3.7 MB gzip) |

Coverage of the requested areas: 35 unit cases on reward calculation alone
(every band boundary, each bonus/penalty in isolation and combined, monotonicity,
clamping, NaN/negative/over-range scores, punitive and over-generous rule sets),
plus 41 integration cases covering duplicate approval, concurrent approval,
duplicate reward prevention, invalid scores, authorization, tenant isolation,
manual adjustment limits, preview/payout agreement, and rule versioning.

Verified live against seeded data: previewing a HIGH-priority task at score 95
with quality 5 quotes 176 XP / 88 coins (1.3 priority × 1.35 multiplier);
approving pays exactly that; a second approval returns 409; the wallet reads
348 coins with a matching `balanceAfter`.

## Notable findings

1. **A missing `await` on an authorization check.** `canManageTask` is async,
   and `if (!canManageTask(...))` tested a Promise — always truthy, so the
   guard never fired and any employee could preview their own task's payout.
   The integration test caught it (`expected 200 to be 403`).
2. **The seeded level ladder disagreed with the curve** (L3 at 1500 vs 1200).
   Now derived from `defaultMinXp` so the two cannot drift.
3. **`coinReward: 0` means "unset", not "zero coins"**, since 0 is the column
   default and falls back to the company base. Worth knowing when authoring a
   task that genuinely should pay no coins — that needs a company base of 0 or
   an explicit future `noReward` flag.
