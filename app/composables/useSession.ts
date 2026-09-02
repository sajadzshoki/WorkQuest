import type { MeResponse } from '#shared/types/api'

export interface SessionState {
  data: MeResponse | null
  initialized: boolean
  pending: boolean
}

/**
 * Global session store.
 *
 * One `useState` slot so the value survives navigation and is transferred from
 * SSR to the client. Route middleware calls `ensureLoaded()` before guarding,
 * and auth pages call `refresh()` after a successful sign-in.
 */
export function useSession() {
  const state = useState<SessionState>('workquest:session', () => ({
    data: null,
    initialized: false,
    pending: false,
  }))

  const session = computed(() => state.value.data)
  const user = computed(() => state.value.data?.user ?? null)
  const company = computed(() => state.value.data?.company ?? null)
  const gamification = computed(() => state.value.data?.gamification ?? null)
  const isAuthenticated = computed(() => state.value.data !== null)
  const initialized = computed(() => state.value.initialized)

  /**
   * During SSR a plain `$fetch` drops the incoming cookie, which would make
   * every server-rendered page look signed out. `useRequestFetch()` forwards
   * the request headers; it is unavailable outside a Nuxt context (for example
   * in an event handler right after sign-in), hence the fallback.
   */
  function apiFetcher(): <T>(url: string) => Promise<T> {
    try {
      return useRequestFetch() as unknown as <T>(url: string) => Promise<T>
    }
    catch {
      return $fetch as unknown as <T>(url: string) => Promise<T>
    }
  }

  async function refresh(): Promise<MeResponse | null> {
    if (state.value.pending) return state.value.data
    state.value.pending = true
    try {
      state.value.data = await apiFetcher()<MeResponse>('/api/me')
    }
    catch {
      state.value.data = null
    }
    finally {
      state.value.pending = false
      state.value.initialized = true
    }
    return state.value.data
  }

  /** Load once; safe to call from middleware on every navigation. */
  async function ensureLoaded(): Promise<void> {
    if (state.value.initialized || state.value.pending) return
    await refresh()
  }

  function clear(): void {
    state.value = { data: null, initialized: true, pending: false }
  }

  async function logout(): Promise<void> {
    await $fetch('/api/auth/session', { method: 'DELETE' }).catch(() => undefined)
    clear()
  }

  return { session, user, company, gamification, isAuthenticated, initialized, refresh, ensureLoaded, clear, logout }
}
