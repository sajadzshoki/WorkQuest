# In-App Notifications — Implementation Report

Phase 7: a complete in-app notification system — a persistent per-user feed
with a fourteen-event catalogue, a single service every event flows through,
at-most-once delivery for retried events, and a channel seam ready for email,
SMS and push. Persian-first and RTL throughout.

## Scope

- **Catalogue** — one type per product event: task assigned / submitted /
  approved / needs revision, coins earned, achievement unlocked, level up,
  recognition received / winner, challenge started / completed, reward
  redeemed / approved / rejected. Two internal catch-alls — `INVITATION` and
  `SYSTEM` (an accepted invitation, a comment on a task, a cancelled
  challenge, administrative debits) — keep the catalogue honest instead of
  stretching a product type to mean something it does not.
- **Model** — `Notification` carries `id`, `userId`, `type`, `title`,
  `message`, `metadata`, `readAt`, `createdAt` (plus `companyId`: a
  notification belongs to exactly one company and one user, and the
  tenant-scoped client makes every read and write prove it).
  `readAt` is the single read state — null means unread — and `dedupeKey`
  makes delivery at-most-once.
- **UI** — a bell in the topbar with a live unread badge and a dropdown of
  the eight latest notifications (click to read, mark-all, view-all), and a
  full `/notifications` page with unread-first ordering, per-row
  «خواندم», «خواندن همه», pagination and empty states.
- **Future ready** — `server/utils/notifications.ts` exposes a
  `NotificationChannel` interface (`key`, `isConfigured()`, `deliver()`).
  Email, SMS and push placeholders register at boot via a Nitro plugin and
  activate only when the environment configures them
  (`NUXT_NOTIFICATION_EMAIL_DSN` / `…SMS_DSN` / `…PUSH_DSN`). None is
  configured in this deployment, by design — an unconfigured provider is
  never called, and a failing channel can never break the request that
  produced the notification.

## The service (`server/utils/notifications.ts`)

Three rules enforced once, at the door, rather than at every call site:

1. **No self-notifications.** Callers pass `actorId`; the actor's own row is
   skipped. Nobody gets a bell for a button they just pressed.
2. **At-most-once for retried events.** An event that can retry carries a
   `dedupeKey` (e.g. `challenge:<id>:reward`, `levelup:<userId>:<level>`); the
   unique `(companyId, userId, dedupeKey)` index — not application logic —
   turns the retry into a no-op, exactly like the reward ledgers'
   idempotency keys. Events that are legitimately repeatable (a task
   assignment, a nomination) carry no key.
3. **Fan-out is a seam.** The in-app row *is* the delivery here; external
   channels are handed the persisted row after the write, fire-and-forget,
   with errors logged and swallowed.

`notify`, `notifyMany` and `notifyRoles` all run inside the caller's
transaction: a notification is part of the event that caused it and rolls
back with it.

## Where each type fires

| Type | Event |
| --- | --- |
| `TASK_ASSIGNED` | task created or reassigned → the new assignee |
| `TASK_SUBMITTED` | submit → the assigner/reviewer |
| `TASK_APPROVED` | approve → the assignee (reward noted in the message) |
| `TASK_NEEDS_REVISION` | request revision → the assignee |
| `COINS_EARNED` | an admin wallet credit — the one coin movement that arrives with no event of its own |
| `ACHIEVEMENT_UNLOCKED` | the gamification pass unlocks an achievement |
| `LEVEL_UP` | `syncLevel` crosses a level boundary — the single place every payout path funnels through, deduped per level |
| `RECOGNITION_RECEIVED` | a coworker nominates you (the tally stays sealed) |
| `RECOGNITION_WINNER` | cycle finalization declares you the winner, deduped per result |
| `CHALLENGE_STARTED` | activation enrols the roster (one row each, one dedupe key) |
| `CHALLENGE_COMPLETED` | the engine pays a participant, deduped per challenge |
| `REWARD_REDEEMED` | a *pending* redemption lands on the OWNER/ADMIN desk |
| `REWARD_APPROVED` | auto-approval or an admin approves the request |
| `REWARD_REJECTED` | an admin rejects the request (refund noted in metadata) |
| `INVITATION` | an invited person accepts and joins |
| `SYSTEM` | comments on a task, challenge cancellation, coin debits |

## API

- `GET /api/notifications` — the caller's feed, unread first, then newest;
  paginated; returns `total` and `unread`.
- `GET /api/notifications/summary` — `{ unread }`; the bell's cheap poll
  (one count, never a page of rows).
- `POST /api/notifications/:id/read` — marks one row read. A foreign id
  (another user's, another company's) is a 404, not a leak; re-marking is a
  200 with the same `readAt`.
- `POST /api/notifications/read-all` — flips every unread row of the caller
  and returns the honest count.

## Migration notes (`20260905130000_notifications`)

- `body` → `message`, `data` → `metadata` (the product contract's names).
- `status` dropped; `readAt` (backfilled from the old status) is the one
  read state. The status index went with the column.
- The enum was rebuilt with the new catalogue. Legacy rows were *mapped*,
  not dropped: `TASK_REVIEWED` split into `TASK_APPROVED` (reviews) and
  `SYSTEM` (the «یادداشت جدید روی تسک» comment notices), `CHALLENGE_UPDATE`
  became `CHALLENGE_STARTED`, `REDEMPTION_UPDATE` became `REWARD_APPROVED`,
  and the never-written `REWARD_AVAILABLE` / `TEAM_UPDATE` degrade to
  `SYSTEM`.

## Tests

- **Unit** (`test/notifications.test.ts`, 13 tests) — the catalogue's
  integrity (icons, tones, exactly fourteen product types); creation and
  field mapping; self-suppression; dedupe for one user and independence
  across users; `notifyMany` minus-the-actor fan-out; `notifyRoles`;
  channel registration, delivery payload, and a failing channel not breaking
  the write.
- **Integration** (`test/integration/notifications.integration.test.ts`,
  7 tests) — over the real API: creation through the task lifecycle with
  payload asserts and actor suppression; authorization (a colleague cannot
  mark another user's notification, an anonymous call is a 401; the
  cross-tenant guarantee is the tenant-scoped client that
  `auth.integration` already proves for this endpoint); read state (one
  flip per click, idempotent re-click, honest zero after read-all, the
  badge counts again on the next event); duplicates (a challenge announces
  start and completion exactly once per person across three engine re-runs).

## Known couplings

- The suite shares one database and 90-second OTP cooldowns; the
  notifications integration file therefore logs in only as fixtures no other
  file touches (بهنام, ترانه) and deletes every row it creates in `afterAll`.
- The seeded demo challenge «ده تسک بی‌نقص» (10 approved tasks) sits close to
  the total approvals some integration files give نگار; new suites that
  approve more than a couple of tasks for her should use a different user.
