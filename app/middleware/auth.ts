/**
 * Protects application routes.
 *
 * Runs on the server during SSR and on the client for SPA navigation, so a
 * direct deep link to /dashboard never flashes the app shell for a signed-out
 * visitor.
 */
export default defineNuxtRouteMiddleware(async () => {
  const { isAuthenticated, ensureLoaded } = useSession()
  const localePath = useLocalePath()

  await ensureLoaded()

  if (!isAuthenticated.value) {
    return navigateTo(localePath('/login'), { redirectCode: 302 })
  }
})
