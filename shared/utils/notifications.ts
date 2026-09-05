/**
 * The notification vocabulary — shared by the server (validation) and the UI
 * (presentation).
 *
 * The fourteen product types are the events the spec names; `INVITATION` and
 * `SYSTEM` are internal catch-alls (an accepted invitation, a comment on a
 * task, administrative messages) that still appear in the feed.
 */

export const NOTIFICATION_TYPES = [
  'TASK_ASSIGNED',
  'TASK_SUBMITTED',
  'TASK_APPROVED',
  'TASK_NEEDS_REVISION',
  'COINS_EARNED',
  'ACHIEVEMENT_UNLOCKED',
  'LEVEL_UP',
  'RECOGNITION_RECEIVED',
  'RECOGNITION_WINNER',
  'CHALLENGE_STARTED',
  'CHALLENGE_COMPLETED',
  'REWARD_REDEEMED',
  'REWARD_APPROVED',
  'REWARD_REJECTED',
  'INVITATION',
  'SYSTEM',
] as const

export type NotificationType = (typeof NOTIFICATION_TYPES)[number]

/** Narrow an untrusted string (query params, hand-edited rows) to the vocabulary. */
export function isNotificationType(value: unknown): value is NotificationType {
  return typeof value === 'string' && (NOTIFICATION_TYPES as readonly string[]).includes(value)
}

/**
 * Presentation hints for the feed and the bell.
 *
 * `tone` follows the app's semantic palette (primary/success/warning/error/
 * neutral) so both the icon chip and the unread dot can share it.
 */
export interface NotificationTypeMeta {
  /** Heroicons name — the client bundle already ships these. */
  icon: string
  tone: 'primary' | 'success' | 'warning' | 'error' | 'neutral'
  /** True when the type is one of the spec's fourteen product events. */
  product: boolean
}

export const NOTIFICATION_TYPE_META: Record<NotificationType, NotificationTypeMeta> = {
  TASK_ASSIGNED: { icon: 'i-heroicons-clipboard-document-list', tone: 'primary', product: true },
  TASK_SUBMITTED: { icon: 'i-heroicons-arrow-up-tray', tone: 'primary', product: true },
  TASK_APPROVED: { icon: 'i-heroicons-clipboard-document-check', tone: 'success', product: true },
  TASK_NEEDS_REVISION: { icon: 'i-heroicons-arrow-uturn-left', tone: 'warning', product: true },
  COINS_EARNED: { icon: 'i-heroicons-circle-stack', tone: 'warning', product: true },
  ACHIEVEMENT_UNLOCKED: { icon: 'i-heroicons-star', tone: 'warning', product: true },
  LEVEL_UP: { icon: 'i-heroicons-arrow-trending-up', tone: 'success', product: true },
  RECOGNITION_RECEIVED: { icon: 'i-heroicons-hand-thumb-up', tone: 'primary', product: true },
  RECOGNITION_WINNER: { icon: 'i-heroicons-trophy', tone: 'warning', product: true },
  CHALLENGE_STARTED: { icon: 'i-heroicons-flag', tone: 'primary', product: true },
  CHALLENGE_COMPLETED: { icon: 'i-heroicons-flag-solid', tone: 'success', product: true },
  REWARD_REDEEMED: { icon: 'i-heroicons-shopping-bag', tone: 'primary', product: true },
  REWARD_APPROVED: { icon: 'i-heroicons-gift', tone: 'success', product: true },
  REWARD_REJECTED: { icon: 'i-heroicons-x-circle', tone: 'error', product: true },
  INVITATION: { icon: 'i-heroicons-user-plus', tone: 'primary', product: false },
  SYSTEM: { icon: 'i-heroicons-information-circle', tone: 'neutral', product: false },
}

/**
 * Dedupe key for a level-up: a user can reach a level at most once, so the
 * notification is keyed by the level itself. Shared by the wallet helper that
 * emits it and the tests that prove it.
 */
export function levelUpDedupeKey(userId: string, level: number): string {
  return `levelup:${userId}:${level}`
}
