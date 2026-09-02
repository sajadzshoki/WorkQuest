import { describe, expect, it } from 'vitest'

import { formatNumber, formatPhone, normalizeIranianPhone } from '#shared/utils/format'

describe('number formatting', () => {
  it('uses Persian digits for the fa locale', () => {
    expect(formatNumber(1234, 'fa')).toContain('۱')
    expect(formatNumber(1234, 'fa')).not.toContain('1')
  })

  it('uses Latin digits for en', () => {
    expect(formatNumber(1234, 'en')).toBe('1,234')
  })
})

describe('phone handling', () => {
  it('normalises Iranian numbers to E.164', () => {
    expect(normalizeIranianPhone('09121234567')).toBe('+989121234567')
    expect(normalizeIranianPhone('+989121234567')).toBe('+989121234567')
    expect(normalizeIranianPhone('0912 123 4567')).toBe('+989121234567')
  })

  it('rejects anything that is not an Iranian mobile number', () => {
    expect(normalizeIranianPhone('12345')).toBeNull()
    expect(normalizeIranianPhone('02112345678')).toBeNull()
  })

  it('renders grouped digits per locale', () => {
    expect(formatPhone('+989121234567', 'en')).toBe('0912 123 4567')
    expect(formatPhone('+989121234567', 'fa')).toBe('۰۹۱۲ ۱۲۳ ۴۵۶۷')
  })
})
