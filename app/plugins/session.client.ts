/**
 * A rejected session must leave the app immediately.
 *
 * ofetch and `useFetch` both go through `globalThis.fetch`, so one wrapper
 * covers every client request. Public auth endpoints are skipped: a wrong
 * code should stay on the form, not bounce the visitor.
 */
const PUBLIC_API = new Set([
  '/api/auth/otp/request',
  '/api/auth/otp/verify',
  '/api/auth/onboarding',
  '/api/auth/onboarding/complete',
  '/api/auth/invitations',
  '/api/auth/invitations/accept',
  '/api/companies/slug',
  '/api/health',
])

function requestUrl(input: RequestInfo | URL): string {
  if (typeof input === 'string') return input
  if (input instanceof URL) return input.toString()
  return input.url
}

export default defineNuxtPlugin((nuxtApp) => {
  const native = globalThis.fetch.bind(globalThis)
  let handling = false

  globalThis.fetch = async (input, init) => {
    const response = await native(input, init)
    if (response.status !== 401 || handling) return response

    let pathname: string
    try {
      pathname = new URL(requestUrl(input), window.location.origin).pathname.replace(/\/$/, '')
    }
    catch {
      return response
    }

    if (!pathname.startsWith('/api/') || PUBLIC_API.has(pathname)) return response

    const body = await response.clone().json().catch(() => null) as { code?: string } | null
    if (body?.code !== 'AUTH_REQUIRED') return response

    handling = true
    try {
      await nuxtApp.runWithContext(async () => {
        const { isAuthenticated, abandon } = useSession()
        if (!isAuthenticated.value) return

        abandon()

        const route = useRoute()
        const localePath = useLocalePath()
        const login = localePath('/login')
        if (route.path === login || route.path.startsWith(`${login}/`)) return
        await navigateTo(login)
      })
    }
    finally {
      handling = false
    }

    return response
  }
})
