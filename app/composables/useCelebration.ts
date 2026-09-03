/**
 * Global, queue-based celebration feed.
 *
 * A single `useState` slot holds the currently-visible unlocks; any component
 * can push onto it and `<GamificationCelebration />` (mounted once in
 * `app.vue`) renders them as a quiet, auto-dismissing stack. Keeping the
 * animation out of individual pages means a level-up triggered deep inside a
 * modal still surfaces at the app shell.
 */

export type CelebrationType = 'level' | 'achievement' | 'coins' | 'badge'

export interface CelebrationItem {
  id: string
  type: CelebrationType
  title: string
  detail?: string
}

/** How long an item stays on screen before it fades out. */
const LIFETIME_MS = 3800
/** Keep the stack short so a big unlock burst never fills the viewport. */
const MAX_VISIBLE = 3

export function useCelebration() {
  const celebrations = useState<CelebrationItem[]>('workquest:celebrations', () => [])

  function celebrate(input: Omit<CelebrationItem, 'id'>): void {
    const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
    celebrations.value = [...celebrations.value, { ...input, id }].slice(-MAX_VISIBLE)

    // Client-only (called from event handlers), so the timer is safe.
    setTimeout(() => {
      celebrations.value = celebrations.value.filter(item => item.id !== id)
    }, LIFETIME_MS)
  }

  function dismiss(id: string): void {
    celebrations.value = celebrations.value.filter(item => item.id !== id)
  }

  return { celebrations, celebrate, dismiss }
}
