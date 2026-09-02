import { describe, expect, it } from 'vitest'

import { generateOtpCode, hashOtpCode, verifyOtpCode } from '../server/utils/crypto'

describe('generateOtpCode', () => {
  it('returns exactly the requested number of digits', () => {
    for (const length of [4, 5, 6, 7, 8]) {
      expect(generateOtpCode(length)).toMatch(new RegExp(`^\\d{${length}}$`))
    }
  })

  it('zero-pads short codes so the length is stable', () => {
    // Six digits means one in a million codes starts with a zero; generate
    // enough to hit one and assert it is padded rather than truncated.
    const codes = Array.from({ length: 4000 }, () => generateOtpCode(6))
    expect(codes.every(code => code.length === 6)).toBe(true)
    expect(codes.some(code => code.startsWith('0'))).toBe(true)
  })

  it('clamps an out-of-range length instead of producing a giant code', () => {
    expect(generateOtpCode(2)).toMatch(/^\d{4}$/)
    expect(generateOtpCode(99)).toMatch(/^\d{8}$/)
    expect(generateOtpCode(Number.NaN)).toMatch(/^\d{6}$/)
  })

  it('does not repeat itself across a batch', () => {
    const codes = new Set(Array.from({ length: 2000 }, () => generateOtpCode(8)))
    expect(codes.size).toBe(2000)
  })
})

describe('hashOtpCode', () => {
  it('stores a salt and a digest, never the code itself', () => {
    const stored = hashOtpCode('123456')
    const [salt, digest] = stored.split(':')

    expect(stored).not.toContain('123456')
    expect(salt).toHaveLength(32)
    expect(digest).toHaveLength(128)
  })

  it('salts every hash so equal codes produce different digests', () => {
    expect(hashOtpCode('123456')).not.toBe(hashOtpCode('123456'))
  })
})

describe('verifyOtpCode', () => {
  it('accepts the code that was hashed', () => {
    expect(verifyOtpCode('424242', hashOtpCode('424242'))).toBe(true)
  })

  it('rejects a wrong code', () => {
    const stored = hashOtpCode('424242')
    expect(verifyOtpCode('424243', stored)).toBe(false)
    expect(verifyOtpCode('000000', stored)).toBe(false)
  })

  it('rejects a code that is a prefix or suffix of the real one', () => {
    const stored = hashOtpCode('123456')
    expect(verifyOtpCode('12345', stored)).toBe(false)
    expect(verifyOtpCode('1234567', stored)).toBe(false)
  })

  it.each(['', ':', 'salt', 'nothex:nothex', '::', 'zz:zz'])(
    'returns false rather than throwing on the malformed digest %j',
    (stored) => {
      expect(verifyOtpCode('123456', stored)).toBe(false)
    },
  )
})
