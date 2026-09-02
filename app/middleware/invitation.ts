/**
 * Protects the invitation acceptance screen.
 *
 * Reachable only with a live invitation ticket — the httpOnly cookie set when
 * an OTP is verified for a phone that has a pending invitation. This is a UX
 * guard, not the security boundary: `POST /api/auth/invitations/accept`
 * re-validates the ticket and re-checks the invitation on every request.
 */
export default defineNuxtRouteMiddleware(async () => {
  const { isAuthenticated, ensureLoaded } = useSession()
  const { hasTicket } = useInvitation()
  const localePath = useLocalePath()

  await ensureLoaded()

  // Already a member — nothing left to accept.
  if (isAuthenticated.value) {
    return navigateTo(localePath('/dashboard'), { redirectCode: 302 })
  }

  if (!(await hasTicket())) {
    return navigateTo(localePath('/login'), { redirectCode: 302 })
  }
})
