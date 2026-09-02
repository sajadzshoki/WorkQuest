import type { VerifyOtpResponse } from '#shared/types/api'

import { verifyOtpSchema } from '#shared/schemas'
import { normalizeIranianPhone } from '#shared/utils/format'

import { issueSession, startSession, toCompanySummary, toUserSummary } from '../../../utils/auth'
import { usePrisma } from '../../../utils/db'
import { errors, readValidated } from '../../../utils/http'
import { verifyOtpCode } from '../../../utils/crypto'
import { issueOnboardingTicket } from '../../../utils/onboarding'

/**
 * Step 2 of authentication: verify the code.
 *
 * Two outcomes:
 *  - the phone belongs to an active account → open a session;
 *  - it does not → issue a single-use onboarding ticket so the founder can
 *    create a company (see `server/utils/onboarding.ts`).
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
