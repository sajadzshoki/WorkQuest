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
