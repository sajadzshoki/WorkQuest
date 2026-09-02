import type { CompleteOnboardingResponse } from '#shared/types/api'

import { completeOnboardingSchema } from '#shared/schemas'
import { slugify } from '#shared/utils/format'

import { getAuth, issueSession, startSession, toCompanySummary, toUserSummary } from '../../../utils/auth'
import { usePrisma } from '../../../utils/db'
import { errors, readValidated } from '../../../utils/http'
import {
  bootstrapCompanyDefaults,
  clearOnboardingCookie,
  consumeOnboardingTicket,
  requireOnboardingTicket,
  reserveCompanySlug,
} from '../../../utils/onboarding'

/**
 * Finish self-service registration: create the company and its OWNER.
 *
 * Security properties worth spelling out, because they are the whole point of
 * the flow:
 *  - the phone number comes from the verified ticket, never from the request
 *    body, so a caller cannot register a number they do not control;
 *  - the ticket is consumed inside the same transaction that creates the
 *    company, which makes the operation single-use even under concurrency;
 *  - the role is assigned here — `OWNER` — and is not an input.
 */
export default defineEventHandler(async (event): Promise<CompleteOnboardingResponse> => {
  if (getAuth(event)) {
    throw errors.conflict('شما پیش‌تر وارد شده‌اید')
  }

  const ticket = await requireOnboardingTicket(event)
  const input = await readValidated(event, completeOnboardingSchema)

  const requestedSlug = input.slug?.trim() || slugify(input.companyName)
  if (!requestedSlug) {
    throw errors.badRequest('COMPANY_SLUG_REQUIRED', 'نام شرکت باید شامل حروف یا اعداد باشد')
  }

  const db = usePrisma()

  const { user, company } = await db.$transaction(async (tx) => {
    await consumeOnboardingTicket(tx, ticket.id)

    const slug = await reserveCompanySlug(tx, requestedSlug)

    const createdCompany = await tx.company.create({
      data: {
        name: input.companyName.trim(),
        slug,
        industry: input.industry?.trim() || null,
        logoUrl: input.logoUrl?.trim() || null,
        locale: input.locale,
        timezone: input.timezone,
      },
    })

    const owner = await tx.user.create({
      data: {
        companyId: createdCompany.id,
        phone: ticket.phone,
        fullName: input.fullName.trim(),
        jobTitle: input.jobTitle?.trim() || 'مدیرعامل',
        role: 'OWNER',
        status: 'ACTIVE',
        locale: input.locale,
        timezone: input.timezone,
      },
    })

    await bootstrapCompanyDefaults(tx, createdCompany.id, owner.id)

    await tx.auditLog.create({
      data: {
        companyId: createdCompany.id,
        actorId: owner.id,
        action: 'company.created',
        targetType: 'Company',
        targetId: createdCompany.id,
        ip: getRequestIP(event, { xForwardedFor: true }),
      },
    })

    return { user: owner, company: createdCompany }
  })

  const session = await issueSession(event, user)
  startSession(event, session)
  clearOnboardingCookie(event)

  return {
    status: 'authenticated',
    user: toUserSummary(user),
    company: toCompanySummary(company),
  }
})
