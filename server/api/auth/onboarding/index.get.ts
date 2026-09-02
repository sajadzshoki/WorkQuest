import type { OnboardingContext } from '#shared/types/api'

import { getAuth } from '../../../utils/auth'
import { errors } from '../../../utils/http'
import { findOnboardingTicket } from '../../../utils/onboarding'

/**
 * The pending onboarding context for the current browser.
 *
 * Resolved entirely from the httpOnly ticket cookie: the client never holds the
 * ticket id, so this endpoint is the only way it can learn which phone number
 * it is registering for (and whether the ticket is still alive).
 *
 * 409 rather than 200 when a full session already exists — the onboarding
 * screens must not be reachable after the founder is signed in.
 */
export default defineEventHandler(async (event): Promise<OnboardingContext> => {
  if (getAuth(event)) {
    throw errors.conflict('شما پیش‌تر وارد شده‌اید')
  }

  const ticket = await findOnboardingTicket(event)
  if (!ticket) {
    throw errors.unauthorized('نشست ثبت‌نام معتبر نیست؛ لطفاً دوباره کد ورود بگیرید')
  }

  const expiresIn = Math.max(0, Math.floor((ticket.expiresAt.getTime() - Date.now()) / 1000))

  return {
    phone: ticket.phone,
    expiresAt: ticket.expiresAt.toISOString(),
    expiresIn,
  }
})
