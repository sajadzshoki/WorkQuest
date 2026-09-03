import { z } from 'zod'

import { SUPPORTED_LOCALES, SUPPORTED_TIMEZONES } from '../constants'
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

export const leaderboardRangeSchema = z.object({
  range: z.enum(['week', 'month', 'all']).default('month'),
  limit: z.coerce.number().int().min(1).max(50).default(10),
})
export type LeaderboardRangeInput = z.infer<typeof leaderboardRangeSchema>

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
  /** 0-100 quality score, reviewers only. */
  score: z.coerce.number().int().min(0).max(100).optional(),
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
