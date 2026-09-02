import { requestOtpSchema } from '#shared/schemas'
import { normalizeIranianPhone } from '#shared/utils/format'

import { usePrisma } from '../../../utils/db'
import { errors, readValidated } from '../../../utils/http'
import { generateOtpCode, hashOtpCode } from '../../../utils/crypto'
import { OtpDeliveryError, otpSettings, resolveOtpProvider } from '../../../utils/otp'

/**
 * Step 1 of login: request a one-time code for a phone number.
 *
 * The code is never returned in the response — it is delivered through the
 * configured OTP provider and stored only as a scrypt digest.
 */
export default defineEventHandler(async (event) => {
  const { phone } = await readValidated(event, requestOtpSchema)
  const normalized = normalizeIranianPhone(phone)
  if (!normalized) throw errors.badRequest('AUTH_INVALID_PHONE', 'شماره موبایل معتبر نیست')

  const db = usePrisma()
  const { codeLength, ttlSeconds, maxAttempts, resendCooldownSeconds } = otpSettings()

  const cooldownStartedAt = new Date(Date.now() - resendCooldownSeconds * 1000)
  const latest = await db.otpCode.findFirst({
    where: { phone: normalized },
    orderBy: { createdAt: 'desc' },
  })

  if (latest && latest.createdAt > cooldownStartedAt) {
    const waitSeconds = Math.ceil((latest.createdAt.getTime() + resendCooldownSeconds * 1000 - Date.now()) / 1000)
    throw errors.tooManyRequests(`لطفاً ${Math.max(waitSeconds, 1)} ثانیه دیگر دوباره تلاش کنید`)
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
      codeHash: hashOtpCode(code),
      expiresAt,
      maxAttempts,
      requestIp: getRequestIP(event, { xForwardedFor: true }) ?? null,
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
  }
})
