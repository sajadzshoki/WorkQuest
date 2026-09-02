import type { TeamDetailResponse } from '#shared/types/api'

import { updateTeamSchema } from '#shared/schemas'
import { can } from '#shared/utils/permissions'

import { requireAuth } from '../../utils/auth'
import { errors, readValidated } from '../../utils/http'
import { canEditTeam } from '#shared/utils/member-scope'
import { assertCanLead, ledTeamIds, rejectSecondMembership, teamDetail } from '../../utils/members'
import { createTenantClient } from '../../utils/tenant'

/**
 * Edit a team.
 *
 * Split by field, because the two audiences differ:
 *
 *  - `name` / `description` — OWNER/ADMIN, plus any MANAGER who leads the team.
 *    A lead renaming their own team is ordinary housekeeping.
 *  - `leadId` — OWNER/ADMIN only. Appointing a lead hands someone a scope over
 *    other people, so a manager must not be able to do it (not even to
 *    themselves, which is exactly the escalation to prevent).
 *  - `slug` — OWNER/ADMIN only; it appears in URLs and is part of the tenant's
 *    identity.
 */
export default defineEventHandler(async (event): Promise<TeamDetailResponse> => {
  const auth = requireAuth(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw errors.notFound('تیم پیدا نشد')

  const input = await readValidated(event, updateTeamSchema)
  const db = createTenantClient(auth)

  const team = await db.team.findUnique({ where: { id }, select: { id: true, leadId: true, slug: true } })
  if (!team) throw errors.notFound('تیم پیدا نشد')

  const led = await ledTeamIds(auth)
  if (!canEditTeam(auth, team.id, led)) throw errors.notFound('تیم پیدا نشد')

  const isAdmin = can(auth.role, 'team:manage')
  const wantsLead = input.leadId !== undefined
  const wantsSlug = input.slug !== undefined

  if ((wantsLead || wantsSlug) && !isAdmin) {
    throw errors.forbidden('تعیین سرپرست یا آدرس تیم در اختیار مدیران شرکت است')
  }

  if (wantsLead && input.leadId) {
    const lead = await db.user.findUnique({
      where: { id: input.leadId },
      select: { id: true, role: true },
    })
    if (!lead) throw errors.notFound('سرپرست انتخاب‌شده پیدا نشد')
    // A lead carries team-management scope, so the company role has to match.
    assertCanLead(lead.role)
  }

  const data: Record<string, unknown> = {}
  if (input.name !== undefined) data.name = input.name.trim()
  if (input.description !== undefined) data.description = input.description?.trim() || null
  if (wantsSlug && input.slug) data.slug = input.slug.trim()
  if (wantsLead) data.leadId = input.leadId || null

  const updated = await db.$transaction(async (tx) => {
    const row = await tx.team.update({ where: { id: team.id }, data })

    // Keep the roster in step with `leadId`: the lead is always a member with
    // the LEAD team role, and a demoted lead goes back to MEMBER.
    if (wantsLead) {
      if (team.leadId && team.leadId !== input.leadId) {
        const previous = await tx.teamMember.findFirst({
          where: { teamId: team.id, userId: team.leadId },
          select: { id: true },
        })
        if (previous) {
          await tx.teamMember.update({ where: { id: previous.id }, data: { role: 'MEMBER' } })
        }
      }
      if (input.leadId) {
        const existing = await tx.teamMember.findFirst({
          where: { teamId: team.id, userId: input.leadId },
          select: { id: true },
        })
        if (existing) {
          await tx.teamMember.update({ where: { id: existing.id }, data: { role: 'LEAD' } })
        }
        else {
          // The lead is always a member, so the one-primary-team rule applies
          // to them too. Checked inside the transaction, next to the insert.
          const elsewhere = await tx.teamMember.findFirst({
            where: { userId: input.leadId, teamId: { not: team.id } },
            select: { team: { select: { name: true } } },
          })
          rejectSecondMembership(elsewhere)
          await tx.teamMember.create({
            data: {
              companyId: auth.companyId,
              teamId: team.id,
              userId: input.leadId,
              role: 'LEAD',
            },
          })
        }
      }
    }

    return row
  })

  await db.auditLog.create({
    data: {
      companyId: auth.companyId,
      actorId: auth.userId,
      action: 'team.update',
      targetType: 'Team',
      targetId: team.id,
      ip: getRequestIP(event, { xForwardedFor: true }),
      data: { fields: Object.keys(input) },
    },
  })

  return teamDetail(db, updated.id)
})
