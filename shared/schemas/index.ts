import { z } from 'zod'

import { SUPPORTED_LOCALES, SUPPORTED_TIMEZONES } from '../constants'

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
  status: z
    .enum([
      'ASSIGNED',
      'IN_PROGRESS',
      'SUBMITTED',
      'APPROVED',
      'CHANGES_REQUESTED',
      'REJECTED',
      'CANCELLED',
      'DRAFT',
    ])
    .optional(),
  scope: z.enum(['mine', 'team', 'all']).default('mine'),
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
