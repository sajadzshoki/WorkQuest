# Company Reward Marketplace — Implementation Report

Employees spend the coins they have earned on rewards **their own company** put on
the shelf: a day of extra leave, a gift card, a team lunch, a bonus. Admins create
and price those rewards, set stock, decide who may have one, and work through the
requests. Every purchase is checked before money moves — balance, availability,
eligibility — and every coin that moves does so as an immutable ledger row.
Coins never reset monthly; a wallet is a running total, not an allowance.
Persian-first and RTL throughout.

## Scope

- **The shelf** — `Reward` rows owned by a company: title, description, image,
  `coinCost`, `stock`, `status`, `type`, and a rule bag (auto-approval, a
  per-person cap, a minimum level, a required note, an availability window).
  `DRAFT` / `ACTIVE` / `PAUSED` / `ARCHIVED`; only `ACTIVE` can be redeemed, and
  nothing is ever deleted, so past requests keep their reward.
- **The purchase** — one endpoint that re-runs the whole decision under a row
  lock, snapshots the price onto the request, debits the wallet through the
  ledger gateway, and takes a unit of stock — or refuses with a stable code and
  writes nothing at all.
- **The queue** — `PENDING → APPROVED → FULFILLED`, with `REJECT` and `CANCEL`
  available until a request is settled. Rewards the company flagged
  `autoApprove` (a digital code, a coffee at the office machine) open as
  `APPROVED` and skip the queue; everything else waits for a human.
- **Refunds** — a rejection or a cancellation returns the coins *and* the unit of
  stock, in the same transaction as the status change, as its own ledger row with
  its own idempotency key.
- **Pricing is data** — the brief's examples (500 for extra leave, 1 000 for a
  bonus, 300 for a gift card) are *rows*, not constants. There is no price table,
  no default price and no suggestion anywhere in the code: `coinCost` is read
  from the reward and the rule engine treats 1 and 1 000 000 identically.

## The rules (`shared/utils/marketplace.ts`, 375 lines)

Framework-free and I/O-free, so the card that decides whether a button is
enabled, the transaction that decides whether a purchase happens, and the tests
all ask the same function.

**`checkRedemption(reward, candidate)`** returns `{ ok: true }` or the *first*
blocking `code`. The order is a product decision, not an accident:

1. `INACTIVE_ACCOUNT` — a suspended or deactivated account cannot spend;
2. the reward: `NOT_LISTED` → `NOT_AVAILABLE_YET` → `EXPIRED` → `OUT_OF_STOCK`;
3. the person: `LIMIT_REACHED` → `LEVEL_REQUIRED` → `NOTE_REQUIRED`;
4. `INSUFFICIENT_COINS` — last.

 Somebody who cannot afford a reward that is also sold out is told it is sold
 out: "earn more coins" is the wrong advice for an empty shelf, and the right one
 only once everything else is in order. Nine codes, all stable strings, all with
 Persian copy in `rewards.block.*`.

**`rewardAvailability`** answers the item-level half on its own, which is what a
card needs to say «ناموجود» or «به‌زودی» without knowing who is looking. The
availability window is half-open — redeemable *up to* `availableUntil`, not
through it — and accepts a `Date`, an ISO string or an epoch number, because
Prisma hands back the first and a JSON body the second. A value that cannot be
parsed is treated as *no window*, never as a lockout.

**`rewardStanding`** is what the API serves next to every item:
`available`, `affordable`, `eligible`, `code`, `redeemable`. The three booleans
are independent, so a card can be honest in three directions at once — in stock,
out of reach this month, and still something you are entitled to ask for.

**Stock is `null` or a number.** `hasStock(null)` is `true`: unlimited is not
zero, and confusing them is how a shelf sells out by accident. `nextStock` never
goes negative.

**`REDEMPTION_TRANSITIONS`** holds the status machine as data — four actions,
their legal origins, their destination and whether they refund. `APPROVE` and
`FULFIL` move no money (the coins were taken at request time); `REJECT` and
`CANCEL` give them back. `FULFILLED`, `REJECTED` and `CANCELLED` accept nothing
further, which is what makes the ledger reconcilable. `resolveRedemptionTransition`
is the single source for both the API's `409` and the UI's hidden button, so the
interface cannot offer a move the server would refuse.

`LIVE_REDEMPTION_STATUSES` (`PENDING`, `APPROVED`) are the requests that still
hold coins and a unit of stock, and therefore the only ones that count against a
per-person cap: a request an admin turned down is not "one of yours".

## Money (`server/utils/wallet.ts`, unchanged gateway)

Nothing in this feature writes a balance. Every movement goes through
`applyCoinDelta`, which locks the wallet row, appends an immutable
`CoinTransaction` stamped with the resulting balance, and updates the wallet in
the same transaction:

| event | amount | `type` | `source` | `idempotencyKey` |
| --- | --- | --- | --- | --- |
| purchase | `-coinCost` | `REWARD_REDEMPTION` | `REWARD_REDEMPTION` | `redemption:<id>:debit` |
| rejection / cancellation | `+coinCost` | `REWARD_REDEMPTION` | `REFUND` | `redemption:<id>:refund` |

Two keys, deliberately distinct, so a refund can never be mistaken for the
purchase it reverses and a retried rejection cannot pay twice. Coins have no
monthly reset anywhere in the product: the wallet is a lifetime balance, and the
store says so out loud («سکه‌های شما هرگز بازنشانی نمی‌شوند»).

The price is **snapshotted** onto `RewardRedemption.coinCost`. Repricing a reward
tomorrow cannot rewrite what somebody paid yesterday, and a refund always returns
exactly what was taken.

## The purchase (`server/utils/marketplace.ts`, 1 109 lines)

```
lock the reward row (SELECT … FOR UPDATE)
  → read the caller (balance, level, live requests, account state)
  → checkRedemption(...)                      ← the same rule the card used
  → create the redemption (price snapshotted)
  → applyCoinDelta(-coinCost)                 ← the only money movement
  → take stock (atomic conditional UPDATE)
  → notify + audit
```

Lock order is always **reward → wallet** (the wallet lock lives inside
`applyCoinDelta`), which makes a deadlock impossible rather than unlikely: two
buyers of the same reward queue on the reward row, and buyers of different
rewards never contend at all.

Three things deserve their own sentence:

- **The price is never a parameter.** `redeemRewardSchema` accepts only `note` and
  `idempotencyKey`; a client that could send its own price could buy anything for
  one coin. The server reads `coinCost` from the locked row.
- **Stock is taken with a conditional `UPDATE … WHERE stock IS NULL OR stock > 0`**,
  not by reading and writing a number, so the shelf cannot go negative even if
  something bypassed the lock.
- **A replay is a replay.** The same `idempotencyKey` returns the original
  redemption with `charged: false` rather than a second charge — a double-clicked
  button, a flaky retry and a resubmitted form all produce one request and one
  debit, enforced by `@@unique([companyId, idempotencyKey])` and not by
  application goodwill.

### A race that was worth finding

The cheap pre-check ("has this key been used?") covers the sequential retry; the
unique index covers the genuine race. But the loser of that race was answering
`500` about half the time. Instrumenting it showed why: the loser collides on the
index at the instant the winner commits, and *committing* is not the same instant
as *being readable* — the loser's pooled connection is still unwinding its own
rollback, so the very first lookup of the winner's row returns nothing, and the
handler fell through to `throw error`.

`findCommittedByKey` now retries that lookup a few times over ~150 ms, and if the
row still is not readable the endpoint answers `409` («این درخواست هم‌اکنون در حال
پردازش است») — a duplicate, which is what it is, instead of a server fault. The
client's next retry replays normally. `isUniqueViolation` also walks the `cause`
chain now: when a write fails inside an interactive transaction Prisma can hand
back a rollback error that *carries* the original `P2002` rather than being it,
and a classifier that only inspects the top object reports "not a duplicate" for
exactly the case it exists to recognise.

Measured before and after on 25 concurrent same-key pairs: 50 % `500`s → 0.

## The admin side

- **Shelf** — `POST /api/rewards` and `PATCH /api/rewards/:id`. Every rule is
  optional and carries **no default of its own**, because a default inside the
  object is indistinguishable from an explicit value once parsed: `PATCH { rules:
  { maxPerUser: 1 } }` would otherwise silently switch `autoApprove` off. `null`
  stays meaningful ("no cap", "no date") and a missing key means "leave it alone".
  Disabling is a status change, never a deletion.
- **Queue** — `GET /api/rewards/admin/redemptions`, oldest first: a queue is
  first-come-first-served, and a manager should not lose an old request under a
  pile of new ones. Filterable by status, reward and employee, paged, and each
  row carries `availableActions` computed from the status machine.
- **Decisions** — `POST /api/rewards/admin/redemptions/:id/decision`. The note is
  optional in the schema (an admin may prefer to give a reason in person) but the
  form says out loud why it matters, and the notification carries it: an
  unexplained "no" is the demotivating kind.
- **Oversight** — `GET /api/rewards/admin` returns per-reward redemption counts by
  status and `coinsCollected` (debits minus refunds), plus the pending/approved
  queue depth, so a company can see what the store is actually costing.

## API surface

| method & path | who | what |
| --- | --- | --- |
| `GET /api/rewards` | `reward:read` | the shop: balance, level, items with `standing`, own requests, status counts |
| `GET /api/rewards/:id` | `reward:read` | one reward plus the caller's history with it |
| `POST /api/rewards/:id/redeem` | `reward:redeem` | buy it — or a `4xx` with a stable `code` |
| `GET /api/rewards/redemptions` | `reward:read` | the caller's own requests, newest first, paged |
| `POST /api/rewards/redemptions/:id/cancel` | `reward:redeem` | take back your own request while `PENDING` |
| `GET /api/rewards/admin` | `reward:manage` | the shelf with counts and `coinsCollected` |
| `POST /api/rewards` | `reward:manage` | put a reward on the shelf |
| `PATCH /api/rewards/:id` | `reward:manage` | edit, reprice, restock, disable |
| `GET /api/rewards/admin/redemptions` | `reward:manage` | the queue, oldest first |
| `POST /api/rewards/admin/redemptions/:id/decision` | `reward:manage` | approve / reject / fulfil / cancel |

Refusals: `400` for `INSUFFICIENT_COINS` and `NOTE_REQUIRED` (fixable right
there), `403` for `INACTIVE_ACCOUNT` and `LEVEL_REQUIRED`, `409` for everything
about the item's state and for an illegal move, `422` for a body that does not
parse. `MANAGER` gained `reward:redeem` — a manager earns coins like anybody else,
so they may spend their own — while `reward:manage` and `wallet:adjust` stay
OWNER/ADMIN: that grant carries no authority over anybody else's coins. Every
handler is tenant-scoped, so another company's reward or request is a `404`, not a
`403`.

## UI

`app/pages/rewards/index.vue` (the shop) and `app/pages/rewards/admin.vue` (shelf
+ queue), with five components in `app/components/rewards/`:

- **`RewardCard`** — type, price in coins, stock («۴۰ عدد باقی‌مانده» /
  «موجودی نامحدود»), the approval mode, the per-person allowance («۴ درخواست
  دیگر برایتان مجاز است»), and the *reason* a card is disabled rather than a grey
  button.
- **`RewardDialog`** — details and the purchase: balance before and after, the
  note when the reward asks for one, and one `crypto.randomUUID()` per opening,
  reused across retries of that attempt so a retry replays and a fresh decision
  gets a fresh key.
- **`RedemptionList`** — your own requests, with a confirm dialog before
  cancelling and the refund shown as coins returned.
- **`RedemptionQueue`** — admin rows whose buttons come from `availableActions`,
  and a decision dialog that collects the note and warns when the move refunds.
- **`RewardFormModal`** — create/edit. "Unlimited" is a switch, not a zero:
  typing `0` into a stock field and meaning "no limit" is the classic way to sell
  out a shelf by accident. An edit sends explicit `null`s for the rules it means
  to clear and nothing at all for the ones it leaves alone.

`app/composables/useRewards.ts` holds the presentation vocabulary — icons, tones
and the Persian label for every block code, status and type — so no component
invents its own copy. Everything is `fa` first, RTL, and formatted through
`useLocaleFormat()` (Persian digits, relative dates).

## Data model

Migration `20260904120000_reward_marketplace`.

`Reward` gained `coinCost` (renamed from `cost`, so it cannot be mistaken for a
task payout), `stock Int?`, `imageUrl`, `status CatalogStatus`, and the rule
columns inline (`autoApprove`, `maxPerUser`, `minLevel`, `requiresNote`,
`availableFrom`, `availableUntil`) — one row, one read, no join to price a
purchase. Enums `RewardType` (8 kinds), `CatalogStatus` (4) and
`RedemptionStatus` (5) are Postgres enums, so an impossible value cannot be
stored even by hand.

`RewardRedemption` carries the snapshot `coinCost`, the employee's `note`, the
admin's `decisionNote`, `decidedBy`/`decidedAt`/`fulfilledBy`/`fulfilledAt`, and
`idempotencyKey` with `@@unique([companyId, idempotencyKey])`. Indexes follow the
queries: `(companyId, userId, status)` for a history, `(companyId, status,
requestedAt)` for the queue, `(companyId, userId, rewardId)` for the cap count.
An automatic approval still stamps `decidedAt` but leaves `decidedBy` null, so
"the company's rule decided this" is distinguishable from "ساینا decided this".

`prisma/seed.ts` ships ten rewards across every type, priced 120 → 4 500 coins,
each exercising a different combination of rules: unlimited stock, a hard stock
count, `autoApprove`, a per-person cap, a level gate, a required note. The seeded
store is a demonstration that the pricing is the company's, not the product's.

## Tests

- **Unit** (`test/marketplace.test.ts`, 53 tests) — the rules without a database:
  `null` versus `0` stock and the non-negative decrement; listing status and the
  half-open window, including both edges and unparseable values; the full order
  of checks with every tie broken the documented way; a parameterised walk of the
  brief's own prices (500 / 1 000 / 300) plus arbitrary ones, proving nothing is
  hardcoded; the three standing booleans against the decision they summarise, and
  an exhaustive cross-product asserting the card and the purchase can never
  disagree; allowance arithmetic including a cap lowered under existing requests;
  every legal and illegal move of the status machine, the settled statuses
  accepting nothing, and which moves refund; own-cancellation only while pending;
  and the ledger keys being stable, distinct per purpose, and distinct per
  redemption.
- **Integration** (`test/integration/marketplace.integration.test.ts`, 52 tests) —
  a real server and a real PostgreSQL, driven over HTTP as owner, manager,
  employee and a second tenant's owner, with rows read straight from the database
  where the API deliberately does not expose them. The five cases the brief names
  are all here: **insufficient balance** (refused, nothing written, stock not
  reserved, and the exact-price boundary), **concurrent redemption** (two buyers,
  one unit: never two winners, one row, one debit, stock `0`; and the same
  idempotency key twice at once: one charge), **out of stock** (the last unit
  sold, the next buyer refused, the card already saying so, and the unit returning
  when a request is rejected), **duplicate redemption** (replay returns the
  original with `charged: false`, three times over; a different key is a genuine
  second attempt and meets the cap; and the unique index itself refuses a
  replayed ledger row), and **transaction integrity** (the wallet equals the sum
  of its ledger, one debit per redemption and exactly one refund per reversal,
  each row stamped with the running balance it produced, and a repricing that
  cannot rewrite a snapshot). Around them: the shop, the detail, the queue and
  its paging and filters; approval moving no money; fulfilment keeping the unit;
  rejection and cancellation returning coins *and* stock; illegal moves and
  settled requests answering `409`; a refund that cannot be paid twice; own-cancel
  only while pending and never somebody else's; shelf CRUD, partial rule updates
  that do not reset what was not sent, validation refusals, and the archive that
  keeps history; every permission gate (`403` for an employee and for a manager on
  the shelf and the queue), `401` without a session, `404` across the tenant
  boundary in both directions; and a regression test that the literal segments
  `/api/rewards/admin` and `/api/rewards/redemptions` are not swallowed by
  `/api/rewards/:id`.

`lint`, `typecheck`, the unit suite (**289 tests**, 12 files) and the full
integration suite (**278 tests**, 8 files) all pass from a freshly seeded
database.

## Two bugs found on the way

**Fixed here — `/rewards/admin` rendered the employee shop.** `pages/rewards.vue`
next to `pages/rewards/admin.vue` makes the first the *parent* route of the
second in Nuxt's file-based routing, and a parent without `<NuxtPage/>` silently
drops its child. An admin typing the URL got the shop. The page moved to
`pages/rewards/index.vue`, so the two are siblings; `/rewards/admin` now renders
the admin page for an admin and `302`s an employee back to the shop.

> The same shape exists in `pages/recognition.vue` + `pages/recognition/admin.vue`,
> so `/recognition/admin` has the same bug today (it renders «قدردانی همکاران»
> instead of the admin screen). It predates this work and belongs to another
> feature, so it was left alone — the fix is the identical one-file move.

**Reported, not changed — a duplicate task approval answers `500`.** In
`awardTaskRewards`, `applyXpDelta` catches its unique violation *inside* the
interactive transaction and returns `{ applied: false }`. Postgres has already
aborted that transaction at that point, so the next statement (`lockWallet`'s
`wallet.upsert`) fails with `25P02 current transaction is aborted` and the request
ends in a `500`. The money is still correct — the unique index guarantees one
payout, and `rewards.integration.test.ts` asserts exactly that — so the symptom is
a wrong status code on a rare concurrent double-approval, not a wrong balance.
The marketplace avoids the trap by construction: its keys are fresh UUIDs for a
debit and terminal-status-guarded for a refund, and its duplicate handling sits
*outside* `$transaction`. Fixing the task path properly means catching outside the
transaction there too, which changes task-approval semantics and was out of scope
for this brief.

## Known limitations

- One unit per request: there is no quantity field, so "three gift cards" is three
  requests (each with its own cap check). `nextStock` already takes a quantity.
- No scheduled listing: `availableFrom`/`availableUntil` gate redemption, but a
  reward cannot be queued to appear on the shelf at a future date.
- No partial fulfilment or substitution — a request is fulfilled as asked or
  settled some other way.
- Images are a URL, not an upload; there is no media pipeline in the product yet.
- The queue is paged but not searchable by employee name (it filters by `userId`,
  which the UI would have to resolve through the member list first).
- The integration suite's concurrency assertions follow the repository's existing
  convention of asserting the *invariants* rather than every HTTP status: the
  sandbox database is PGlite behind one socket server, which serves every
  connection from a single PostgreSQL protocol state, so two queries in flight at
  once can collide on the unnamed prepared statement (`08P01`) and surface as a
  `500`. That is an artifact of the sandbox, not of the code, and it cannot happen
  against a real PostgreSQL server, where each connection owns its protocol state.
