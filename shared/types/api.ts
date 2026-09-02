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

/**
 * `POST /api/auth/otp/verify` — one of three outcomes.
 *
 * The order matters: an existing account always wins, then a pending
 * invitation, and self-service onboarding is the fallback. So a phone that was
 * invited cannot accidentally register a brand-new company instead of joining
 * the one that invited it.
 */
export type VerifyOtpResponse
  = | { status: 'authenticated', user: UserSummary, company: CompanySummary }
    | {
      status: 'invitation_pending'
      /** Display-formatted, already normalised to E.164 on the server. */
      phone: string
      /** ISO instant after which the invitation ticket stops working. */
      expiresAt: string
      /** How many companies are waiting on this phone — usually one. */
      invitationCount: number
    }
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

// ---------------------------------------------------------------------------
// People & teams
// ---------------------------------------------------------------------------

export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'REVOKED' | 'EXPIRED'
export type TeamRole = 'LEAD' | 'MEMBER'
/** `UserStatus` in the Prisma schema. `INVITED` is unused: pending invites live
 *  in `Invitation`, not in half-created user rows. */
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED'

/** A company member as the people pages see them. */
export interface MemberSummary {
  id: string
  fullName: string
  phone: string
  email: string | null
  avatarUrl: string | null
  jobTitle: string | null
  role: Role
  status: UserStatus
  lastLoginAt: string | null
  team: { id: string, name: string, slug: string } | null
  /** Direct manager inside their team, when one is set. */
  manager: { id: string, fullName: string } | null
  /** Team-level role (LEAD / MEMBER). */
  teamRole: TeamRole | null
  /** Number of teams the manager scopes over — used for the "subordinates" hint. */
  subordinateCount: number
}

export interface MemberListResponse {
  members: MemberSummary[]
  total: number
  page: number
  pageSize: number
  /** `mine` for MANAGER/EMPLOYEE, `all` for OWNER/ADMIN. */
  scope: 'mine' | 'all'
  /** Role changes are OWNER/ADMIN only — drives the UI affordances. */
  canManageRoles: boolean
}

export interface MemberDetail extends MemberSummary {
  createdAt: string
  /** Gamification snapshot — null until the member has any progress. */
  progress: {
    xp: number
    coins: number
    currentStreak: number
    longestStreak: number
    level: { name: string, level: number, iconKey: string | null } | null
  } | null
  achievements: {
    name: string
    description: string | null
    iconKey: string | null
    unlockedAt: string
  }[]
  /** Performance summary for the current cycle. */
  performance: {
    assigned: number
    completed: number
    inReview: number
    overdue: number
  }
  /** Only present for managers/admins who may act on this member. */
  permissions: { canEdit: boolean, canChangeRole: boolean, canRemove: boolean }
}

export interface MemberDetailResponse {
  member: MemberDetail
}

export interface InvitationSummary {
  id: string
  fullName: string
  phone: string
  jobTitle: string | null
  role: Role
  status: InvitationStatus
  team: { id: string, name: string } | null
  invitedBy: { id: string, fullName: string }
  expiresAt: string
  acceptedAt: string | null
  acceptedBy: { id: string, fullName: string } | null
  createdAt: string
}

export interface InvitationListResponse {
  invitations: InvitationSummary[]
  total: number
  page: number
  pageSize: number
  /** The current user can revoke — OWNER/ADMIN, or the inviter. */
  canRevoke: boolean
}

export interface InvitationDetail {
  id: string
  company: { id: string, name: string, slug: string, logoUrl: string | null }
  fullName: string
  jobTitle: string | null
  phone: string
  role: Role
  team: { id: string, name: string } | null
  expiresAt: string
  status: InvitationStatus
}

/** A pending invitation shown to the invitee right after OTP verification. */
export interface PendingInvitationResponse {
  status: 'invitation_pending'
  invitation: InvitationDetail
}

export interface TeamSummary {
  id: string
  name: string
  slug: string
  description: string | null
  memberCount: number
  lead: { id: string, fullName: string } | null
  createdAt: string
}

export interface TeamDetail {
  id: string
  name: string
  slug: string
  description: string | null
  lead: { id: string, fullName: string } | null
  members: {
    id: string
    userId: string
    fullName: string
    jobTitle: string | null
    avatarUrl: string | null
    /** Team-level role (LEAD / MEMBER). */
    role: TeamRole
    /** Company role — a lead must be at least MANAGER, so the UI needs it. */
    companyRole: Role
    manager: { id: string, fullName: string } | null
    joinedAt: string
  }[]
  createdAt: string
}

export interface TeamDetailResponse {
  team: TeamDetail
  /** The current user may edit this team. */
  canEdit: boolean
  /** People who may be added — company members without a team. */
  candidates: { id: string, fullName: string, jobTitle: string | null }[]
}

/** `POST /api/auth/onboarding/accept-invitation` */
export interface AcceptInvitationResponse {
  status: 'authenticated'
  user: UserSummary
  company: CompanySummary
  invitation: {
    id: string
    fullName: string
    jobTitle: string | null
    role: Role
    team: { id: string, name: string } | null
  }
}
