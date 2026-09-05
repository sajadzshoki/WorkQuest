import type { CompanyUpdateResponse } from '#shared/types/api'

import { updateCompanySchema } from '#shared/schemas'

import { requirePermission } from '../../utils/auth'
import { usePrisma } from '../../utils/db'
import { readValidated } from '../../utils/http'

/**
 * `PATCH /api/companies` — edit the company profile.
 *
 * Name-only by design: `updateCompanySchema` documents why the slug and the
 * timezone/locale pair are not editable from a form. `Company` sits outside
 * the tenant scope on purpose (it *is* the tenant root), so the update is
 * keyed on `auth.companyId` explicitly — the one filter that cannot be
 * forgotten because it is the only one there is.
 */
export default defineEventHandler(async (event): Promise<CompanyUpdateResponse> => {
  const auth = requirePermission(event, 'company:update')
  const { name } = await readValidated(event, updateCompanySchema)

  const db = usePrisma()
  const company = await db.company.update({
    where: { id: auth.companyId },
    data: { name },
    select: {
      id: true,
      name: true,
      slug: true,
      logoUrl: true,
      locale: true,
      timezone: true,
    },
  })

  return company
})
