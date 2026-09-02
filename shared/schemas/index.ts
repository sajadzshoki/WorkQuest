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
