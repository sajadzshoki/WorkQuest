import { z } from 'zod'

import { SUPPORTED_LOCALES, SUPPORTED_TIMEZONES } from '../constants'
import {
  CHALLENGE_GOAL_KEYS,
  CHALLENGE_GOALS,
  CHALLENGE_STATUSES,
  CHALLENGE_TYPES,
  GOAL_BOUNDS,
  goalAllowedFor,
  validateWindow,
  type ChallengeGoalKey,
  type ChallengeType,
} from '../utils/challenges'
import {
  LEADERBOARD_PERIODS,
  LEADERBOARD_SCOPES,
  MAX_LEADERBOARD_ENTRIES,
  PODIUM_SIZE,
  PROGRESS_MONTH_HISTORY,
  PROGRESS_WEEK_HISTORY,
} from '../utils/leaderboard'
import {
  CATALOG_STATUSES,
  REDEMPTION_ACTIONS,
  REDEMPTION_STATUSES,
  REWARD_TYPES,
} from '../utils/marketplace'
import { TASK_ACTIONS, TASK_PRIORITIES, TASK_STATUSES } from '../utils/task'

/**
 * Every request body/query crossing the client-server boundary is described here
 * so client and server share one source of truth.
 */

const phoneSchema = z
  .string()
  .trim()
  .min(10)
  .max(20)
  .refine(value => /^\+?[0-9]{10,15}$/.test(value.replace(/[\s\-()]/g, '')), {
    message: 'شماره موبایل معتبر نیست',
  })

/** What an OTP was requested for. Codes are bound to it server-side. */
export const otpPurposeSchema = z.enum(['LOGIN', 'REGISTER'])
export type OtpPurposeInput = z.infer<typeof otpPurposeSchema>

export const requestOtpSchema = z.object({
  phone: phoneSchema,
  purpose: otpPurposeSchema.default('LOGIN'),
})
export type RequestOtpInput = z.infer<typeof requestOtpSchema>

export const verifyOtpSchema = z.object({
  phone: phoneSchema,
  /** 4-8 digit numeric code; length is enforced again by config on the server. */
  code: z.string().trim().regex(/^\d{4,8}$/, 'کد وارد شده معتبر نیست'),
})
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>

/**
 * Step 1 of onboarding — who the founder is.
 *
 * Kept as its own schema so the client can validate the profile form on its own
 * and the server can reuse it inside the final submit.
 */
export const onboardingProfileSchema = z.object({
  fullName: z.string().trim().min(3, 'نام و نام خانوادگی را کامل وارد کنید').max(80),
  jobTitle: z.string().trim().max(80).optional().or(z.literal('')),
})
export type OnboardingProfileInput = z.infer<typeof onboardingProfileSchema>

/**
 * Step 2 of onboarding — the company being created.
 *
 * `slug` is optional on the wire: when omitted the server derives it from the
 * name and guarantees uniqueness, so a founder who does not care about URLs is
 * never blocked by this field.
 */
export const onboardingCompanySchema = z.object({
  companyName: z.string().trim().min(2, 'نام شرکت را وارد کنید').max(120),
  slug: z
    .string()
    .trim()
    .max(60)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'آدرس شرکت فقط می‌تواند شامل حروف کوچک انگلیسی، عدد و خط تیره باشد')
    .optional()
    .or(z.literal('')),
  industry: z.string().trim().max(80).optional().or(z.literal('')),
  logoUrl: z.string().trim().url('آدرس لوگو معتبر نیست').max(500).optional().or(z.literal('')),
  timezone: z.enum(SUPPORTED_TIMEZONES).default('Asia/Tehran'),
  locale: z.enum(SUPPORTED_LOCALES).default('fa'),
})
export type OnboardingCompanyInput = z.infer<typeof onboardingCompanySchema>

/**
 * `PATCH /api/companies` — the editable slice of the company profile.
 *
 * Only the display name for now: the slug is the tenant's public address
 * (changing it would break every shared link), and timezone/locale are set
 * during onboarding on purpose — silently re-basing every streak and cycle
 * calendar from a settings form is the kind of "small edit" that corrupts
 * history, so it stays a deliberate, operational change if ever needed.
 */
export const updateCompanySchema = z.object({
  name: z.string().trim().min(2, 'نام شرکت را وارد کنید').max(120),
})
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>

/**
 * The single submit that creates the company.
 *
 * The profile and company halves are re-validated here even though the client
 * already checked them — the server is the only place that has to be right.
 */
export const completeOnboardingSchema = onboardingProfileSchema.merge(onboardingCompanySchema)
export type CompleteOnboardingInput = z.infer<typeof completeOnboardingSchema>

/** `GET /api/companies/slug` — live availability check for the company form. */
export const slugQuerySchema = z.object({
  slug: z.string().trim().min(1).max(60),
})
export type SlugQueryInput = z.infer<typeof slugQuerySchema>

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
})
export type PaginationInput = z.infer<typeof paginationSchema>

export const taskFilterSchema = paginationSchema.extend({
  status: z.enum(TASK_STATUSES).optional(),
  priority: z.enum(TASK_PRIORITIES).optional(),
  teamId: z.string().uuid('تیم انتخاب‌شده معتبر نیست').optional(),
  assigneeId: z.string().uuid('کاربر انتخاب‌شده معتبر نیست').optional(),
  search: z.string().trim().max(120).optional(),
  /** Narrow to work that is late — the manager dashboard's headline filter. */
  overdue: z
    .union([z.boolean(), z.enum(['true', 'false'])])
    .transform(value => value === true || value === 'true')
    .optional(),
  scope: z.enum(['mine', 'team', 'all']).default('mine'),
  sort: z.enum(['dueDate', 'priority', 'createdAt', 'status']).default('dueDate'),
})
export type TaskFilterInput = z.infer<typeof taskFilterSchema>

// ---------------------------------------------------------------------------
// Leaderboards
// ---------------------------------------------------------------------------

/**
 * `GET /api/leaderboard`.
 *
 * There is no `'all'` period on purpose: the product has no permanent
 * all-time board, so a client cannot ask for one and the server cannot serve
 * one by accident. `limit` is capped at the privacy ceiling rather than at a
 * pagination size — a board is the top few rows plus your own, never a list of
 * everybody.
 */
export const leaderboardQuerySchema = z.object({
  period: z.enum(LEADERBOARD_PERIODS).default('week'),
  scope: z.enum(LEADERBOARD_SCOPES).default('company'),
  /** Required-in-effect for `scope=team`; defaults to the caller's own team. */
  teamId: z.string().uuid('تیم انتخاب‌شده معتبر نیست').optional(),
  limit: z.coerce.number().int().min(PODIUM_SIZE).max(MAX_LEADERBOARD_ENTRIES).default(MAX_LEADERBOARD_ENTRIES),
})
export type LeaderboardQueryInput = z.infer<typeof leaderboardQuerySchema>

/**
 * `GET /api/leaderboard/progress` — the caller's own trajectory.
 *
 * No subject parameter exists: this endpoint only ever answers about the
 * authenticated user, so there is nothing to authorise beyond being signed in.
 */
export const leaderboardProgressQuerySchema = z.object({
  weeks: z.coerce.number().int().min(2).max(PROGRESS_WEEK_HISTORY).default(PROGRESS_WEEK_HISTORY),
  months: z.coerce.number().int().min(2).max(PROGRESS_MONTH_HISTORY).default(PROGRESS_MONTH_HISTORY),
})
export type LeaderboardProgressQueryInput = z.infer<typeof leaderboardProgressQuerySchema>

// ---------------------------------------------------------------------------
// People & teams
// ---------------------------------------------------------------------------

const jobTitleSchema = z.string().trim().max(80).optional().or(z.literal(''))

/** `POST /api/members/invite` — an admin or manager invites an employee. */
export const inviteMemberSchema = z.object({
  phone: phoneSchema,
  fullName: z.string().trim().min(3, 'نام و نام خانوادگی را کامل وارد کنید').max(80),
  jobTitle: jobTitleSchema,
  teamId: z.string().uuid('تیم انتخاب‌شده معتبر نیست').optional().or(z.literal('')),
  role: z.enum(['ADMIN', 'MANAGER', 'EMPLOYEE']).default('EMPLOYEE'),
  /** Days the invitation stays open; capped again on the server. */
  expiresInDays: z.coerce.number().int().min(1).max(30).default(7),
})
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>

/**
 * `PATCH /api/members/:id`.
 *
 * Everything is optional because the endpoint serves several distinct actions
 * (rename, retitle, move team, change role, suspend). `role` and `status` are
 * additionally gated to OWNER/ADMIN in the handler — a MANAGER can move people
 * between their teams but never promote anyone.
 */
export const updateMemberSchema = z.object({
  fullName: z.string().trim().min(3).max(80).optional(),
  jobTitle: jobTitleSchema,
  role: z.enum(['OWNER', 'ADMIN', 'MANAGER', 'EMPLOYEE']).optional(),
  status: z.enum(['ACTIVE', 'SUSPENDED', 'DEACTIVATED']).optional(),
  teamId: z.string().uuid('تیم انتخاب‌شده معتبر نیست').optional().or(z.literal('')),
  /** Direct manager inside the team — the manager-scope edge. */
  managerId: z.string().uuid('مدیر انتخاب‌شده معتبر نیست').optional().or(z.literal('')),
})
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>

/** `GET /api/members` */
export const memberListSchema = paginationSchema.extend({
  search: z.string().trim().max(80).optional(),
  teamId: z.string().uuid().optional(),
  role: z.enum(['OWNER', 'ADMIN', 'MANAGER', 'EMPLOYEE']).optional(),
  /** `mine` = the caller plus their subordinates, `all` = the whole company. */
  scope: z.enum(['mine', 'team', 'all']).default('mine'),
})
export type MemberListInput = z.infer<typeof memberListSchema>

/** `POST /api/teams` */
export const createTeamSchema = z.object({
  name: z.string().trim().min(2, 'نام تیم را وارد کنید').max(80),
  description: z.string().trim().max(300).optional().or(z.literal('')),
  slug: z
    .string()
    .trim()
    .max(60)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'آدرس تیم فقط می‌تواند شامل حروف کوچک انگلیسی، عدد و خط تیره باشد')
    .optional()
    .or(z.literal('')),
  leadId: z.string().uuid('سرپرست انتخاب‌شده معتبر نیست').optional().or(z.literal('')),
})
export type CreateTeamInput = z.infer<typeof createTeamSchema>

/** `PATCH /api/teams/:id` */
export const updateTeamSchema = createTeamSchema.partial()
export type UpdateTeamInput = z.infer<typeof updateTeamSchema>

/** `POST /api/teams/:id/members` */
export const addTeamMemberSchema = z.object({
  userId: z.string().uuid('کاربر انتخاب‌شده معتبر نیست'),
  role: z.enum(['LEAD', 'MEMBER']).default('MEMBER'),
  managerId: z.string().uuid().optional().or(z.literal('')),
})
export type AddTeamMemberInput = z.infer<typeof addTeamMemberSchema>

/** `PATCH /api/teams/:id/members/:userId` */
export const updateTeamMemberSchema = z.object({
  role: z.enum(['LEAD', 'MEMBER']).optional(),
  managerId: z.string().uuid().optional().or(z.literal('')),
})
export type UpdateTeamMemberInput = z.infer<typeof updateTeamMemberSchema>

/** `GET /api/invitations` */
export const invitationListSchema = paginationSchema.extend({
  status: z.enum(['PENDING', 'ACCEPTED', 'REVOKED', 'EXPIRED']).default('PENDING'),
})
export type InvitationListInput = z.infer<typeof invitationListSchema>

/**
 * `POST /api/auth/invitations/accept`.
 *
 * Only the invitation id is accepted. Everything that decides *who the new
 * user becomes* — phone, company, role, team, name, job title — is read from
 * the invitation row and the verified ticket, never from this body.
 */
export const acceptInvitationSchema = z.object({
  invitationId: z.string().uuid('دعوت‌نامه انتخاب‌شده معتبر نیست'),
})
export type AcceptInvitationInput = z.infer<typeof acceptInvitationSchema>

// ---------------------------------------------------------------------------
// Tasks
// ---------------------------------------------------------------------------

/**
 * A file linked to a task.
 *
 * Storage is not part of this phase, so the client supplies a URL it already
 * has. Everything about the row is validated here anyway: an unchecked `url`
 * rendered as a link is a stored-XSS vector, hence the explicit protocol
 * allow-list rather than a bare `.url()`.
 */
export const taskAttachmentSchema = z.object({
  fileName: z.string().trim().min(1, 'نام فایل را وارد کنید').max(200),
  url: z
    .string()
    .trim()
    .max(1000)
    .refine(value => /^https?:\/\//i.test(value), 'آدرس فایل باید با http یا https شروع شود'),
  mimeType: z.string().trim().max(120).optional().or(z.literal('')),
  sizeBytes: z.coerce.number().int().min(0).max(100 * 1024 * 1024).optional(),
})
export type TaskAttachmentInput = z.infer<typeof taskAttachmentSchema>

/**
 * `POST /api/tasks` — a manager creates work.
 *
 * `dueDate` is accepted as an ISO string and coerced to a `Date` so the handler
 * never has to parse it, and an unparseable value fails validation rather than
 * silently becoming `Invalid Date`.
 */
export const createTaskSchema = z.object({
  title: z.string().trim().min(3, 'عنوان تسک را وارد کنید').max(160),
  description: z.string().trim().max(5000).optional().or(z.literal('')),
  assigneeId: z.string().uuid('انجام‌دهنده انتخاب‌شده معتبر نیست'),
  teamId: z.string().uuid('تیم انتخاب‌شده معتبر نیست').optional().or(z.literal('')),
  priority: z.enum(TASK_PRIORITIES).default('MEDIUM'),
  dueDate: z
    .union([z.string().trim(), z.date()])
    .optional()
    .transform(value => (value === undefined || value === '' ? undefined : new Date(value)))
    .refine(value => value === undefined || !Number.isNaN(value.getTime()), 'تاریخ سررسید معتبر نیست'),
  /** Planned effort in hours. Quarter-hour granularity is plenty. */
  estimatedHours: z.coerce
    .number()
    .min(0.25, 'برآورد زمان باید حداقل ۱۵ دقیقه باشد')
    .max(1000, 'برآورد زمان بیش از حد بزرگ است')
    .optional(),
  xpReward: z.coerce.number().int().min(0).max(10_000).default(100),
  coinReward: z.coerce.number().int().min(0).max(10_000).default(50),
  attachments: z.array(taskAttachmentSchema).max(10, 'حداکثر ۱۰ پیوست مجاز است').default([]),
})
export type CreateTaskInput = z.infer<typeof createTaskSchema>

/**
 * `PATCH /api/tasks/:id` — a manager edits an existing task.
 *
 * Deliberately *without* `status`: the lifecycle is only reachable through
 * `POST /api/tasks/:id/transition`, so there is no path that skips the
 * transition rules. `.partial()` plus the refine below keeps an empty body from
 * counting as a successful no-op edit.
 */
export const updateTaskSchema = createTaskSchema
  .omit({ attachments: true })
  .partial()
  .refine(value => Object.keys(value).length > 0, 'تغییری برای ذخیره وجود ندارد')
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>

/**
 * `POST /api/tasks/:id/transition` — the one door the lifecycle goes through.
 *
 * `note` becomes the review feedback for `request_revision`/`approve` and the
 * event note otherwise. A revision request without a reason is rejected in the
 * handler, where the action is known.
 */
export const taskTransitionSchema = z.object({
  action: z.enum(TASK_ACTIONS),
  note: z.string().trim().max(2000).optional().or(z.literal('')),
  /** 0-100 overall score, reviewers only. Out-of-range values are rejected
   *  here rather than clamped, so a typo cannot quietly change a payout. */
  score: z.coerce.number().int().min(0).max(100).optional(),
  /** Reviewer's 1-5 sub-scores, approvals only. */
  qualityScore: z.coerce.number().int().min(1).max(5).optional(),
  timelinessScore: z.coerce.number().int().min(1).max(5).optional(),
  /** Self-reported completion the employee submits alongside the transition. */
  progress: z.coerce.number().int().min(0).max(100).optional(),
})
export type TaskTransitionInput = z.infer<typeof taskTransitionSchema>

/** `PATCH /api/tasks/:id/progress` — the assignee's slider. */
export const taskProgressSchema = z.object({
  progress: z.coerce.number().int().min(0, 'درصد پیشرفت معتبر نیست').max(100, 'درصد پیشرفت معتبر نیست'),
})
export type TaskProgressInput = z.infer<typeof taskProgressSchema>

/** `POST /api/tasks/:id/comments` */
export const createTaskCommentSchema = z.object({
  body: z.string().trim().min(1, 'متن یادداشت را وارد کنید').max(2000),
})
export type CreateTaskCommentInput = z.infer<typeof createTaskCommentSchema>

/** `POST /api/tasks/:id/attachments` */
export const createTaskAttachmentSchema = taskAttachmentSchema
export type CreateTaskAttachmentInput = z.infer<typeof createTaskAttachmentSchema>

// ---------------------------------------------------------------------------
// Reward engine
// ---------------------------------------------------------------------------

/**
 * `POST /api/rewards/preview` — what would this review pay out?
 *
 * The manager's review form calls this so the number shown before approving is
 * produced by the same server-side engine that will actually pay, rather than
 * by arithmetic duplicated in a component.
 */
export const rewardPreviewSchema = z.object({
  taskId: z.string().uuid('تسک انتخاب‌شده معتبر نیست'),
  score: z.coerce.number().int().min(0).max(100),
  qualityScore: z.coerce.number().int().min(1).max(5).optional(),
  timelinessScore: z.coerce.number().int().min(1).max(5).optional(),
})
export type RewardPreviewInput = z.infer<typeof rewardPreviewSchema>

/** Query for `GET /api/wallet/transactions`. */
export const walletTransactionQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  type: z
    .enum([
      'TASK_REWARD',
      'RECOGNITION_REWARD',
      'ACHIEVEMENT_REWARD',
      'CHALLENGE_REWARD',
      'REWARD_REDEMPTION',
      'ADMIN_ADJUSTMENT',
    ])
    .optional(),
})
export type WalletTransactionQuery = z.infer<typeof walletTransactionQuerySchema>

/**
 * `POST /api/wallet/adjust` — the only manual lever on a balance, and
 * deliberately a narrow one.
 *
 * Owners/admins only, a reason is mandatory, and the amount is bounded so a
 * fat-fingered adjustment cannot mint a fortune. It still goes through the
 * ledger like every other movement.
 */
export const walletAdjustSchema = z.object({
  userId: z.string().uuid('کاربر انتخاب‌شده معتبر نیست'),
  amount: z.coerce.number().int().refine(value => value !== 0, 'مقدار نمی‌تواند صفر باشد')
    .refine(value => Math.abs(value) <= 10_000, 'حداکثر ۱۰٬۰۰۰ سکه در هر تراکنش'),
  reason: z.string().trim().min(3).max(500),
})
export type WalletAdjustInput = z.infer<typeof walletAdjustSchema>

/** `PUT /api/rewards/rules` — publish a new economy version. */
export const rewardRulesSchema = z.object({
  baseXp: z.coerce.number().int().min(0).max(100_000),
  baseCoins: z.coerce.number().int().min(0).max(100_000),
  lowPriorityBp: z.coerce.number().int().min(0).max(100_000),
  mediumPriorityBp: z.coerce.number().int().min(0).max(100_000),
  highPriorityBp: z.coerce.number().int().min(0).max(100_000),
  excellentBp: z.coerce.number().int().min(0).max(100_000),
  goodBp: z.coerce.number().int().min(0).max(100_000),
  fairBp: z.coerce.number().int().min(0).max(100_000),
  poorBp: z.coerce.number().int().min(0).max(100_000),
  onTimeBonusBp: z.coerce.number().int().min(0).max(100_000),
  earlyBonusBp: z.coerce.number().int().min(0).max(100_000),
  highQualityBonusBp: z.coerce.number().int().min(0).max(100_000),
  overduePenaltyBp: z.coerce.number().int().min(0).max(100_000),
  revisionPenaltyBp: z.coerce.number().int().min(0).max(100_000),
  maxRevisionPenaltyBp: z.coerce.number().int().min(0).max(100_000),
  minMultiplierBp: z.coerce.number().int().min(0).max(100_000),
  maxMultiplierBp: z.coerce.number().int().min(0).max(100_000),
  earlyDays: z.coerce.number().int().min(0).max(365),
  highQualityThreshold: z.coerce.number().int().min(1).max(5),
})
export type RewardRulesInput = z.infer<typeof rewardRulesSchema>

// ---------------------------------------------------------------------------
// Reward marketplace
// ---------------------------------------------------------------------------

/**
 * A field a form may leave empty to mean "no limit" / "no date".
 *
 * `null` is tried first: `z.coerce.number()` would happily turn `null` into `0`,
 * and "unlimited stock" and "sold out" are very different shelves.
 */
const emptyIsNull = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess(value => (value === '' || value === undefined ? null : value), z.union([z.null(), schema]))

const optionalInt = (min: number, max: number, message: string) =>
  emptyIsNull(z.coerce.number().int(message).min(min, message).max(max, message))

const optionalDate = (message: string) =>
  emptyIsNull(z.coerce.date({ error: message }))

/** Checkboxes reach the server as booleans from JSON, but tolerate `'true'`. */
const booleanish = z.preprocess(
  value => (value === 'true' ? true : value === 'false' ? false : value),
  z.boolean(),
)

/** An image link. Same protocol allow-list as task attachments: no `javascript:`. */
const imageUrlSchema = z
  .string()
  .trim()
  .max(1000)
  .refine(value => /^https?:\/\//i.test(value), 'آدرس تصویر باید با http یا https شروع شود')

/**
 * The rules a company attaches to one reward.
 *
 * Deliberately optional in every field: a reward with no rules is "anybody with
 * enough coins, as often as they like, while stock lasts". Pricing and limits
 * are the company's to set — nothing here has a product-wide default price.
 */
/**
 * Every rule is optional and **carries no default of its own**.
 *
 * A default inside the object would be indistinguishable from an explicit value
 * once parsed, so `PATCH { rules: { maxPerUser: 1 } }` would silently switch
 * `autoApprove` off. Defaults are applied once, on create, by the server — and a
 * partial update only ever carries the keys the admin actually sent. `null` stays
 * meaningful: it is "no cap" / "no date", not "unchanged".
 */
export const rewardPolicySchema = z.object({
  /** Simple or digital rewards skip the approval queue. */
  autoApprove: booleanish.optional(),
  /** How many live redemptions one employee may hold; `null` is no cap. */
  maxPerUser: optionalInt(1, 1000, 'سقف درخواست برای هر نفر معتبر نیست').optional(),
  /** Minimum level; `null` is everybody. */
  minLevel: optionalInt(1, 200, 'حداقل سطح معتبر نیست').optional(),
  /** The employee has to say which day, which charity, which size. */
  requiresNote: booleanish.optional(),
  availableFrom: optionalDate('تاریخ شروع معتبر نیست').optional(),
  availableUntil: optionalDate('تاریخ پایان معتبر نیست').optional(),
})
export type RewardPolicyInput = z.infer<typeof rewardPolicySchema>

/**
 * `POST /api/rewards` — put something on the shelf. OWNER/ADMIN only.
 *
 * `coinCost` has a floor of 1: a free reward is not a reward, it is a giveaway,
 * and it would let anybody drain stock without earning anything.
 */
export const createRewardSchema = z.object({
  title: z.string().trim().min(2, 'عنوان پاداش را کامل بنویسید').max(80),
  description: z.string().trim().max(600).optional().or(z.literal('')),
  type: z.enum(REWARD_TYPES).default('CUSTOM'),
  coinCost: z.coerce.number().int('قیمت باید عدد صحیح باشد').min(1, 'قیمت نمی‌تواند صفر باشد').max(1_000_000, 'قیمت بیش از حد بزرگ است'),
  stock: optionalInt(0, 1_000_000, 'موجودی معتبر نیست').optional(),
  imageUrl: imageUrlSchema.optional().or(z.literal('')),
  status: z.enum(CATALOG_STATUSES).default('ACTIVE'),
  rules: rewardPolicySchema.default({}),
})
export type CreateRewardInput = z.infer<typeof createRewardSchema>

/**
 * `PATCH /api/rewards/:id` — edit, reprice, restock or disable.
 *
 * Every field optional so the UI can send just what changed. `status` is how a
 * reward is disabled: `PAUSED` hides it but keeps it editable, `ARCHIVED` retires
 * it. Neither deletes anything, so past redemptions keep their reward row.
 */
export const updateRewardSchema = z.object({
  title: z.string().trim().min(2, 'عنوان پاداش را کامل بنویسید').max(80).optional(),
  description: z.string().trim().max(600).optional().or(z.literal('')),
  type: z.enum(REWARD_TYPES).optional(),
  coinCost: z.coerce.number().int('قیمت باید عدد صحیح باشد').min(1, 'قیمت نمی‌تواند صفر باشد').max(1_000_000, 'قیمت بیش از حد بزرگ است').optional(),
  stock: optionalInt(0, 1_000_000, 'موجودی معتبر نیست').optional(),
  imageUrl: imageUrlSchema.optional().or(z.literal('')),
  status: z.enum(CATALOG_STATUSES).optional(),
  rules: rewardPolicySchema.optional(),
})
export type UpdateRewardInput = z.infer<typeof updateRewardSchema>

/**
 * `POST /api/rewards/:id/redeem` — spend coins on a reward.
 *
 * The price is **not** a parameter: the server reads it from the reward row. A
 * client that could send its own price could buy anything for one coin.
 *
 * `idempotencyKey` is optional and client-generated (a UUID per attempt). A
 * double-clicked button, a flaky network retry and a resubmitted form all carry
 * the same key and produce one redemption, one debit.
 */
export const redeemRewardSchema = z.object({
  note: z.string().trim().max(500).optional().or(z.literal('')),
  idempotencyKey: z.string().uuid('کلید یکتایی معتبر نیست').optional(),
})
export type RedeemRewardInput = z.infer<typeof redeemRewardSchema>

/** `POST /api/rewards/admin/redemptions/:id` — decide a request. */
export const redemptionDecisionSchema = z.object({
  action: z.enum(REDEMPTION_ACTIONS),
  /** Required in effect for a rejection: the UI asks for it, and a "no" without
   *  a reason is the humiliating kind. Bounded so it stays a note, not an essay. */
  note: z.string().trim().max(500).optional().or(z.literal('')),
})
export type RedemptionDecisionInput = z.infer<typeof redemptionDecisionSchema>

/** Query for `GET /api/rewards` and `GET /api/rewards/admin`. */
export const rewardCatalogueQuerySchema = z.object({
  type: z.enum(REWARD_TYPES).optional(),
  /** Employees only ever see ACTIVE; admins may ask for anything. */
  status: z.enum(CATALOG_STATUSES).optional(),
})
export type RewardCatalogueQuery = z.infer<typeof rewardCatalogueQuerySchema>

/** Query for the admin redemption queue. */
export const redemptionQueueQuerySchema = z.object({
  status: z.enum(REDEMPTION_STATUSES).optional(),
  rewardId: z.string().uuid('پاداش انتخاب‌شده معتبر نیست').optional(),
  userId: z.string().uuid('کاربر انتخاب‌شده معتبر نیست').optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
})
export type RedemptionQueueQuery = z.infer<typeof redemptionQueueQuerySchema>

/** Query for `GET /api/rewards/redemptions` — the caller's own history. */
export const myRedemptionsQuerySchema = z.object({
  status: z.enum(REDEMPTION_STATUSES).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
})
export type MyRedemptionsQuery = z.infer<typeof myRedemptionsQuerySchema>

// ---------------------------------------------------------------------------
// Recognition
// ---------------------------------------------------------------------------

/** The rendering tones a category/badge may carry. Mirrors `Badge.tone`. */
export const recognitionToneSchema = z.enum([
  'primary',
  'coin',
  'streak',
  'success',
  'info',
  'warning',
  'neutral',
])
export type RecognitionTone = z.infer<typeof recognitionToneSchema>

/**
 * `POST /api/recognition/vote` — one coworker chosen for one category.
 * No message, no rating: a vote is just a nomination, which is the whole point.
 */
export const recognitionVoteSchema = z.object({
  categoryId: z.string().uuid('دسته انتخاب‌شده معتبر نیست'),
  nomineeId: z.string().uuid('همکار انتخاب‌شده معتبر نیست'),
})
export type RecognitionVoteInput = z.infer<typeof recognitionVoteSchema>

/** `POST /api/recognition/categories` — create a voting bucket. */
export const recognitionCategorySchema = z.object({
  name: z.string().trim().min(1, 'نام دسته را وارد کنید').max(80),
  description: z.string().trim().max(300).optional(),
  iconKey: z.string().trim().max(120).optional(),
  tone: recognitionToneSchema.optional(),
  sortOrder: z.coerce.number().int().min(0).max(10_000).optional(),
  xpReward: z.coerce.number().int().min(0).max(100_000).optional(),
  coinReward: z.coerce.number().int().min(0).max(100_000).optional(),
  titleId: z.string().uuid('عنوان انتخاب‌شده معتبر نیست').nullable().optional(),
  badgeId: z.string().uuid('نشان انتخاب‌شده معتبر نیست').nullable().optional(),
})
export type RecognitionCategoryInput = z.infer<typeof recognitionCategorySchema>

/** `PATCH /api/recognition/categories/:id` — edit, reorder or disable. */
export const recognitionCategoryUpdateSchema = recognitionCategorySchema
  .partial()
  .extend({ isActive: z.boolean().optional() })
export type RecognitionCategoryUpdateInput = z.infer<typeof recognitionCategoryUpdateSchema>

/** `PUT /api/recognition/cycle` — the cadence the next cycle should run on. */
export const recognitionCycleConfigSchema = z.object({
  frequency: z.enum(['WEEKLY', 'MONTHLY']),
})
export type RecognitionCycleConfigInput = z.infer<typeof recognitionCycleConfigSchema>

/** `POST /api/recognition/titles` — an admin-created winner title. */
export const recognitionTitleSchema = z.object({
  name: z.string().trim().min(1, 'نام عنوان را وارد کنید').max(80),
  description: z.string().trim().max(300).optional(),
})
export type RecognitionTitleInput = z.infer<typeof recognitionTitleSchema>

// ---------------------------------------------------------------------------
// Challenges
// ---------------------------------------------------------------------------

/** A datetime the forms send as `YYYY-MM-DDTHH:mm` or an ISO string. */
const challengeDate = (message: string) => z.coerce.date({ error: message })

/**
 * The cross-field rules a challenge spec has to satisfy, shared by create
 * validation and by the PATCH endpoint (which re-runs them on the *merged*
 * row — a partial update must not be able to assemble an invalid challenge).
 *
 * Returns zod-shaped issues so both callers surface them the same way.
 */
export function challengeSpecIssues(spec: {
  type: ChallengeType
  teamId?: string | null
  goalKey: ChallengeGoalKey
  goalValue: number
  startsAt: Date
  endsAt: Date
}): Array<{ path: string, message: string }> {
  const issues: Array<{ path: string, message: string }> = []

  if (!goalAllowedFor(spec.type, spec.goalKey)) {
    issues.push({ path: 'goalKey', message: 'این هدف با نوع چالش سازگار نیست' })
  }

  const unit = CHALLENGE_GOALS[spec.goalKey].unit
  const bounds = GOAL_BOUNDS[unit]
  if (spec.goalValue < bounds.min || spec.goalValue > bounds.max) {
    issues.push({
      path: 'goalValue',
      message: unit === 'percent'
        ? 'درصد هدف باید بین ۱ تا ۱۰۰ باشد'
        : 'تعداد هدف باید بین ۱ تا ۱۰۰٬۰۰۰ باشد',
    })
  }

  if (spec.type === 'TEAM' && !spec.teamId) {
    issues.push({ path: 'teamId', message: 'برای چالش تیمی، یک تیم انتخاب کنید' })
  }

  const windowIssue = validateWindow({ startsAt: spec.startsAt, endsAt: spec.endsAt }, new Date())
  if (windowIssue === 'ORDER') {
    issues.push({ path: 'endsAt', message: 'پایان چالش باید بعد از شروع آن باشد' })
  }
  else if (windowIssue === 'PAST') {
    issues.push({ path: 'endsAt', message: 'پایان چالش باید در آینده باشد' })
  }
  else if (windowIssue === 'TOO_LONG') {
    issues.push({ path: 'endsAt', message: 'چالش حداکثر می‌تواند یک سال طول بکشد' })
  }

  return issues
}

/**
 * `POST /api/challenges` — publish a challenge.
 *
 * `startsAt` may be in the past ("starting today"); `endsAt` may not. The
 * goal's shape is checked against the challenge type, and a TEAM challenge
 * must name its team. Everything else — rewards, badge — is the company's call.
 */
export const createChallengeSchema = z.object({
  title: z.string().trim().min(2, 'عنوان چالش را کامل بنویسید').max(80),
  description: z.string().trim().max(600).optional().or(z.literal('')),
  type: z.enum(CHALLENGE_TYPES).default('INDIVIDUAL'),
  /** Required for TEAM challenges; an optional member scope for individual ones. */
  teamId: z.string().uuid('تیم انتخاب‌شده معتبر نیست').optional().or(z.literal('')),
  goalKey: z.enum(CHALLENGE_GOAL_KEYS),
  goalValue: z.coerce.number().int('مقدار هدف باید عدد صحیح باشد'),
  xpReward: z.coerce.number().int().min(0, 'امتیاز نمی‌تواند منفی باشد').max(100_000, 'امتیاز بیش از حد بزرگ است').default(0),
  coinReward: z.coerce.number().int().min(0, 'سکه نمی‌تواند منفی باشد').max(100_000, 'سکه بیش از حد بزرگ است').default(0),
  startsAt: challengeDate('تاریخ شروع معتبر نیست'),
  endsAt: challengeDate('تاریخ پایان معتبر نیست'),
  badgeId: z.string().uuid('نشان انتخاب‌شده معتبر نیست').optional().or(z.literal('')),
}).superRefine((value, ctx) => {
  for (const issue of challengeSpecIssues(value)) {
    ctx.addIssue({ code: 'custom', path: [issue.path], message: issue.message })
  }
})
export type CreateChallengeInput = z.infer<typeof createChallengeSchema>

/**
 * `PATCH /api/challenges/:id` — edit before the start.
 *
 * Every field optional; the endpoint merges onto the current row and re-runs
 * `challengeSpecIssues` so a partial edit cannot assemble an invalid challenge.
 */
export const updateChallengeSchema = z.object({
  title: z.string().trim().min(2, 'عنوان چالش را کامل بنویسید').max(80).optional(),
  description: z.string().trim().max(600).optional().or(z.literal('')),
  type: z.enum(CHALLENGE_TYPES).optional(),
  teamId: z.string().uuid('تیم انتخاب‌شده معتبر نیست').optional().or(z.literal('')),
  goalKey: z.enum(CHALLENGE_GOAL_KEYS).optional(),
  goalValue: z.coerce.number().int('مقدار هدف باید عدد صحیح باشد').optional(),
  xpReward: z.coerce.number().int().min(0, 'امتیاز نمی‌تواند منفی باشد').max(100_000, 'امتیاز بیش از حد بزرگ است').optional(),
  coinReward: z.coerce.number().int().min(0, 'سکه نمی‌تواند منفی باشد').max(100_000, 'سکه بیش از حد بزرگ است').optional(),
  startsAt: challengeDate('تاریخ شروع معتبر نیست').optional(),
  endsAt: challengeDate('تاریخ پایان معتبر نیست').optional(),
  badgeId: z.string().uuid('نشان انتخاب‌شده معتبر نیست').optional().or(z.literal('')),
})
export type UpdateChallengeInput = z.infer<typeof updateChallengeSchema>

/** Query for `GET /api/challenges`. */
export const challengeListQuerySchema = z.object({
  status: z.enum(CHALLENGE_STATUSES).optional(),
  type: z.enum(CHALLENGE_TYPES).optional(),
})
export type ChallengeListQuery = z.infer<typeof challengeListQuerySchema>
