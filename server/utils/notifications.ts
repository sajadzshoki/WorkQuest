/**
 * The notification service — the only door a notification goes through.
 *
 * Three rules, enforced here rather than at the (many) call sites:
 *
 *  1. **No self-notifications.** Pass `actorId` and the actor's own row is
 *     skipped: nobody needs a bell for a button they just pressed.
 *  2. **At-most-once for retried events.** Give an event a `dedupeKey`
 *     (e.g. `challenge:<id>:reward`) and the unique
 *     `(companyId, userId, dedupeKey)` index — not application logic — makes
 *     the retry a no-op, exactly like the reward ledgers' idempotency keys.
 *  3. **Fan-out is a seam, not a promise.** The in-app row *is* the delivery
 *     for this deployment. External channels (email, SMS, push) plug into
 *     `dispatchToChannels` and are only active when configured — none are
 *     today, and an inactive channel can never break a domain transaction.
 *
 * Everything runs inside the caller's transaction: a notification is part of
 * the event that caused it, and rolls back with it.
 */

import type { Prisma } from '#prisma/client'
import type { Role } from '#shared/utils/permissions'
import type { NotificationType } from '#shared/utils/notifications'

import type { TenantDb, TenantTx } from './tasks'

/** Either shape the call sites hold — a tenant client or an open transaction. */
export type NotificationClient = TenantDb | TenantTx | Prisma.TransactionClient

// ---------------------------------------------------------------------------
// The channel seam
// ---------------------------------------------------------------------------

/**
 * A delivery channel. The in-app feed needs none of this — the row is the
 * delivery — but email/SMS/push implementations plug in here.
 */
export interface NotificationChannel {
  /** Stable key, e.g. `email`. */
  key: string
  /** False unless the environment actually configures the provider. */
  isConfigured(): boolean
  /**
   * Best-effort delivery. Must be idempotent: the same notification can be
   * dispatched more than once across retries.
   */
  deliver(delivery: NotificationDelivery): Promise<void>
}

/** What a channel receives — the persisted row, minus the database plumbing. */
export interface NotificationDelivery {
  companyId: string
  userId: string
  type: NotificationType
  title: string
  message: string | null
  metadata: Prisma.JsonValue
}

const channels: NotificationChannel[] = []

/**
 * Register a channel. Exported for the wiring plugin and for tests; production
 * code should register at boot, never per request.
 */
export function registerNotificationChannel(channel: NotificationChannel): void {
  if (!channels.some(entry => entry.key === channel.key)) channels.push(channel)
}

/** Drop every registered channel — tests isolate themselves with this. */
export function clearNotificationChannels(): void {
  channels.length = 0
}

/** The channels that would actually carry a delivery right now. */
export function activeNotificationChannels(): NotificationChannel[] {
  return channels.filter(channel => channel.isConfigured())
}

/**
 * Hand a persisted notification to every active channel.
 *
 * Deliberately fire-and-forget: a channel outage must never fail (or delay)
 * the domain transaction that produced the notification.
 */
export function dispatchToChannels(delivery: NotificationDelivery): void {
  for (const channel of activeNotificationChannels()) {
    void channel.deliver(delivery).catch(error =>
      console.warn(`[workquest:notifications] channel "${channel.key}" failed:`, error),
    )
  }
}

// ---------------------------------------------------------------------------
// Writing notifications
// ---------------------------------------------------------------------------

/** Everything a notification needs; `actorId` and `dedupeKey` power the rules above. */
export interface NotifyInput {
  companyId: string
  userId: string
  type: NotificationType
  title: string
  message?: string | null
  metadata?: Prisma.InputJsonValue
  /** The user who caused the event — they never get notified about themselves. */
  actorId?: string | null
  /** Natural key; a second attempt with the same key writes nothing. */
  dedupeKey?: string | null
}

/** Insert one notification. Returns false when self-suppressed or deduped. */
export async function notify(db: NotificationClient, input: NotifyInput): Promise<boolean> {
  if (input.actorId && input.actorId === input.userId) return false

  if (input.dedupeKey) {
    const existing = await db.notification.findUnique({
      where: {
        companyId_userId_dedupeKey: {
          companyId: input.companyId,
          userId: input.userId,
          dedupeKey: input.dedupeKey,
        },
      },
      select: { id: true },
    })
    if (existing) return false
  }

  const row = await db.notification.create({
    data: {
      companyId: input.companyId,
      userId: input.userId,
      type: input.type,
      title: input.title,
      message: input.message ?? null,
      metadata: input.metadata ?? {},
      dedupeKey: input.dedupeKey ?? null,
    },
  })

  dispatchToChannels({
    companyId: row.companyId,
    userId: row.userId,
    type: row.type,
    title: row.title,
    message: row.message,
    metadata: row.metadata,
  })

  return true
}

/**
 * Insert the same notification for many users in one write — used by the
 * events that fan out (a challenge starting, a team being addressed).
 */
export async function notifyMany(
  db: NotificationClient,
  input: Omit<NotifyInput, 'userId'> & { userIds: readonly string[] },
): Promise<number> {
  const { userIds, ...payload } = input
  const targets = userIds.filter(userId => !payload.actorId || userId !== payload.actorId)
  if (targets.length === 0) return 0

  if (payload.dedupeKey) {
    const existing = await db.notification.findMany({
      where: {
        companyId: payload.companyId,
        dedupeKey: payload.dedupeKey,
        userId: { in: targets },
      },
      select: { userId: true },
    })
    const seen = new Set(existing.map(row => row.userId))
    const fresh = targets.filter(userId => !seen.has(userId))
    if (fresh.length === 0) return 0
    return writeMany(db, { ...payload, userIds: fresh })
  }

  return writeMany(db, { ...payload, userIds: targets })
}

async function writeMany(
  db: NotificationClient,
  input: Omit<NotifyInput, 'userId'> & { userIds: readonly string[] },
): Promise<number> {
  if (input.userIds.length === 0) return 0
  await db.notification.createMany({
    data: input.userIds.map(userId => ({
      companyId: input.companyId,
      userId,
      type: input.type,
      title: input.title,
      message: input.message ?? null,
      metadata: input.metadata ?? {},
      dedupeKey: input.dedupeKey ?? null,
    })),
  })

  for (const userId of input.userIds) {
    dispatchToChannels({
      companyId: input.companyId,
      userId,
      type: input.type,
      title: input.title,
      message: input.message ?? null,
      metadata: (input.metadata ?? {}) as Prisma.JsonValue,
    })
  }

  return input.userIds.length
}

/**
 * Notify every ACTIVE user holding one of the given roles — e.g. the
 * OWNER/ADMIN crowd that has to decide on a reward redemption. The caller
 * still passes `actorId`: an admin who redeems their own reward does not get
 * told about their own request.
 */
export async function notifyRoles(
  db: NotificationClient,
  input: Omit<NotifyInput, 'userId'> & { roles: readonly Role[] },
): Promise<number> {
  const holders = await db.user.findMany({
    where: { companyId: input.companyId, status: 'ACTIVE', role: { in: [...input.roles] } },
    select: { id: true },
  })
  return notifyMany(db, { ...input, userIds: holders.map(row => row.id) })
}
