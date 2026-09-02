import { describe, expect, it } from 'vitest'

import { DEFAULT_LEVELS, SUPPORTED_LOCALES, SUPPORTED_TIMEZONES } from '#shared/constants'
import {
  completeOnboardingSchema,
  onboardingCompanySchema,
  onboardingProfileSchema,
  requestOtpSchema,
  slugQuerySchema,
  verifyOtpSchema,
} from '#shared/schemas'
import { slugify } from '#shared/utils/format'

describe('requestOtpSchema', () => {
  it('defaults the purpose to LOGIN so existing clients keep working', () => {
    expect(requestOtpSchema.parse({ phone: '09121234567' }).purpose).toBe('LOGIN')
  })

  it('accepts an explicit REGISTER purpose', () => {
    expect(requestOtpSchema.parse({ phone: '09121234567', purpose: 'REGISTER' }).purpose)
      .toBe('REGISTER')
  })

  it('rejects an unknown purpose', () => {
    expect(requestOtpSchema.safeParse({ phone: '09121234567', purpose: 'ADMIN' }).success).toBe(false)
  })
})

describe('verifyOtpSchema', () => {
  it('accepts a 6 digit code', () => {
    expect(verifyOtpSchema.safeParse({ phone: '09121234567', code: '123456' }).success).toBe(true)
  })

  it.each(['12a456', '12 456', '123', '123456789', ''])(
    'rejects the malformed code %s',
    (code) => {
      expect(verifyOtpSchema.safeParse({ phone: '09121234567', code }).success).toBe(false)
    },
  )
})

describe('onboardingProfileSchema', () => {
  it('requires a name of at least three characters', () => {
    expect(onboardingProfileSchema.safeParse({ fullName: 'سی' }).success).toBe(false)
    expect(onboardingProfileSchema.safeParse({ fullName: 'ساینا رستمی' }).success).toBe(true)
  })

  it('treats a blank job title as absent', () => {
    const parsed = onboardingProfileSchema.parse({ fullName: 'ساینا رستمی', jobTitle: '   ' })
    expect(parsed.jobTitle).toBe('')
  })
})

describe('onboardingCompanySchema', () => {
  it('defaults the timezone and locale to the Persian-first values', () => {
    const parsed = onboardingCompanySchema.parse({ companyName: 'نواندیشان پایا' })
    expect(parsed.timezone).toBe('Asia/Tehran')
    expect(parsed.locale).toBe('fa')
  })

  it.each(SUPPORTED_TIMEZONES)('accepts the supported timezone %s', (timezone) => {
    expect(onboardingCompanySchema.safeParse({ companyName: 'شرکت', timezone }).success).toBe(true)
  })

  it.each(SUPPORTED_LOCALES)('accepts the supported locale %s', (locale) => {
    expect(onboardingCompanySchema.safeParse({ companyName: 'شرکت', locale }).success).toBe(true)
  })

  it('rejects a slug with characters that cannot appear in a URL path', () => {
    expect(onboardingCompanySchema.safeParse({ companyName: 'شرکت', slug: 'My Company' }).success)
      .toBe(false)
    expect(onboardingCompanySchema.safeParse({ companyName: 'شرکت', slug: 'شرکت' }).success)
      .toBe(false)
    expect(onboardingCompanySchema.safeParse({ companyName: 'شرکت', slug: 'my-company' }).success)
      .toBe(true)
  })

  it('rejects a logo URL that is not a URL', () => {
    expect(onboardingCompanySchema.safeParse({ companyName: 'شرکت', logoUrl: 'not a url' }).success)
      .toBe(false)
  })
})

describe('completeOnboardingSchema', () => {
  it('merges the profile and company halves', () => {
    const result = completeOnboardingSchema.safeParse({
      fullName: 'ساینا رستمی',
      companyName: 'نواندیشان پایا',
    })
    expect(result.success).toBe(true)
    expect(result.success && result.data.timezone).toBe('Asia/Tehran')
  })

  it('fails when either half is missing', () => {
    expect(completeOnboardingSchema.safeParse({ fullName: 'ساینا رستمی' }).success).toBe(false)
    expect(completeOnboardingSchema.safeParse({ companyName: 'نواندیشان' }).success).toBe(false)
  })

  it('reports which field failed so the UI can point at it', () => {
    const result = completeOnboardingSchema.safeParse({ fullName: 'ساینا رستمی', companyName: '' })
    expect(result.success).toBe(false)
    if (result.success) return
    expect(result.error.issues.map(issue => issue.path.join('.'))).toContain('companyName')
  })
})

describe('slugQuerySchema', () => {
  it('requires a non-empty slug', () => {
    expect(slugQuerySchema.safeParse({ slug: '' }).success).toBe(false)
    expect(slugQuerySchema.safeParse({ slug: 'acme' }).success).toBe(true)
  })
})

describe('slugify', () => {
  it('transliterates Persian names into an ASCII slug', () => {
    expect(slugify('نواندیشان پایا')).toBe('nvandishan-paya')
    expect(slugify('گروه صنعتی پارس')).toBe('groh-snati-pars')
  })

  it('breaks up consonant clusters that Persian spelling leaves behind', () => {
    // «شرکت» has no written vowels; the result must still be pronounceable.
    expect(slugify('شرکت')).toBe('sharakat')
  })

  it('keeps Latin names as lower-cased, dash-separated slugs', () => {
    expect(slugify('ACME Corp')).toBe('acme-corp')
  })

  it('keeps digits and converts Persian digits to ASCII', () => {
    expect(slugify('شرکت ۲۴ ساعت')).toBe('sharakat-24-sat')
  })

  it('trims, collapses separators and returns empty for unusable input', () => {
    expect(slugify('  سلام   دنیا  ')).toBe('slam-danaya')
    expect(slugify('!!!')).toBe('')
    expect(slugify('   ')).toBe('')
  })

  it('never emits a leading, trailing or doubled dash', () => {
    for (const input of ['---', 'a---b', '  a  ', '!a!']) {
      const slug = slugify(input)
      expect(slug).not.toMatch(/^-|-$/)
      expect(slug).not.toMatch(/--/)
    }
  })

  it('caps the slug at 60 characters', () => {
    expect(slugify('الف'.repeat(200)).length).toBeLessThanOrEqual(60)
  })
})

describe('DEFAULT_LEVELS', () => {
  it('starts at zero XP so a new employee resolves to level 1', () => {
    expect(DEFAULT_LEVELS[0]?.minXp).toBe(0)
    expect(DEFAULT_LEVELS[0]?.level).toBe(1)
  })

  it('has ascending levels and thresholds', () => {
    for (let index = 1; index < DEFAULT_LEVELS.length; index += 1) {
      const previous = DEFAULT_LEVELS[index - 1]!
      const current = DEFAULT_LEVELS[index]!
      expect(current.level).toBeGreaterThan(previous.level)
      expect(current.minXp).toBeGreaterThan(previous.minXp)
    }
  })

  it('gives every level a title and an icon', () => {
    for (const level of DEFAULT_LEVELS) {
      expect(level.title.length).toBeGreaterThan(0)
      expect(level.iconKey.startsWith('i-heroicons-')).toBe(true)
    }
  })
})
