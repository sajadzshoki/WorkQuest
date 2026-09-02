import type { InvitationListResponse, InvitationSummary } from '#shared/types/api'

import { invitationListSchema } from '#shared/schemas'
import { can } from '#shared/utils/permissions'

import { requirePermission } from '../../utils/auth'
import { readValidatedQuery } from '../../utils/http'
import { expireStaleInvitations } from '../../utils/invitation'
import { createTenantClient } from '../../utils/tenant'

/**
 * Invitations issued by this company.
 *
 * OWNER/ADMIN see all of them. A MANAGER — who can invite into their own teams
 * but holds no `member:manage` — sees only the ones they sent, so the list
 * never becomes a roster of everyone a peer has hired.
 */
export default defineEventHandler(async (event): Promise<InvitationListResponse> => {
  const auth = requirePermission(event, 'member:invite')
  const query = readValidatedQuery(event, invitationListSchema)
  const db = createTenantClient(auth)

  // Overdue rows are marked EXPIRED on read; cheaper and more predictable
  // than a cron, and `accept` re-checks the deadline anyway.
  await expireStaleInvitations(auth)

  const companyWide = can(auth.role, 'member:manage')
  const where: Record<string, unknown> = { status: query.status }
  if (!companyWide) where.invitedById = auth.userId

  const [rows, total] = await Promise.all([
    db.invitation.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      include: {
        team: { select: { id: true, name: true } },
        invitedBy: { select: { id: true, fullName: true } },
        acceptedBy: { select: { id: true, fullName: true } },
      },
    }),
    db.invitation.count({ where }),
  ])

  const invitations: InvitationSummary[] = rows.map(row => ({
    id: row.id,
    fullName: row.fullName,
    phone: row.phone,
    jobTitle: row.jobTitle,
    role: row.role as InvitationSummary['role'],
    status: row.status,
    team: row.team,
    invitedBy: row.invitedBy,
    expiresAt: row.expiresAt.toISOString(),
    acceptedAt: row.acceptedAt?.toISOString() ?? null,
    acceptedBy: row.acceptedBy,
    createdAt: row.createdAt.toISOString(),
  }))

  return {
    invitations,
    total,
    page: query.page,
    pageSize: query.pageSize,
    // Revoking is an admin action; a manager can withdraw their own invite,
    // which the detail check in the revoke route allows explicitly.
    canRevoke: companyWide,
  }
})
