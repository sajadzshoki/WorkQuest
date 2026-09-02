import type { OtpPurpose } from '#prisma/client'

import { requestOtpSchema } from '#shared/schemas'
import { normalizeIranianPhone } from '#shared/utils/format'

import { usePrisma } from '../../../utils/db'
import { errors, readValidated } from '../../../utils/http'
import { generateOtpCode, hashOtpCode } from '../../../utils/crypto'
import { OtpDeliveryError, otpSettings, resolveOtpProvider } from '../../../utils/otp'

/**
 * Step 1 of authentication: request a one-time code for a phone number.
 *
 * The code is never returned in the response — it is delivered through the
 * configured OTP provider and stored only as a scrypt digest.
 *
 * Rate limiting is two-layered:
 *  - a per-phone resend cooldown (the newest code also invalidates older ones);
 *  - a per-IP request cap over a rolling window, so one client cannot spray
 *    codes across many phone numbers.
 */
export default defineEventHandler(async (event) => {
  const { phone, purpose } = await readValidated(event, requestOtpSchema)
  const normalized = normalizeIranianPhone(phone)
  if (!normalized) throw errors.badRequest('AUTH_INVALID_PHONE', 'شماره موبایل معتبر نیست')

  const db = usePrisma()
  const { codeLength, ttlSeconds, maxAttempts, resendCooldownSeconds } = otpSettings()
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? null

  await enforceIpRateLimit(ip)

  // Does this phone already belong to an active account? This decides which
  // flow the client runs next, and it is the only existence signal we expose.
  const existingUser = await db.user.findFirst({
    where: { phone: normalized, status: 'ACTIVE' },
    select: { id: true, companyId: true },
    orderBy: { createdAt: 'asc' },
  })

  // Checked before the resend cooldown: "you already have an account" is a more
  // useful answer than "wait two seconds and try again".
  if (purpose === 'REGISTER' && existingUser) {
    throw errors.conflict('این شماره موبایل قبلاً ثبت شده است. لطفاً وارد شوید.')
  }

  const cooldownStartedAt = new Date(Date.now() - resendCooldownSeconds * 1000)
  const latest = await db.otpCode.findFirst({
    where: { phone: normalized, purpose: purpose as OtpPurpose },
    orderBy: { createdAt: 'desc' },
  })

  if (latest && latest.createdAt > cooldownStartedAt) {
    const waitSeconds = Math.ceil(
      (latest.createdAt.getTime() + resendCooldownSeconds * 1000 - Date.now()) / 1000,
    )
    throw errors.tooManyRequests(
      `لطفاً ${toPersianDigits(Math.max(waitSeconds, 1))} ثانیه دیگر دوباره تلاش کنید`,
    )
  }

  const code = generateOtpCode(codeLength)
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000)

  // Invalidate any pending code for this phone so only the newest one works.
  await db.otpCode.updateMany({
    where: { phone: normalized, consumedAt: null },
    data: { consumedAt: new Date() },
  })

  await db.otpCode.create({
    data: {
      phone: normalized,
      purpose: purpose as OtpPurpose,
      codeHash: hashOtpCode(code),
      expiresAt,
      maxAttempts,
      requestIp: ip,
      userAgent: getHeader(event, 'user-agent') ?? null,
    },
  })

  const provider = resolveOtpProvider()
  try {
    await provider.send({
      to: normalized,
      code,
      ttlSeconds,
      locale: 'fa',
      appName: String(useRuntimeConfig().public.appName ?? 'ورک‌کوئست'),
    })
  }
  catch (error) {
    if (error instanceof OtpDeliveryError) {
      throw errors.serviceUnavailable(error.message)
    }
    throw error
  }

  return {
    phone: normalized,
    codeLength,
    expiresAt: expiresAt.toISOString(),
    resendAfterSeconds: resendCooldownSeconds,
    provider: provider.id,
    purpose,
    accountExists: Boolean(existingUser),
  }
})

/** Persian digits, because every user-facing message in the app is Persian. */
function toPersianDigits(value: number): string {
  return value.toLocaleString('fa-IR')
}

/**
 * Per-IP cap on OTP requests over a rolling hour.
 *
 * Deliberately coarse (a plain count, no Redis) and deliberately generous: a
 * whole office can sit behind one NAT address, so this exists to stop scripted
 * spraying, not to throttle a normal team.
 */
async function enforceIpRateLimit(ip: string | null): Promise<void> {
  if (!ip) return

  const config = useRuntimeConfig()
  const limit = Number(config.otpMaxRequestsPerIpPerHour ?? 30)
  if (limit <= 0) return

  const since = new Date(Date.now() - 60 * 60 * 1000)
  const requests = await usePrisma().otpCode.count({
    where: { requestIp: ip, createdAt: { gte: since } },
  })

  if (requests >= limit) {
    throw errors.tooManyRequests('تعداد درخواست‌های شما از این اتصال بیش از حد مجاز است')
  }
}
