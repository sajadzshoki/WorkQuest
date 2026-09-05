import type {
  ChallengeGoalKey,
  ChallengeStatus,
  ChallengeType,
  ParticipantStatus,
} from '../utils/challenges'
import type {
  LeaderboardPeriod,
  LeaderboardScope,
  SeriesBucket as LeaderboardSeriesBucket,
} from '../utils/leaderboard'
import type { CatalogStatus, RewardStanding, RewardType } from '../utils/marketplace'
import type { Role } from '../utils/permissions'
import type { ReviewDecision, TaskPriority, TaskStatus } from '../utils/task'

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
  badges: {
    id: string
    name: string
    description: string | null
    iconKey: string | null
    tone: string | null
    imageUrl: string | null
    awardedAt: string
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

// ---------------------------------------------------------------------------
// Tasks
// ---------------------------------------------------------------------------

/** A person as they appear on a task card. */
export interface TaskPerson {
  id: string
  fullName: string
  avatarUrl: string | null
  jobTitle?: string | null
}

/**
 * The task shape every endpoint returns.
 *
 * `isOverdue` is computed server-side on purpose: the browser's clock is not
 * trustworthy and the company timezone lives on the server, so letting the UI
 * decide would make the same task look late on one screen and not on another.
 */
export interface TaskSummary {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  progress: number
  estimatedHours: number | null
  dueDate: string | null
  isOverdue: boolean
  xpReward: number
  coinReward: number
  revisionCount: number
  assignedAt: string | null
  startedAt: string | null
  submittedAt: string | null
  completedAt: string | null
  createdAt: string
  updatedAt: string
  assignee: TaskPerson | null
  assigner: TaskPerson | null
  team: { id: string, name: string, slug: string } | null
  commentCount: number
  attachmentCount: number
}

export interface TaskComment {
  id: string
  body: string
  createdAt: string
  author: TaskPerson
}

export interface TaskAttachment {
  id: string
  fileName: string
  url: string
  mimeType: string | null
  sizeBytes: number | null
  createdAt: string
  uploadedBy: { id: string, fullName: string }
}

export interface TaskReviewEntry {
  id: string
  decision: ReviewDecision
  score: number | null
  feedback: string | null
  xpAwarded: number
  coinsAwarded: number
  createdAt: string
  reviewer: TaskPerson
}

export interface TaskEventEntry {
  id: string
  action: string
  fromStatus: TaskStatus | null
  toStatus: TaskStatus | null
  note: string | null
  createdAt: string
  actor: TaskPerson | null
}

/** `GET /api/tasks` */
export type TaskListResponse = Paginated<TaskSummary>

/** `GET /api/tasks/:id` */
export interface TaskDetailResponse {
  task: TaskSummary
  comments: TaskComment[]
  attachments: TaskAttachment[]
  reviews: TaskReviewEntry[]
  events: TaskEventEntry[]
  permissions: {
    /** The caller may edit / reassign this task. */
    canManage: boolean
    isAssignee: boolean
  }
}

/** Returned by every task mutation so the client can replace its state. */
export interface TaskMutationResponse {
  task: TaskSummary
}

export interface TeamCompletionRow {
  teamId: string
  teamName: string
  total: number
  approved: number
  /** 0-100. */
  rate: number
}

/** `GET /api/tasks/dashboard` */
export interface TaskDashboardResponse {
  employee: {
    today: TaskSummary[]
    active: TaskSummary[]
    pendingSubmissions: TaskSummary[]
    completed: TaskSummary[]
    upcomingDeadlines: TaskSummary[]
    counts: {
      today: number
      active: number
      pendingSubmissions: number
      completed: number
      overdue: number
      total: number
      completionRate: number
    }
  }
  /** Null for callers who cannot review — an employee has no manager view. */
  manager: {
    active: TaskSummary[]
    pendingReviews: TaskSummary[]
    overdue: TaskSummary[]
    counts: {
      active: number
      pendingReviews: number
      overdue: number
      total: number
      approved: number
      completionRate: number
    }
    teamCompletion: TeamCompletionRow[]
  } | null
}

// ---------------------------------------------------------------------------
// Leaderboards
// ---------------------------------------------------------------------------

/**
 * The window a board covers, as the client sees it.
 *
 * The window *is* the reset: nothing is deleted at the boundary, the board
 * simply starts counting from a new `startsAt`. `key` is stable inside the
 * period, so the UI can tell "same week" from "new week" without a clock.
 */
export interface LeaderboardWindowInfo {
  key: string
  startsAt: string
  endsAt: string
  /** Whole days left, rounded up; `0` once the window has closed. */
  endsInDays: number
}

/** A person on a board — no contact details, no manager, no team graph. */
export interface LeaderboardUser {
  id: string
  fullName: string
  avatarUrl: string | null
  jobTitle: string | null
  role: Role
}

/** One row of a board. */
export interface LeaderboardEntry {
  /** Competition rank — equal scores share it, the next one skips (1, 1, 3). */
  rank: number
  /** Somebody else shares this rank. */
  tied: boolean
  isMe: boolean
  user: LeaderboardUser
  /** Lifetime level and XP. These never reset; only the board does. */
  level: number
  levelTitle: string | null
  levelIconKey: string | null
  totalXp: number
  /** Scored inside this window. */
  score: number
  periodXp: number
  performanceXp: number
  achievementXp: number
  achievementsUnlocked: number
  /** Most recent unlocks inside the window — the achievement indicators. */
  achievements: LeaderboardAchievementInfo[]
  currentStreak: number
}

export interface LeaderboardAchievementInfo {
  key: string | null
  title: string | null
  iconKey: string | null
  unlockedAt: string
}

/**
 * The caller's own position.
 *
 * `rank` is `null` when they have not scored in this window — the UI turns that
 * into an invitation, not a last place. `pointsToNextRank` carries no identity,
 * so it is safe to show to everybody.
 */
export interface LeaderboardMe {
  userId: string
  /**
   * Is the caller part of this board's population at all? False when a manager
   * opens a subordinate team's board they do not sit in — which reads as "you
   * are watching this team", not as "you scored nothing".
   */
  inScope: boolean
  rank: number | null
  score: number
  periodXp: number
  achievementsUnlocked: number
  pointsToNextRank: number | null
  /** True when the caller is already inside `entries`. */
  inEntries: boolean
}

/** A team the caller may open a board for. */
export interface LeaderboardTeamOption {
  id: string
  name: string
  slug: string
  memberCount: number
  isMember: boolean
  isLead: boolean
}

export interface LeaderboardScoringInfo {
  performanceXpWeight: number
  achievementXpWeight: number
  achievementUnlockBonus: number
  rankedSources: string[]
  unrankedSources: string[]
}

/** `GET /api/leaderboard`. */
export interface LeaderboardResponse {
  period: LeaderboardPeriod
  scope: LeaderboardScope
  window: LeaderboardWindowInfo
  /** Present for `scope=team`. */
  team: { id: string, name: string, slug: string } | null
  /** Teams this caller may switch to — their own, plus a manager's reports'. */
  availableTeams: LeaderboardTeamOption[]
  /** Top few rows only; never the whole company. */
  entries: LeaderboardEntry[]
  me: LeaderboardMe
  /** How many people scored in this window and scope. */
  participants: number
  /** The privacy ceiling, so the UI can state the rule it is following. */
  maxEntries: number
  scoring: LeaderboardScoringInfo
}

/** What somebody earned inside one window. */
export interface PeriodStats {
  score: number
  xp: number
  performanceXp: number
  achievementXp: number
  achievementsUnlocked: number
  achievements: LeaderboardAchievementInfo[]
}

/** One board period of the personal-progress view. */
export interface PersonalProgressPeriod {
  window: LeaderboardWindowInfo
  previousWindow: LeaderboardWindowInfo
  current: PeriodStats
  previous: PeriodStats
  delta: {
    score: number
    xp: number
    direction: 'up' | 'down' | 'flat'
  }
  /** `null` ranks mean "not on the board yet", never "last". */
  rank: {
    company: number | null
    team: number | null
    participants: number
  }
  previousRank: {
    company: number | null
    team: number | null
  }
  /** Places climbed since the previous window; positive is up. */
  movement: number | null
  pointsToNextRank: number | null
  /** Consecutive windows, oldest first — the sparkline. */
  series: LeaderboardSeriesBucket[]
}

/** `GET /api/leaderboard/progress`. */
export interface PersonalProgressResponse {
  /** Permanent totals: these never reset. */
  lifetime: {
    xp: number
    coins: number
    level: number
    levelTitle: string | null
    levelIconKey: string | null
    levelPercent: number
    levelCurrentXp: number
    levelNeededXp: number
    nextLevel: { level: number, minXp: number, title: string | null } | null
    currentStreak: number
    longestStreak: number
    achievementsUnlocked: number
    achievementsTotal: number
    badges: number
  }
  week: PersonalProgressPeriod
  month: PersonalProgressPeriod
  team: { id: string, name: string, slug: string } | null
}

// ---------------------------------------------------------------------------
// Reward marketplace
//
// Coins are spent here. Every type in this block is served by
// `/api/rewards*`; the arithmetic behind `standing` lives in
// `shared/utils/marketplace.ts` so a card that looks redeemable and an API that
// refuses it can never disagree.
// ---------------------------------------------------------------------------

/** A reward's own rules, as the company set them. */
export interface RewardRulesInfo {
  /** Simple/digital rewards skip the approval queue. */
  autoApprove: boolean
  /** Live redemptions one employee may hold; `null` is no cap. */
  maxPerUser: number | null
  /** Minimum level; `null` is everybody. */
  minLevel: number | null
  requiresNote: boolean
  availableFrom: string | null
  availableUntil: string | null
}

// `RedeemBlockCode` and `RewardStanding` are defined once, in
// `shared/utils/marketplace.ts`, next to the rules that produce them. They are
// imported rather than restated here so the API type and the pure type cannot
// drift — and so Nuxt's auto-import does not see the same name twice.

/** One shelf item, as an employee sees it. */
export interface RewardCatalogueItem {
  id: string
  title: string
  description: string | null
  type: RewardType
  coinCost: number
  /** `null` means unlimited. */
  stock: number | null
  imageUrl: string | null
  rules: RewardRulesInfo
  standing: RewardStanding
  /** How many more this employee may hold, or `null` for no cap. */
  remainingAllowance: number | null
  /** Live redemptions they already hold. */
  myLiveRedemptions: number
  /** Everything they have ever requested, whatever its status. */
  myTotalRedemptions: number
}

/** `GET /api/rewards` — the marketplace. */
export interface RewardCatalogueResponse {
  /** The wallet balance, which is what a spend decision is made against. */
  balance: number
  level: number
  items: RewardCatalogueItem[]
  /** The caller's own requests, newest first — never anybody else's. */
  redemptions: RedemptionSummary[]
  /** How many of each status they hold, for the filter chips. */
  counts: Record<string, number>
}

/** `GET /api/rewards/:id` — one reward, in full. */
export interface RewardDetailResponse {
  reward: RewardCatalogueItem
  /** Their history with this reward specifically. */
  redemptions: RedemptionSummary[]
}

/** One request, as its owner or an admin sees it. */
export interface RedemptionSummary {
  id: string
  status: string
  /** What was charged — a snapshot of the price at request time. */
  coinCost: number
  note: string | null
  decisionNote: string | null
  requestedAt: string
  decidedAt: string | null
  fulfilledAt: string | null
  /** Whether the coins were given back (rejected or cancelled). */
  refunded: boolean
  reward: { id: string, title: string, type: RewardType, imageUrl: string | null }
  /** Only populated for the admin queue; never on an employee's own list. */
  user?: { id: string, fullName: string, jobTitle: string | null, avatarUrl: string | null }
  /** The moves the caller is allowed to make from here — never an illegal one. */
  availableActions: string[]
  /** Whether *this* caller may cancel it themselves. */
  cancellable: boolean
}

/** `GET /api/rewards/redemptions` and `GET /api/rewards/admin/redemptions`. */
export type RedemptionListResponse = Paginated<RedemptionSummary>

/** `POST /api/rewards/:id/redeem`. */
export interface RedeemRewardResponse {
  redemption: RedemptionSummary
  /** Balance after the debit — or unchanged, when this was a replay. */
  balance: number
  /** False when an identical idempotency key had already been processed. */
  charged: boolean
  transactionId: string | null
}

/** `POST /api/rewards/admin/redemptions/:id`. */
export interface RedemptionDecisionResponse {
  redemption: RedemptionSummary
  /** The employee's balance afterwards, so a refund is visible immediately. */
  balance: number | null
  refunded: number
}

/** Item-level availability only: nothing here is about a particular employee. */
export interface RewardAvailability {
  available: boolean
  code: 'NOT_LISTED' | 'NOT_AVAILABLE_YET' | 'EXPIRED' | 'OUT_OF_STOCK' | null
}

/**
 * One shelf item, as an admin sees it: the full row plus the demand behind it.
 *
 * Deliberately *not* the employee shape — an admin list has no "can I afford
 * this?" column, and inventing one out of the admin's own wallet would be
 * meaningless. It reports availability, which is a fact about the reward.
 */
export interface RewardAdminItem {
  id: string
  title: string
  description: string | null
  type: RewardType
  coinCost: number
  stock: number | null
  imageUrl: string | null
  status: CatalogStatus
  rules: RewardRulesInfo
  availability: RewardAvailability
  createdAt: string
  updatedAt: string
  redemptions: {
    total: number
    pending: number
    approved: number
    fulfilled: number
    rejected: number
    cancelled: number
  }
  /** Coins this reward has taken out of circulation (debits minus refunds). */
  coinsCollected: number
}

/** `GET /api/rewards/admin` — the whole shelf, including what is not listed. */
export interface RewardAdminResponse {
  items: RewardAdminItem[]
  counts: Record<string, number>
  queue: { pending: number, approved: number }
}

/** `POST /api/rewards` and `PATCH /api/rewards/:id`. */
export interface RewardMutationResponse {
  reward: { id: string }
}

// ---------------------------------------------------------------------------
// Challenges
// ---------------------------------------------------------------------------

/** One enrolled member's standing in a challenge, as managers see it. */
export interface ChallengeParticipantSummary {
  id: string
  user: { id: string, fullName: string, avatarUrl: string | null, jobTitle: string | null }
  progress: number
  status: ParticipantStatus
  completedAt: string | null
  rewardedAt: string | null
}

export interface ChallengeSummary {
  id: string
  title: string
  description: string | null
  type: ChallengeType
  status: ChallengeStatus
  goalKey: ChallengeGoalKey
  goalValue: number
  /**
   * Live progress, computed by the engine from real application data. For a
   * TEAM challenge it is the team's aggregate; for an INDIVIDUAL challenge
   * the average of its participants. The caller's own number — the one their
   * bar shows — is `myParticipation.progress`.
   */
  progress: number
  startsAt: string
  endsAt: string
  xpReward: number
  coinReward: number
  badgeId: string | null
  team: { id: string, name: string, slug: string } | null
  participantsCount: number
  /** Participants who reached the goal (completed or already rewarded). */
  completersCount: number
  /** The caller's own row, when they are enrolled. */
  myParticipation: {
    progress: number
    status: ParticipantStatus
    completedAt: string | null
    rewardedAt: string | null
  } | null
  /** Editable while the challenge has not started; computed server-side. */
  editable: boolean
  cancellable: boolean
  /** The caller holds `challenge:manage` over this challenge's scope. */
  canManage: boolean
}

export interface ChallengeListResponse {
  items: ChallengeSummary[]
  /** Row counts per status, for the filter chips. */
  counts: Partial<Record<ChallengeStatus, number>>
}

export interface ChallengeDetailResponse {
  challenge: ChallengeSummary
  /**
   * The full roster with per-person progress. Only callers holding
   * `challenge:manage` (in scope) receive it; an employee gets an empty list
   * plus their own numbers in `challenge.myParticipation`.
   */
  participants: ChallengeParticipantSummary[]
}

export interface ChallengeMutationResponse {
  challenge: ChallengeSummary
}
