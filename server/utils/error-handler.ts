import type { ApiErrorBody } from '#shared/types/api'
import type { H3Error, H3Event } from 'h3'

/**
 * One error shape for the whole API.
 *
 * Registered through `nitro.errorHandler`. Nitro only treats the response as
 * finished once the event is marked handled, so the body is written with
 * `send()` rather than returned — otherwise the default handler would run and
 * leak a stack trace.
 */
export default function errorHandler(error: H3Error, event: H3Event) {
  const statusCode = error.statusCode && error.statusCode >= 400 ? error.statusCode : 500
  const data = (error.data ?? {}) as Partial<ApiErrorBody>

  const code
    = data.code
      ?? error.statusMessage
      ?? (statusCode >= 500 ? 'INTERNAL_ERROR' : 'ERROR')

  const message
    = data.message
      ?? (statusCode >= 500
        ? 'خطای غیرمنتظره در سرور رخ داد'
        : (error.message || 'درخواست ناموفق بود'))

  if (statusCode >= 500) {
    console.error(`[workquest] ${event.method} ${event.path} failed`, error)
  }

  const body: ApiErrorBody = {
    statusCode,
    code,
    message,
    ...(data.issues ? { issues: data.issues } : {}),
  }

  setResponseStatus(event, statusCode)

  return send(event, JSON.stringify(body), 'application/json; charset=utf-8')
}
