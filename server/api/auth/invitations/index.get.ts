import type { InvitationDetail } from '#shared/types/api'

import { usePrisma } from '../../../utils/db'
import { errors } from '../../../utils/http'
import { listPendingInvitationsForPhone, requireInvitationTicket } from '../../../utils/invitation'

/**
 * Pending invitations addressed to the phone behind the invitation ticket.
 *
 * Pre-auth, so it uses `usePrisma()` directly — there is no session and
 * therefore no tenant to scope to. Safety comes from the ticket: it is
 * httpOnly, single-use, short-lived, and was only ever issued to a phone that
 * just passed OTP verification. The handler never takes a phone from the
 * client, so it cannot be pointed at someone else's invitations.
 *
 * A phone may legitimately appear on more than one company's invitation list
 * (two firms interviewing the same person), which is why this returns an array.
 */
export default defineEventHandler(async (
  event,
): Promise<{ status: 'invitation_pending', invitations: InvitationDetail[], expiresAt: string }> => {
  const ticket = await requireInvitationTicket(event)
  const db = usePrisma()

  // A phone that already has an active account must not be invited again —
  // the verify step should have signed them in instead.
  const existing = await db.user.findFirst({
    where: { phone: ticket.phone, status: 'ACTIVE' },
    select: { id: true },
  })
  if (existing) {
    throw errors.conflict('این شماره قبلاً ثبت‌نام شده است؛ لطفاً وارد شوید')
  }

  const invitations = await listPendingInvitationsForPhone(ticket.phone)
  if (invitations.length === 0) {
    throw errors.notFound('دعوت‌نامه معتبری برای این شماره وجود ندارد')
  }

  return {
    status: 'invitation_pending',
    invitations,
    expiresAt: ticket.expiresAt.toISOString(),
  }
})
