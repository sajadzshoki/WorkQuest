import type { NotificationItem, NotificationListResponse } from '#shared/types/api'
import { NOTIFICATION_TYPE_META, type NotificationType } from '#shared/utils/notifications'

/**
 * Live notification state — the bell's source of truth.
 *
 * The session carries the unread count as it was at sign-in; this composable
 * keeps it fresh: it re-seeds whenever the session reloads, polls a cheap
 * summary while the tab is open, and adjusts locally when the user reads
 * something. The page and the dropdown both read the same slot, so marking a
 * notification read in one is instantly reflected in the other.
 */

/** One interval per browser tab, not one per component. */
let pollTimer: ReturnType<typeof setInterval> | undefined

export function useNotifications() {
  const { session, isAuthenticated } = useSession()

  const unread = useState<number>('workquest:notifications:unread', () => 0)

  // Sign-in (or a session refresh) re-seeds the count; local reads keep
  // winning between those moments.
  watch(
    () => session.value?.unreadNotifications ?? null,
    (value) => {
      if (value !== null) unread.value = value
    },
    { immediate: true },
  )

  async function refreshUnread(): Promise<void> {
    if (!isAuthenticated.value) return
    try {
      const summary = await $fetch<{ unread: number }>('/api/notifications/summary')
      unread.value = summary.unread
    }
    catch {
      // A missed poll must never break the page — the badge simply stays
      // where it was until the next one lands.
    }
  }

  function startPolling(): void {
    if (!import.meta.client || pollTimer) return
    pollTimer = setInterval(() => {
      void refreshUnread()
    }, 45_000)
  }

  /** Mark one notification read; the server is authoritative for the count. */
  async function markRead(id: string): Promise<void> {
    await $fetch(`/api/notifications/${id}/read`, { method: 'POST' })
    await refreshUnread()
  }

  async function markAllRead(): Promise<number> {
    const result = await $fetch<{ updated: number }>('/api/notifications/read-all', { method: 'POST' })
    unread.value = 0
    return result.updated
  }

  /** A page of the feed — used by the dropdown (small) and the page. */
  async function fetchPage(page: number, pageSize: number): Promise<NotificationListResponse> {
    return await $fetch<NotificationListResponse>('/api/notifications', {
      query: { page, pageSize },
    })
  }

  /** Presentation helpers straight from the shared catalogue. */
  function metaOf(type: string) {
    return NOTIFICATION_TYPE_META[type as NotificationType] ?? NOTIFICATION_TYPE_META.SYSTEM
  }

  function isUnread(item: Pick<NotificationItem, 'readAt'>): boolean {
    return item.readAt === null
  }

  /**
   * Static classes per tone — Tailwind cannot compile interpolated class
   * names, so the map is spelled out and kept scannable.
   */
  const TONE_CHIP: Record<string, string> = {
    primary: 'bg-primary/12 text-primary',
    success: 'bg-success/12 text-success',
    warning: 'bg-warning/12 text-warning',
    error: 'bg-error/12 text-error',
    neutral: 'bg-elevated text-muted',
  }

  /** The icon chip classes for an unread row (read rows go quiet grey). */
  function chipClass(type: string): string {
    return TONE_CHIP[metaOf(type).tone] ?? TONE_CHIP.neutral!
  }

  return {
    unread,
    refreshUnread,
    startPolling,
    markRead,
    markAllRead,
    fetchPage,
    metaOf,
    isUnread,
    chipClass,
  }
}
