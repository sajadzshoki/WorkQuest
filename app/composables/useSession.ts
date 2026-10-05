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
const INFLIGHT = Symbol.for('workquest.session.inflight')

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
    const nuxtApp = useNuxtApp() as ReturnType<typeof useNuxtApp> & {
      [INFLIGHT]?: Promise<MeResponse | null>
    }
    if (nuxtApp[INFLIGHT]) return nuxtApp[INFLIGHT]

    state.value.pending = true
    const current: { promise?: Promise<MeResponse | null> } = {}
    const request = (async () => {
      try {
        state.value.data = await apiFetcher()<MeResponse>('/api/me')
      }
      catch {
        state.value.data = null
      }
      finally {
        state.value.pending = false
        state.value.initialized = true
        if (nuxtApp[INFLIGHT] === current.promise) nuxtApp[INFLIGHT] = undefined
      }
      return state.value.data
    })()

    current.promise = request
    nuxtApp[INFLIGHT] = request
    return request
  }

  /**
   * Load once; safe to call from middleware on every navigation.
   * Concurrent callers share the in-flight request instead of deciding early.
   */
  async function ensureLoaded(): Promise<void> {
    if (state.value.initialized) return
    await refresh()
  }

  function clear(): void {
    state.value = { data: null, initialized: true, pending: false }
  }

  /** Drop client-only state that must not survive a signed-out session. */
  function clearPrivateState(): void {
    clear()
    useNotifications().reset()
    useCelebration().clear()
    useOnboarding().reset()
  }

  async function logout(): Promise<void> {
    await $fetch('/api/auth/session', { method: 'DELETE' }).catch(() => undefined)
    clearPrivateState()
  }

  return {
    session,
    user,
    company,
    gamification,
    isAuthenticated,
    initialized,
    refresh,
    ensureLoaded,
    clear,
    abandon: clearPrivateState,
    logout,
  }
}
