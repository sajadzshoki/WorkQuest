import type { TeamDetailResponse } from '#shared/types/api'

import { createTeamSchema } from '#shared/schemas'
import { slugify } from '#shared/utils/format'

import { requirePermission } from '../../utils/auth'
import { errors, readValidated } from '../../utils/http'
import { assertCanLead } from '../../utils/members'
import { createTenantClient } from '../../utils/tenant'

/**
 * Create a team.
 *
 * OWNER/ADMIN only (`team:manage`). A MANAGER leads teams but does not create
 * or delete them — otherwise a manager could spin up a team, appoint
 * themselves lead, and widen their own scope.
 *
 * The slug is unique *per company*, so two tenants may both have `engineering`.
 */
export default defineEventHandler(async (event): Promise<TeamDetailResponse> => {
  const auth = requirePermission(event, 'team:manage')
  const input = await readValidated(event, createTeamSchema)
  const db = createTenantClient(auth)

  const requested = (input.slug?.trim() || slugify(input.name)).toLowerCase()
  if (!requested) {
    throw errors.badRequest('TEAM_SLUG_REQUIRED', 'نام تیم باید شامل حروف یا اعداد باشد')
  }

  if (input.leadId) {
    const lead = await db.user.findUnique({
      where: { id: input.leadId },
      select: { id: true, role: true },
    })
    if (!lead) throw errors.notFound('سرپرست انتخاب‌شده پیدا نشد')
    assertCanLead(lead.role)
  }

  // De-duplicate rather than reject: two teams called «مهندسی» are normal,
  // and blocking the second one teaches users to type nonsense slugs.
  let slug = requested.slice(0, 60)
  for (let attempt = 1; ; attempt += 1) {
    const candidate = attempt === 1 ? slug : `${requested.slice(0, 55)}-${attempt}`
    const clash = await db.team.findUnique({ where: { companyId_slug: { companyId: auth.companyId, slug: candidate } }, select: { id: true } })
    if (!clash) {
      slug = candidate
      break
    }
    if (attempt > 20) {
      throw errors.conflict('نام تیم تکراری است؛ نام دیگری انتخاب کنید')
    }
  }

  // Checked before the team exists: a lead who already belongs to another team
  // would trip the unique (companyId, userId) index and surface as a 500.
  if (input.leadId) {
    const existing = await db.teamMember.findFirst({
      where: { userId: input.leadId },
      select: { team: { select: { name: true } } },
    })
    if (existing) {
      throw errors.conflict(
        `سرپرست انتخاب‌شده عضو تیم «${existing.team.name}» است؛ ابتدا عضویت فعلی را تغییر دهید`,
      )
    }
  }

  const team = await db.team.create({
    data: {
      companyId: auth.companyId,
      name: input.name.trim(),
      slug,
      description: input.description?.trim() || null,
      leadId: input.leadId || null,
    },
  })

  // A lead is a team member too — creating the membership keeps the roster and
  // `leadId` from drifting apart.
  if (team.leadId) {
    await db.teamMember.create({
      data: {
        companyId: auth.companyId,
        teamId: team.id,
        userId: team.leadId,
        role: 'LEAD',
      },
    })
  }

  await db.auditLog.create({
    data: {
      companyId: auth.companyId,
      actorId: auth.userId,
      action: 'team.create',
      targetType: 'Team',
      targetId: team.id,
      ip: getRequestIP(event, { xForwardedFor: true }),
    },
  })

  return {
    team: {
      id: team.id,
      name: team.name,
      slug: team.slug,
      description: team.description,
      lead: null,
      members: [],
      createdAt: team.createdAt.toISOString(),
    },
    canEdit: true,
    candidates: [],
  }
})
