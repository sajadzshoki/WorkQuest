import type { Prisma } from '#prisma/client'
import type { AuthContext, TeamDetailResponse } from '#shared/types/api'

import { canLeadRole } from '#shared/utils/member-scope'

import { errors } from './http'
import { createTenantClient } from './tenant'

/**
 * Server-side plumbing for people and teams.
 *
 * The *rules* — who may see or act on whom — live in
 * `shared/utils/member-scope.ts`, where they are pure and unit-tested. This
 * module only holds what genuinely needs the database: the shared Prisma
 * `select`, the led-team lookup, the response mapping, and the guards whose
 * answer depends on rows rather than on roles.
 */

/** A `User` row with its single team membership attached. */
export type MemberRow = {
  id: string
  fullName: string
  phone: string | null
  email: string | null
  avatarUrl: string | null
  jobTitle: string | null
  role: string
  status: string
  lastLoginAt: Date | null
  createdAt: Date
  teamMemberships: Array<{
    id: string
    teamId: string
    role: string
    managerId: string | null
    joinedAt: Date
    manager: { id: string, fullName: string } | null
    team: { id: string, name: string, slug: string }
  }>
}

/** The select clause every member query shares. */
export const MEMBER_SELECT = {
  id: true,
  fullName: true,
  phone: true,
  email: true,
  avatarUrl: true,
  jobTitle: true,
  role: true,
  status: true,
  lastLoginAt: true,
  createdAt: true,
  teamMemberships: {
    select: {
      id: true,
      teamId: true,
      role: true,
      managerId: true,
      joinedAt: true,
      manager: { select: { id: true, fullName: true } },
      team: { select: { id: true, name: true, slug: true } },
    },
  },
} satisfies Prisma.UserSelect

/**
 * Reject a team lead whose company role is too low.
 *
 * The predicate is shared and unit-tested; the message stays here because it is
 * a server error envelope.
 */
export function assertCanLead(role: string): void {
  if (!canLeadRole(role as never)) {
    throw errors.badRequest(
      'LEAD_ROLE_TOO_LOW',
      'سرپرست تیم باید حداقل نقش «مدیر تیم» داشته باشد؛ ابتدا نقش این کاربر را ارتقا دهید',
    )
  }
}

/**
 * Enforce "one primary team per employee" before a write.
 *
 * `TeamMember` carries a unique `(companyId, userId)`, so a second membership
 * fails at the database level with P2002 — which surfaces to the client as a
 * 500. Passing the lookup result through this turns it into a 409 that names
 * the team the person is already in, so the UI can say what to do instead.
 *
 * It takes the *result* rather than a client because the callers hold three
 * different client shapes (tenant client, transaction client) and the check
 * belongs next to the insert in each of them.
 *
 * @param existing the member's current membership in a **different** team, or
 *   null when the slot is free.
 */
export function rejectSecondMembership(
  existing: { team: { name: string } } | null,
): void {
  if (existing) {
    throw errors.conflict(
      `این کاربر عضو تیم «${existing.team.name}» است؛ ابتدا عضویت فعلی را تغییر دهید`,
    )
  }
}

/** Teams the caller leads — the scope input for `canEditTeam`. */
export async function ledTeamIds(auth: AuthContext): Promise<string[]> {
  const teams = await createTenantClient(auth).team.findMany({
    where: { leadId: auth.userId },
    select: { id: true },
  })
  return teams.map(team => team.id)
}

/**
 * Shared response shaping for the team write endpoints.
 *
 * Every mutation returns the full team so the client can replace its state in
 * one step instead of re-fetching and racing with the next edit.
 *
 * `candidates` is empty here on purpose: that pool is only computed for callers
 * who may add someone, and `GET /api/teams/:id` owns that query.
 */
export async function teamDetail(
  db: ReturnType<typeof createTenantClient>,
  teamId: string,
): Promise<TeamDetailResponse> {
  const team = await db.team.findUnique({
    where: { id: teamId },
    include: {
      lead: { select: { id: true, fullName: true } },
      members: {
        include: {
          user: { select: { id: true, fullName: true, avatarUrl: true, jobTitle: true, role: true } },
          manager: { select: { id: true, fullName: true } },
        },
        orderBy: { joinedAt: 'asc' },
      },
    },
  })
  if (!team) throw errors.notFound('تیم پیدا نشد')

  return {
    team: {
      id: team.id,
      name: team.name,
      slug: team.slug,
      description: team.description,
      lead: team.lead,
      members: team.members.map(member => ({
        id: member.id,
        userId: member.user.id,
        fullName: member.user.fullName,
        jobTitle: member.user.jobTitle,
        avatarUrl: member.user.avatarUrl,
        role: member.role,
        companyRole: member.user.role as TeamDetailResponse['team']['members'][number]['companyRole'],
        manager: member.manager,
        joinedAt: member.joinedAt.toISOString(),
      })),
      createdAt: team.createdAt.toISOString(),
    },
    canEdit: true,
    candidates: [],
  }
}
