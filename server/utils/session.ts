import { SignJWT, jwtVerify } from 'jose'

import type { Role } from '#shared/utils/permissions'
import type { H3Event } from 'h3'

export interface SessionClaims {
  /** User id. */
  sub: string
  /** Session row id — allows revocation without invalidating every token. */
  sid: string
  cid: string
  role: Role
}

function sessionConfig() {
  const config = useRuntimeConfig()
  return {
    secret: String(config.sessionSecret ?? ''),
    issuer: String(config.sessionIssuer ?? 'workquest'),
    cookieName: String(config.sessionCookieName ?? 'workquest_session'),
    maxAgeSeconds: Number(config.sessionMaxAgeSeconds ?? 60 * 60 * 24 * 7),
    renewThresholdSeconds: Number(config.sessionRenewThresholdSeconds ?? 60 * 60 * 24),
    secure: String(config.secureCookies ?? 'true') !== 'false',
  }
}

function signingKey(): Uint8Array {
  const { secret } = sessionConfig()
  if (secret.length < 32) {
    throw new Error(
      'WorkQuest: NUXT_SESSION_SECRET must be at least 32 characters. Generate one with `openssl rand -base64 48`.',
    )
  }
  return new TextEncoder().encode(secret)
}

export async function signSessionToken(claims: SessionClaims): Promise<string> {
  const { issuer, maxAgeSeconds } = sessionConfig()
  const now = Math.floor(Date.now() / 1000)

  return new SignJWT({ cid: claims.cid, role: claims.role })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setSubject(claims.sub)
    .setJti(claims.sid)
    .setIssuer(issuer)
    .setIssuedAt(now)
    .setNotBefore(now)
    .setExpirationTime(now + maxAgeSeconds)
    .sign(signingKey())
}

export async function verifySessionToken(token: string): Promise<SessionClaims | null> {
  const { issuer } = sessionConfig()
  try {
    const { payload } = await jwtVerify(token, signingKey(), { issuer })
    if (!payload.sub || !payload.jti) return null
    return {
      sub: payload.sub,
      sid: payload.jti,
      cid: String(payload.cid ?? ''),
      role: String(payload.role ?? 'EMPLOYEE') as Role,
    }
  }
  catch {
    return null
  }
}

export function readSessionToken(event: H3Event): string | undefined {
  const { cookieName } = sessionConfig()
  const value = getCookie(event, cookieName)
  return value && value.length > 0 ? value : undefined
}

export function setSessionCookie(event: H3Event, token: string): void {
  const { cookieName, maxAgeSeconds, secure } = sessionConfig()
  setCookie(event, cookieName, token, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: maxAgeSeconds,
  })
}

export function clearSessionCookie(event: H3Event): void {
  const { cookieName, secure } = sessionConfig()
  deleteCookie(event, cookieName, { httpOnly: true, secure, sameSite: 'lax', path: '/' })
}

/** True when the token expires within the renewal window. */
export function tokenNeedsRenewal(token: string): boolean {
  const { renewThresholdSeconds } = sessionConfig()
  const payload = token.split('.')[1]
  if (!payload) return false
  try {
    const claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      exp?: number
    }
    if (!claims.exp) return true
    return claims.exp - Date.now() / 1000 < renewThresholdSeconds
  }
  catch {
    return false
  }
}
