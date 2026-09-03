import { recognitionTitleSchema } from '#shared/schemas'

import { requirePermission } from '../../utils/auth'
import { readValidated } from '../../utils/http'
import { createTenantClient } from '../../utils/tenant'

/**
 * `POST /api/recognition/titles` — create a winner title.
 *
 * Titles are what a winner *earns* («مغز هفته», «هم‌تیمی طلایی»). System titles
 * are seeded; this is how an admin adds their own.
 */
export default defineEventHandler(async (event) => {
  const auth = requirePermission(event, 'recognition:manage')
  const input = await readValidated(event, recognitionTitleSchema)
  const db = createTenantClient(auth)

  const title = await db.recognitionTitle.create({
    data: {
      companyId: auth.companyId,
      name: input.name,
      description: input.description ?? null,
      isSystem: false,
    },
    select: { id: true, name: true },
  })

  return { title }
})
