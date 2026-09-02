import type { Role } from '../utils/permissions'

/** Envelope used by every `/api/**` error response. */
export interface ApiErrorBody {
  statusCode: number
  /** Stable, machine-readable error code, e.g. `AUTH_INVALID_CODE`. */
  code: string
  /** Human readable message, matching the UI locale. */
  message: string
  /** Field errors when validation failed. */
  issues?: Array<{ path: string, message: string }>
}

/** The authenticated principal resolved by `server/middleware/1.auth-context.ts`. */
export interface AuthContext {
  userId: string
  /** Session id carried inside the JWT — enables server-side revocation. */
  sessionId: string
  companyId: string
  role: Role
  fullName: string
  email: string | null
  phone: string | null
  locale: string
  avatarUrl: string | null
  company: {
    id: string
    name: string
    slug: string
    locale: string
    timezone: string
  }
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

/** Payload returned by `GET /api/me` and cached by `useSession()`. */
export interface MeResponse {
  user: {
    id: string
    fullName: string
    email: string | null
    phone: string | null
    role: Role
    avatarUrl: string | null
    locale: string
  }
  company: {
    id: string
    name: string
    slug: string
    locale: string
    timezone: string
  }
  gamification: {
    xp: number
    coins: number
    level: number
    levelTitle: string | null
    levelPercent: number
    currentStreak: number
    longestStreak: number
  }
  unreadNotifications: number
}

// ---------------------------------------------------------------------------
// Authentication & onboarding
// ---------------------------------------------------------------------------

/** Company summary returned to the client — never more than UI-facing fields. */
export interface CompanySummary {
  id: string
  name: string
  slug: string
  logoUrl: string | null
  locale: string
  timezone: string
}

/** User summary returned to the client. */
export interface UserSummary {
  id: string
  fullName: string
  email: string | null
  phone: string | null
  role: Role
  avatarUrl: string | null
  locale: string
  jobTitle: string | null
}

/** `POST /api/auth/otp/request` */
export interface RequestOtpResponse {
  phone: string
  codeLength: number
  expiresAt: string
  resendAfterSeconds: number
  /** Delivery driver that handled the code — `console` only outside production. */
  provider: string
  purpose: 'LOGIN' | 'REGISTER'
  /**
   * Whether the phone already belongs to an active account.
   *
   * This is a deliberate trade-off: Iranian B2B users expect to be told which
   * flow applies, and the verify step would reveal it anyway via a 404. It is
   * the only existence signal the API exposes.
   */
  accountExists: boolean
}

/** `POST /api/auth/otp/verify` — either a session or an onboarding prompt. */
export type VerifyOtpResponse
  = | { status: 'authenticated', user: UserSummary, company: CompanySummary }
    | {
      status: 'onboarding_required'
      /** Display-formatted, already normalised to E.164 on the server. */
      phone: string
      /** ISO instant after which the onboarding ticket stops working. */
      expiresAt: string
    }

/**
 * `GET /api/auth/onboarding`.
 *
 * Resolved from the httpOnly onboarding cookie; the browser never holds the
 * ticket id, so there is nothing for script to steal.
 */
export interface OnboardingContext {
  phone: string
  expiresAt: string
  /** Seconds left on the ticket, so the UI can show a countdown. */
  expiresIn: number
}

/** `POST /api/auth/onboarding/complete` */
export interface CompleteOnboardingResponse {
  status: 'authenticated'
  user: UserSummary
  company: CompanySummary
}

/** `GET /api/companies/slug?slug=…` */
export interface SlugAvailabilityResponse {
  slug: string
  available: boolean
  /** Present when the requested slug was taken: the server's free suggestion. */
  suggestion?: string
}
