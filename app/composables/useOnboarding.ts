import type { CompleteOnboardingInput } from '#shared/schemas'
import type { SupportedLocale, SupportedTimezone } from '#shared/constants'
import type { CompleteOnboardingResponse, OnboardingContext } from '#shared/types/api'

export interface OnboardingDraft {
  fullName: string
  jobTitle: string
  companyName: string
  slug: string
  industry: string
  logoUrl: string
  timezone: SupportedTimezone
  locale: SupportedLocale
}

const STORAGE_KEY = 'workquest:onboarding-draft'

function emptyDraft(): OnboardingDraft {
  return {
    fullName: '',
    jobTitle: '',
    companyName: '',
    slug: '',
    industry: '',
    logoUrl: '',
    timezone: 'Asia/Tehran',
    locale: 'fa',
  }
}

/**
 * State for the two-step registration wizard.
 *
 * The server never sees the draft until the final submit, so it is kept in
 * `useState` (which survives SPA navigation and is transferred from SSR) and
 * mirrored into `sessionStorage` so a browser refresh on step 2 does not throw
 * the founder's typing away. Per-tab storage is deliberate: a second browser
 * tab registering a different company must not inherit this draft.
 *
 * The onboarding **ticket** is never part of this state — it lives in an
 * httpOnly cookie, so the only thing the client can know about it is what
 * `GET /api/auth/onboarding` chooses to return.
 */
export function useOnboarding() {
  const draft = useState<OnboardingDraft>('workquest:onboarding', emptyDraft)
  const context = useState<OnboardingContext | null>('workquest:onboarding-context', () => null)
  const hydrated = useState<boolean>('workquest:onboarding-hydrated', () => false)

  function hydrateFromStorage(): void {
    if (!import.meta.client || hydrated.value) return
    hydrated.value = true

    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY)
      if (raw) draft.value = { ...emptyDraft(), ...(JSON.parse(raw) as Partial<OnboardingDraft>) }
    }
    catch {
      // A corrupt or cross-version draft is not worth blocking registration for.
    }
  }

  function persist(): void {
    if (!import.meta.client) return
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft.value))
    }
    catch {
      // Private browsing can refuse writes; the wizard still works in-memory.
    }
  }

  /**
   * During SSR a plain `$fetch` would drop the incoming cookie, so a server
   * render of the wizard would always look ticket-less and bounce to /login.
   * `useRequestFetch()` forwards the request headers; it is unavailable outside
   * a Nuxt context, hence the fallback.
   */
  function apiFetcher(): <T>(url: string, init?: unknown) => Promise<T> {
    try {
      return useRequestFetch() as unknown as <T>(url: string, init?: unknown) => Promise<T>
    }
    catch {
      return $fetch as unknown as <T>(url: string, init?: unknown) => Promise<T>
    }
  }

  /** Read the pending ticket's context; `null` means there is no valid ticket. */
  async function loadContext(): Promise<OnboardingContext | null> {
    context.value = await apiFetcher()<OnboardingContext>('/api/auth/onboarding').catch(() => null)
    return context.value
  }

  /** True when the browser holds a live onboarding ticket. */
  async function hasTicket(): Promise<boolean> {
    return (await loadContext()) !== null
  }

  /** Check whether a slug is free; returns a suggestion when it is taken. */
  async function checkSlug(slug: string): Promise<{ available: boolean, suggestion?: string }> {
    if (!slug) return { available: false }
    return await $fetch<{ available: boolean, suggestion?: string }>('/api/companies/slug', {
      query: { slug },
    })
  }

  async function complete(): Promise<CompleteOnboardingResponse> {
    const payload: CompleteOnboardingInput = {
      fullName: draft.value.fullName,
      jobTitle: draft.value.jobTitle,
      companyName: draft.value.companyName,
      slug: draft.value.slug,
      industry: draft.value.industry,
      logoUrl: draft.value.logoUrl,
      timezone: draft.value.timezone as CompleteOnboardingInput['timezone'],
      locale: draft.value.locale as CompleteOnboardingInput['locale'],
    }

    const result = await $fetch<CompleteOnboardingResponse>('/api/auth/onboarding/complete', {
      method: 'POST',
      body: payload,
    })

    if (import.meta.client) {
      window.sessionStorage.removeItem(STORAGE_KEY)
    }
    context.value = null

    return result
  }

  function reset(): void {
    draft.value = emptyDraft()
    context.value = null
    if (import.meta.client) window.sessionStorage.removeItem(STORAGE_KEY)
  }

  return {
    draft,
    context,
    hydrateFromStorage,
    persist,
    loadContext,
    hasTicket,
    checkSlug,
    complete,
    reset,
  }
}
