import { randomBytes, randomInt, scryptSync, timingSafeEqual } from 'node:crypto'

/**
 * OTP codes are stored as salted scrypt digests. The plaintext only ever exists
 * in the delivery channel and in this process's memory.
 */
export function generateOtpCode(length: number): string {
  const safeLength = Math.min(8, Math.max(4, Math.floor(length) || 6))
  const max = 10 ** safeLength
  return String(randomInt(0, max)).padStart(safeLength, '0')
}

export function hashOtpCode(code: string): string {
  const salt = randomBytes(16).toString('hex')
  const digest = scryptSync(code, salt, 64).toString('hex')
  return `${salt}:${digest}`
}

export function verifyOtpCode(code: string, stored: string): boolean {
  const [salt, digest] = stored.split(':')
  if (!salt || !digest) return false

  const candidate = scryptSync(code, salt, 64)
  const expected = Buffer.from(digest, 'hex')
  if (candidate.length !== expected.length) return false

  return timingSafeEqual(candidate, expected)
}
