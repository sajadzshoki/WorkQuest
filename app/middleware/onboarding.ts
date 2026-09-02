/**
 * Protects the registration wizard.
 *
 * The wizard is reachable only with a live onboarding ticket — the httpOnly
 * cookie set when an OTP was verified for a phone that has no account yet. This
 * is a UX guard, not a security boundary: the endpoints re-validate the ticket
 * on every request, so a forged client cannot reach them.
 */
export default defineNuxtRouteMiddleware(async () => {
  const { isAuthenticated, ensureLoaded } = useSession()
  const { hasTicket } = useOnboarding()
  const localePath = useLocalePath()

  await ensureLoaded()

  // Already signed in — nothing left to onboard.
  if (isAuthenticated.value) {
    return navigateTo(localePath('/dashboard'), { redirectCode: 302 })
  }

  if (!(await hasTicket())) {
    return navigateTo(localePath('/login'), { redirectCode: 302 })
  }
})
