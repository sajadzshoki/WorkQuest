import type { AnalyticsOverviewResponse } from '#shared/types/api'

import { buildAnalyticsOverview } from '../../utils/analytics'
import { requirePermission } from '../../utils/auth'

/**
 * The company administration dashboard in one request.
 *
 * Deliberately chatty, like `/api/dashboard/summary`: the analytics page is a
 * single screen of KPI tiles, tables and four small charts, and one round trip
 * keeps the whole picture coherent — every number on the page is computed
 * from the same instant, against the same scope.
 *
 * Scope is decided by role, not by a query parameter an admin could widen:
 * OWNER/ADMIN read the company, a MANAGER is narrowed inside the service to
 * their own subordinates and the teams they lead, and an EMPLOYEE never gets
 * past the permission check.
 */
export default defineEventHandler(async (event): Promise<AnalyticsOverviewResponse> => {
  const auth = requirePermission(event, 'analytics:read')
  return buildAnalyticsOverview(auth)
})
