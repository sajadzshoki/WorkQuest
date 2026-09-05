import type { H3Event } from 'h3'

import type { ApiErrorBody } from '#shared/types/api'

/**
 * Small helpers so every endpoint returns the same error envelope.
 * `code` is what the UI switches on; `message` is what the user reads.
 */
export function apiError(
  statusCode: number,
  code: string,
  message: string,
  data?: Partial<ApiErrorBody>,
) {
  return createError({
    statusCode,
    statusMessage: code,
    message,
    data: { code, ...data } satisfies Partial<ApiErrorBody>,
  })
}

export const errors = {
  unauthorized: (message = 'برای ادامه باید وارد شوید') => apiError(401, 'AUTH_REQUIRED', message),
  forbidden: (message = 'دسترسی لازم برای این بخش را ندارید') =>
    apiError(403, 'FORBIDDEN', message),
  notFound: (message = 'مورد درخواستی پیدا نشد') => apiError(404, 'NOT_FOUND', message),
  conflict: (message = 'این درخواست با وضعیت فعلی سازگار نیست') =>
    apiError(409, 'CONFLICT', message),
  tooManyRequests: (message = 'کمی بعد دوباره تلاش کنید') =>
    apiError(429, 'RATE_LIMITED', message),
  serviceUnavailable: (message = 'سرویس موقتا در دسترس نیست') =>
    apiError(503, 'SERVICE_UNAVAILABLE', message),
  badRequest: (code: string, message: string) => apiError(400, code, message),
}

/** Minimal structural type for a zod (or standard-schema) validator. */
export interface Validator<T> {
  safeParse(data: unknown):
    | { success: true, data: T }
    | { success: false, error: { issues: Array<{ path: ReadonlyArray<PropertyKey>, message: string }> } }
}

/** Validate a JSON request body and return the parsed value. */
export async function readValidated<T>(event: H3Event, schema: Validator<T>): Promise<T> {
  const body = await readBody(event).catch(() => ({}))
  return parseWithSchema(body, schema)
}

/** Validate a query string and return the parsed value. */
export function readValidatedQuery<T>(event: H3Event, schema: Validator<T>): T {
  return parseWithSchema(getQuery(event), schema)
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Read a route parameter that has to be a uuid.
 *
 * Passing a hand-typed id straight to Prisma produces a client validation error,
 * which the error handler can only report as a 500 — a server error for what is
 * plainly a bad request. Checking here turns `/api/rewards/not-a-uuid` into a
 * clean 404, and keeps an id-shaped string out of the query layer entirely.
 */
export function requireUuidParam(event: H3Event, name: string, message: string): string {
  const value = getRouterParam(event, name)
  if (!value || !UUID_PATTERN.test(value)) throw errors.notFound(message)
  return value
}

function parseWithSchema<T>(input: unknown, schema: Validator<T>): T {
  const result = schema.safeParse(input)
  if (result.success) return result.data

  const issues = result.error.issues.map(issue => ({
    path: issue.path.join('.') || '_',
    message: issue.message,
  }))

  throw apiError(422, 'VALIDATION_FAILED', 'اطلاعات وارد شده معتبر نیست', { issues })
}
