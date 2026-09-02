import {
  formatCompactNumber,
  formatDate,
  formatNumber,
  formatPercent,
  formatPhone,
  formatRelativeDate,
} from '#shared/utils/format'

/**
 * Locale-bound formatters. Persian output uses Persian digits and the Persian
 * calendar automatically; switching the locale to English switches both.
 */
export function useLocaleFormat() {
  const { locale } = useI18n()

  return {
    number: (value: number, digits = 0) => formatNumber(value, locale.value, digits),
    compact: (value: number) => formatCompactNumber(value, locale.value),
    percent: (value: number) => formatPercent(value, locale.value),
    date: (value: Date | string | number, options?: Intl.DateTimeFormatOptions) =>
      formatDate(value, locale.value, options),
    shortDate: (value: Date | string | number) =>
      formatDate(value, locale.value, { month: 'short', day: 'numeric' }),
    relative: (value: Date | string | number) => formatRelativeDate(value, locale.value),
    phone: (value: string) => formatPhone(value, locale.value),
  }
}
