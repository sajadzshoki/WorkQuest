import { recognitionCycleConfigSchema } from '#shared/schemas'

import { requirePermission } from '../../utils/auth'
import { readValidated } from '../../utils/http'
import { configuredFrequency, ensureActiveCycle } from '../../utils/recognition'
import { createTenantClient } from '../../utils/tenant'

/**
 * `PUT /api/recognition/cycle` — set the cadence (weekly or monthly).
 *
 * Changing the cadence closes the current cycle immediately — its winners are
 * tallied as they stand — and opens a fresh one on the new frequency. That is
 * the only sensible reading of "switch cadence": the old period ends now.
 */
export default defineEventHandler(async (event) => {
  const auth = requirePermission(event, 'recognition:manage')
  const input = await readValidated(event, recognitionCycleConfigSchema)
  const db = createTenantClient(auth)

  const current = await configuredFrequency(db, auth.companyId)
  const cycle = await ensureActiveCycle(db, auth.companyId, input.frequency, new Date(), auth.company.timezone)

  await db.auditLog.create({
    data: {
      companyId: auth.companyId,
      actorId: auth.userId,
      action: 'recognition.cycle.configure',
      targetType: 'RecognitionCycle',
      targetId: cycle.id,
      data: { from: current, to: input.frequency },
    },
  })

  return {
    cycle: {
      id: cycle.id,
      frequency: cycle.frequency,
      startsAt: cycle.startsAt.toISOString(),
      endsAt: cycle.endsAt.toISOString(),
    },
  }
})
