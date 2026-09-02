/** Sends already-authenticated visitors away from login/landing screens. */
export default defineNuxtRouteMiddleware(async () => {
  const { isAuthenticated, ensureLoaded } = useSession()
  const localePath = useLocalePath()

  await ensureLoaded()

  if (isAuthenticated.value) {
    return navigateTo(localePath('/dashboard'), { redirectCode: 302 })
  }
})
