import type { VerifyOtpResponse } from '#shared/types/api'

import { verifyOtpSchema } from '#shared/schemas'
import { normalizeIranianPhone } from '#shared/utils/format'

import { issueSession, startSession, toCompanySummary, toUserSummary } from '../../../utils/auth'
import { usePrisma } from '../../../utils/db'
import { errors, readValidated } from '../../../utils/http'
import { verifyOtpCode } from '../../../utils/crypto'
import { issueInvitationTicket, listPendingInvitationsForPhone } from '../../../utils/invitation'
import { issueOnboardingTicket } from '../../../utils/onboarding'

/**
 * Step 2 of authentication: verify the code.
 *
 * Three outcomes, checked in this order:
 *  1. the phone belongs to an active account → open a session;
 *  2. a company has invited this phone → issue an **invitation** ticket, so
 *     the invitee accepts an existing invitation (see
 *     `server/utils/invitation.ts`) instead of founding their own company;
 *  3. neither → issue an **onboarding** ticket so they can register a company
 *     (see `server/utils/onboarding.ts`).
 *
 * The order is a security property, not a convenience: an invited phone must
 * not be able to sidestep the invitation and self-register as an OWNER.
 *
 * The code itself is checked as a scrypt digest, expires after
 * `otpTtlSeconds`, and is burned after `otpMaxAttempts` wrong guesses.
 */
export default defineEventHandler(async (event): Promise<VerifyOtpResponse> => {
  const { phone, code } = await readValidated(event, verifyOtpSchema)
  const normalized = normalizeIranianPhone(phone)
  if (!normalized) throw errors.badRequest('AUTH_INVALID_PHONE', 'شماره موبایل معتبر نیست')

  const db = usePrisma()

  // The newest pending code wins regardless of purpose; the purpose recorded on
  // it then constrains what the verified code is allowed to do (see below).
  const otp = await db.otpCode.findFirst({
    where: { phone: normalized, consumedAt: null },
    orderBy: { createdAt: 'desc' },
  })

  if (!otp) {
    throw errors.badRequest('AUTH_CODE_EXPIRED', 'کد وارد شده منقضی شده است')
  }

  if (otp.expiresAt.getTime() < Date.now()) {
    await db.otpCode.update({ where: { id: otp.id }, data: { consumedAt: new Date() } })
    throw errors.badRequest('AUTH_CODE_EXPIRED', 'کد وارد شده منقضی شده است؛ کد جدید درخواست دهید')
  }

  if (otp.attempts >= otp.maxAttempts) {
    await db.otpCode.update({ where: { id: otp.id }, data: { consumedAt: new Date() } })
    throw errors.tooManyRequests('تعداد تلاش‌های ناموفق بیش از حد مجاز است؛ کد جدید درخواست دهید')
  }

  if (!verifyOtpCode(code, otp.codeHash)) {
    await db.otpCode.update({ where: { id: otp.id }, data: { attempts: { increment: 1 } } })
    const remaining = Math.max(0, otp.maxAttempts - otp.attempts - 1)
    throw errors.badRequest(
      'AUTH_INVALID_CODE',
      remaining > 0
        ? `کد وارد شده نادرست است (${remaining.toLocaleString('fa-IR')} تلاش باقی‌مانده)`
        : 'کد وارد شده نادرست است',
    )
  }

  const user = await db.user.findFirst({
    where: { phone: normalized, status: 'ACTIVE' },
    orderBy: { createdAt: 'asc' },
    include: { company: true },
  })

  // The code was correct, so it is spent either way.
  await db.otpCode.update({ where: { id: otp.id }, data: { consumedAt: new Date() } })

  // `REGISTER` is the stricter of the two purposes: it may only ever create a
  // new tenant, never open a session on an account that already exists.
  // `LOGIN` is permissive — a login attempt on an unknown phone simply becomes
  // a registration, since self-service signup is open to anyone.
  if (otp.purpose === 'REGISTER' && user) {
    throw errors.conflict('این شماره موبایل قبلاً ثبت شده است. لطفاً وارد شوید.')
  }

  if (!user) {
    // Invited? Joining beats self-registration — the invitation carries the
    // role the company decided on, so it must not be bypassable.
    const invitations = await listPendingInvitationsForPhone(normalized)
    if (invitations.length > 0) {
      const ticket = await issueInvitationTicket(event, normalized)
      return {
        status: 'invitation_pending',
        phone: normalized,
        expiresAt: ticket.expiresAt.toISOString(),
        invitationCount: invitations.length,
      }
    }

    const ticket = await issueOnboardingTicket(event, normalized)
    return {
      status: 'onboarding_required',
      phone: normalized,
      expiresAt: ticket.expiresAt.toISOString(),
    }
  }

  if (!user.company.isActive) {
    throw errors.forbidden('حساب سازمانی شما غیرفعال است. با پشتیبانی تماس بگیرید.')
  }

  const session = await issueSession(event, user)
  startSession(event, session)

  return {
    status: 'authenticated',
    user: toUserSummary(user),
    company: toCompanySummary(user.company),
  }
})
