import { verifyOtpSchema } from '#shared/schemas'
import { normalizeIranianPhone } from '#shared/utils/format'

import { usePrisma } from '../../../utils/db'
import { errors, readValidated } from '../../../utils/http'
import { verifyOtpCode } from '../../../utils/crypto'
import { setSessionCookie, signSessionToken } from '../../../utils/session'

/**
 * Step 2 of login: verify the code and open a session.
 *
 * Auto-provisioning is intentionally disabled — accounts are created by an
 * admin, so an unknown phone is a 404 rather than a new user.
 */
export default defineEventHandler(async (event) => {
  const { phone, code } = await readValidated(event, verifyOtpSchema)
  const normalized = normalizeIranianPhone(phone)
  if (!normalized) throw errors.badRequest('AUTH_INVALID_PHONE', 'شماره موبایل معتبر نیست')

  const db = usePrisma()

  const otp = await db.otpCode.findFirst({
    where: { phone: normalized, consumedAt: null },
    orderBy: { createdAt: 'desc' },
  })

  if (!otp || otp.expiresAt.getTime() < Date.now()) {
    throw errors.badRequest('AUTH_CODE_EXPIRED', 'کد وارد شده منقضی شده است')
  }

  if (otp.attempts >= otp.maxAttempts) {
    await db.otpCode.update({ where: { id: otp.id }, data: { consumedAt: new Date() } })
    throw errors.tooManyRequests('تعداد تلاش‌های ناموفق بیش از حد مجاز است')
  }

  if (!verifyOtpCode(code, otp.codeHash)) {
    await db.otpCode.update({ where: { id: otp.id }, data: { attempts: { increment: 1 } } })
    const remaining = Math.max(0, otp.maxAttempts - otp.attempts - 1)
    throw errors.badRequest(
      'AUTH_INVALID_CODE',
      remaining > 0 ? `کد وارد شده نادرست است (${remaining} تلاش باقی‌مانده)` : 'کد وارد شده نادرست است',
    )
  }

  const user = await db.user.findFirst({
    where: { phone: normalized, status: 'ACTIVE' },
    orderBy: { createdAt: 'asc' },
    include: { company: true },
  })

  if (!user || !user.company.isActive) {
    throw errors.notFound('حسابی با این شماره موبایل یافت نشد. با مدیر سازمان خود تماس بگیرید.')
  }

  const session = await db.$transaction(async (tx) => {
    const created = await tx.session.create({
      data: {
        userId: user.id,
        expiresAt: new Date(Date.now() + Number(useRuntimeConfig().sessionMaxAgeSeconds) * 1000),
        ip: getRequestIP(event, { xForwardedFor: true }),
        userAgent: getHeader(event, 'user-agent'),
      },
    })

    await tx.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })
    await tx.otpCode.update({ where: { id: otp.id }, data: { consumedAt: new Date() } })
    await tx.auditLog.create({
      data: {
        companyId: user.companyId,
        actorId: user.id,
        action: 'auth.login',
        targetType: 'Session',
        targetId: created.id,
        ip: getRequestIP(event, { xForwardedFor: true }),
      },
    })

    return created
  })

  const token = await signSessionToken({
    sub: user.id,
    sid: session.id,
    cid: user.companyId,
    role: user.role,
  })
  setSessionCookie(event, token)

  return {
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatarUrl: user.avatarUrl,
      locale: user.locale,
    },
    company: {
      id: user.company.id,
      name: user.company.name,
      slug: user.company.slug,
      locale: user.company.locale,
      timezone: user.company.timezone,
    },
  }
})
