import { z } from 'zod'

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

export const requestOtpSchema = z.object({
  phone: phoneSchema,
})
export type RequestOtpInput = z.infer<typeof requestOtpSchema>

export const verifyOtpSchema = z.object({
  phone: phoneSchema,
  /** 4-8 digit numeric code; length is enforced again by config on the server. */
  code: z.string().trim().regex(/^\d{4,8}$/, 'کد وارد شده معتبر نیست'),
})
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>

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
