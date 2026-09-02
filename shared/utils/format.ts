/**
 * Locale-aware formatting helpers.
 *
 * Persian is the primary locale, so numbers default to Persian digits and dates
 * to the Persian calendar. Every helper takes an explicit BCP-47 tag so the same
 * code works once English is switched on.
 */

const DEFAULT_LOCALE = 'fa-IR'

export function numberLocale(locale?: string | null): string {
  if (!locale) return DEFAULT_LOCALE
  return locale.startsWith('fa') ? 'fa-IR' : locale
}

/** 1,234 -> ۱٬۲۳۴ in Persian, 1,234 in English. */
export function formatNumber(value: number, locale?: string | null, digits = 0): string {
  return new Intl.NumberFormat(numberLocale(locale), {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value)
}

/** Compact form for tight UI (leaderboards): ۱٫۲هزار / 1.2K. */
export function formatCompactNumber(value: number, locale?: string | null): string {
  return new Intl.NumberFormat(numberLocale(locale), { notation: 'compact' }).format(value)
}

export function formatPercent(value: number, locale?: string | null): string {
  return new Intl.NumberFormat(numberLocale(locale), {
    style: 'percent',
    maximumFractionDigits: 0,
  }).format(value / 100)
}

/**
 * Date formatting. Persian locale implies the Persian calendar (`fa-IR-u-ca-persian`)
 * which is what Iranian users expect on dashboards.
 */
export function calendarLocale(locale?: string | null): string {
  if (!locale) return 'fa-IR-u-ca-persian'
  return locale.startsWith('fa') ? 'fa-IR-u-ca-persian' : locale
}

export function formatDate(
  value: Date | string | number,
  locale?: string | null,
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' },
): string {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat(calendarLocale(locale), options).format(date)
}

export function formatRelativeDate(value: Date | string | number, locale?: string | null): string {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.RelativeTimeFormat(numberLocale(locale), { numeric: 'auto' }).format(
    Math.round((date.getTime() - Date.now()) / 86_400_000),
    'day',
  )
}

/** Iranian mobile numbers, E.164. Accepts 09xxxxxxxxx and normalises to +98. */
export function normalizeIranianPhone(input: string): string | null {
  const trimmed = input.replace(/[\s\-()]/g, '')
  const match = /^(?:(\+98)|0)(9\d{9})$/.exec(trimmed)
  if (!match) return /^\+989\d{9}$/.test(trimmed) ? trimmed : null
  return `+98${match[2]}`
}

/** +989121234567 -> ۰۹۱۲ ۱۲۳ ۴۵۶۷ for display. */
export function formatPhone(phone: string, locale?: string | null): string {
  const digits = phone.replace(/\D/g, '').replace(/^98/, '0')
  const grouped = digits.replace(/^(\d{4})(\d{3})(\d{4})$/, '$1 $2 $3')
  return locale?.startsWith('en')
    ? grouped
    : grouped.replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[Number(d)] ?? d)
}
