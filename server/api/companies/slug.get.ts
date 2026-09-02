import type { SlugAvailabilityResponse } from '#shared/types/api'

import { slugQuerySchema } from '#shared/schemas'
import { slugify } from '#shared/utils/format'

import { usePrisma } from '../../utils/db'
import { readValidatedQuery } from '../../utils/http'
import { reserveCompanySlug } from '../../utils/onboarding'

/**
 * Live slug availability for the company form.
 *
 * Public by necessity — it is used during onboarding, before any session
 * exists. It deliberately answers with a boolean and nothing else: no company
 * name, no owner, no existence details beyond "this address is taken".
 */
export default defineEventHandler(async (event): Promise<SlugAvailabilityResponse> => {
  const { slug } = readValidatedQuery(event, slugQuerySchema)
  const normalized = slugify(slug)

  if (!normalized) {
    return { slug, available: false, suggestion: '' }
  }

  const db = usePrisma()
  const existing = await db.company.findUnique({ where: { slug: normalized }, select: { id: true } })

  if (!existing) {
    return { slug: normalized, available: true }
  }

  // Outside a transaction this is a suggestion, not a reservation — the real
  // guarantee happens in `reserveCompanySlug` during onboarding.
  const suggestion = await reserveCompanySlug(db, normalized)

  return { slug: normalized, available: false, suggestion }
})
