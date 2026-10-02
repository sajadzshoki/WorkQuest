/**
 * OTP delivery is a pluggable transport.
 *
 * Nothing in the app talks to an SMS gateway directly: handlers call
 * `resolveOtpProvider().send(...)`. Drivers:
 *
 *  - `console` — logs the code. Dev-only; refuses outside `import.meta.dev`.
 *  - `http`    — POSTs a JSON payload to any gateway when `NUXT_OTP_HTTP_URL`
 *    is set. If that URL is empty, resolution falls back to `mock`.
 *  - `mock`    — fixed code (`111111`) for deploys without an SMS gateway.
 *
 * An unconfigured `http` driver never silently no-ops: either the real
 * gateway is used, or mock takes over so login still works.
 */
export interface OtpSendInput {
  /** Destination phone number in E.164 form. */
  to: string
  code: string
  ttlSeconds: number
  locale: string
  appName: string
}

export interface OtpProvider {
  readonly id: string
  isConfigured(): boolean
  send(input: OtpSendInput): Promise<void>
}

export class OtpDeliveryError extends Error {
  constructor(
    message: string,
    readonly code = 'OTP_DELIVERY_FAILED',
  ) {
    super(message)
    this.name = 'OtpDeliveryError'
  }
}

/** Fixed login code used when no SMS gateway URL is configured. */
export const MOCK_OTP_CODE = '111111'

function otpConfig() {
  const config = useRuntimeConfig()
  return {
    provider: String(config.otpProvider ?? 'console'),
    codeLength: Number(config.otpCodeLength ?? 6),
    ttlSeconds: Number(config.otpTtlSeconds ?? 120),
    maxAttempts: Number(config.otpMaxAttempts ?? 5),
    resendCooldownSeconds: Number(config.otpResendCooldownSeconds ?? 90),
    httpUrl: String(config.otpHttpUrl ?? ''),
    httpApiKey: String(config.otpHttpApiKey ?? ''),
    httpTemplate: String(
      config.otpHttpTemplate ?? 'کد ورود شما به {app_name}: {code} (اعتبار: {ttl} ثانیه)',
    ),
  }
}

export const consoleOtpProvider: OtpProvider = {
  id: 'console',
  isConfigured: () => true,
  async send({ to, code, ttlSeconds }) {
    if (!import.meta.dev) {
      throw new OtpDeliveryError(
        'The console OTP provider cannot be used in production. Set NUXT_OTP_PROVIDER.',
        'OTP_PROVIDER_UNSAFE',
      )
    }

    console.warn(`[workquest:otp] code for ${to} is ${code} (valid ${ttlSeconds}s)`)
  },
}

export const mockOtpProvider: OtpProvider = {
  id: 'mock',
  isConfigured: () => true,
  async send({ to, code, ttlSeconds }) {
    console.warn(
      `[workquest:otp:mock] NUXT_OTP_HTTP_URL empty — using mock code ${code} for ${to} (valid ${ttlSeconds}s)`,
    )
  },
}

export const httpOtpProvider: OtpProvider = {
  id: 'http',
  isConfigured: () => otpConfig().httpUrl.length > 0,
  async send({ to, code, ttlSeconds, appName }) {
    const { httpUrl, httpApiKey, httpTemplate } = otpConfig()
    if (!httpUrl) {
      throw new OtpDeliveryError(
        'NUXT_OTP_HTTP_URL is not configured; the http OTP provider cannot deliver codes.',
        'OTP_PROVIDER_UNCONFIGURED',
      )
    }

    const message = httpTemplate
      .replaceAll('{code}', code)
      .replaceAll('{ttl}', String(ttlSeconds))
      .replaceAll('{app_name}', appName)

    await $fetch(httpUrl, {
      method: 'POST',
      timeout: 10_000,
      headers: {
        'content-type': 'application/json',
        ...(httpApiKey ? { authorization: `Bearer ${httpApiKey}` } : {}),
      },
      body: { to, message, code, ttlSeconds },
    }).catch((error: unknown) => {
      throw new OtpDeliveryError(
        `OTP gateway request failed: ${error instanceof Error ? error.message : String(error)}`,
      )
    })
  },
}

const providers: Record<string, OtpProvider> = {
  console: consoleOtpProvider,
  http: httpOtpProvider,
  mock: mockOtpProvider,
}

/** True when SMS gateway URL is unset — login uses the fixed mock code. */
export function isMockOtpMode(): boolean {
  const { provider, httpUrl } = otpConfig()
  if (provider === 'mock') return true
  if (provider === 'http' && !httpUrl) return true
  // Production default: empty http URL with leftover "console" → mock.
  if (provider === 'console' && !import.meta.dev) return true
  return false
}

export function resolveOtpProvider(): OtpProvider {
  const { provider, httpUrl } = otpConfig()

  if (provider === 'http' && httpUrl) return httpOtpProvider
  if (provider === 'http' && !httpUrl) return mockOtpProvider
  if (provider === 'mock') return mockOtpProvider
  if (provider === 'console' && !import.meta.dev) return mockOtpProvider

  const resolved = providers[provider]
  if (!resolved) {
    throw new OtpDeliveryError(
      `Unknown OTP provider "${provider}". Available: ${Object.keys(providers).join(', ')}.`,
      'OTP_PROVIDER_UNKNOWN',
    )
  }
  return resolved
}

export function otpSettings() {
  return otpConfig()
}
