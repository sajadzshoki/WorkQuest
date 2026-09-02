import type { MemberSummary, UserStatus } from '#shared/types/api'
import type { Role } from '#shared/utils/permissions'

import { updateMemberSchema } from '#shared/schemas'
import { can } from '#shared/utils/permissions'

import { getManagedUserIds, requireAuth } from '../../utils/auth'
import { errors, readValidated } from '../../utils/http'
import { canEditTeam, maxAssignableRole, memberPermissions, roleAtMost } from '#shared/utils/member-scope'
import { ledTeamIds } from '../../utils/members'
import { createTenantClient } from '../../utils/tenant'

/**
 * Update a member.
 *
 * One endpoint, several distinct actions (rename, retitle, move team, change
 * role, suspend). What a caller may do is decided per field:
 *
 *  - `role` / `status` — OWNER/ADMIN only. A MANAGER never holds
 *    `member:manage`, so they cannot promote anyone or lock an account out.
 *  - `fullName` / `jobTitle` / `teamId` / `managerId` — OWNER/ADMIN anywhere,
 *    MANAGER only for their own reports and only into teams they lead.
 *
 * Two invariants are enforced here rather than trusted to the UI:
 *  - **nobody changes their own role** (`isSelf` blocks it), and
 *  - **a company always keeps at least one OWNER** — demoting or deactivating
 *    the last one would orphan the tenant.
 */
export default defineEventHandler(async (event): Promise<{ member: MemberSummary }> => {
  const auth = requireAuth(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw errors.notFound('کاربر مورد نظر پیدا نشد')

  const input = await readValidated(event, updateMemberSchema)
  const db = createTenantClient(auth)

  const managedUserIds = can(auth.role, 'member:manage')
    ? []
    : await getManagedUserIds(auth.companyId, auth.userId)

  const target = await db.user.findUnique({
    where: { id },
    select: {
      id: true,
      fullName: true,
      role: true,
      status: true,
      teamMemberships: { select: { id: true, teamId: true } },
    },
  })
  if (!target) throw errors.notFound('کاربر مورد نظر پیدا نشد')

  const permissions = memberPermissions(
    auth,
    { id: target.id, role: target.role as Role, status: target.status },
    managedUserIds,
  )
  if (!permissions.canEdit) throw errors.notFound('کاربر مورد نظر پیدا نشد')

  const isAdmin = can(auth.role, 'member:manage')
  const wantsRole = input.role !== undefined
  const wantsStatus = input.status !== undefined
  const wantsTeam = input.teamId !== undefined
  const wantsManager = input.managerId !== undefined
  const wantsName = input.fullName !== undefined
  const wantsTitle = input.jobTitle !== undefined

  if ((wantsRole || wantsStatus) && !isAdmin) {
    throw errors.forbidden('تغییر نقش یا وضعیت کاربران در اختیار مدیران شرکت است')
  }
  if (wantsRole && !permissions.canChangeRole) {
    throw errors.forbidden('امکان تغییر نقش این کاربر وجود ندارد')
  }

  // --- role change --------------------------------------------------------
  if (wantsRole) {
    const ceiling = maxAssignableRole(auth.role)
    if (!roleAtMost(input.role!, ceiling)) {
      throw errors.forbidden('اجازه تعیین این نقش را ندارید')
    }
    // No owner-count check here on purpose: `canChangeRole` is already false
    // for an OWNER target, so nobody can demote an owner at all. Transferring
    // ownership is a separate, deliberate action that does not exist yet.
  }

  // --- status change ------------------------------------------------------
  if (wantsStatus) {
    if (target.role === 'OWNER' && input.status !== 'ACTIVE') {
      const owners = await db.user.count({ where: { role: 'OWNER', status: 'ACTIVE' } })
      if (owners <= 1) {
        throw errors.conflict('شرکت باید حداقل یک مالک فعال داشته باشد')
      }
    }
    if (input.status !== 'ACTIVE' && target.id === auth.userId) {
      throw errors.conflict('امکان غیرفعال کردن حساب خودتان وجود ندارد')
    }
  }

  // --- team move ----------------------------------------------------------
  const led = await ledTeamIds(auth)
  const nextTeamId = wantsTeam ? (input.teamId || null) : undefined

  if (nextTeamId !== undefined && nextTeamId !== null) {
    const team = await db.team.findUnique({ where: { id: nextTeamId }, select: { id: true } })
    if (!team) throw errors.notFound('تیم انتخاب‌شده پیدا نشد')
    if (!canEditTeam(auth, nextTeamId, led)) {
      throw errors.forbidden('فقط می‌توانید اعضا را بین تیم‌های زیر نظر خودتان جابه‌جا کنید')
    }
  }
  else if (nextTeamId === null && !isAdmin) {
    throw errors.forbidden('حذف عضویت تیمی در اختیار مدیران شرکت است')
  }

  // --- manager assignment -------------------------------------------------
  const nextManagerId = wantsManager ? (input.managerId || null) : undefined
  if (nextManagerId) {
    if (nextManagerId === target.id) {
      throw errors.badRequest('MANAGER_SELF', 'مدیر مستقیم نمی‌تواند خود فرد باشد')
    }
    const manager = await db.user.findUnique({ where: { id: nextManagerId }, select: { id: true } })
    if (!manager) throw errors.notFound('مدیر انتخاب‌شده پیدا نشد')
    // The manager must share the member's team, otherwise the scope edge
    // would point outside the team and widen what they can see.
    const teamId = nextTeamId ?? target.teamMemberships[0]?.teamId ?? null
    if (teamId) {
      const inTeam = await db.teamMember.findFirst({
        where: { teamId, userId: nextManagerId },
        select: { id: true },
      })
      if (!inTeam) throw errors.badRequest('MANAGER_NOT_IN_TEAM', 'مدیر انتخاب‌شده عضو این تیم نیست')
    }
  }

  // --- apply --------------------------------------------------------------
  const userData: Record<string, unknown> = {}
  if (wantsName) userData.fullName = input.fullName
  if (wantsTitle) userData.jobTitle = input.jobTitle || null
  if (wantsRole) userData.role = input.role
  if (wantsStatus) userData.status = input.status

  const updated = await db.$transaction(async (tx) => {
    if (Object.keys(userData).length > 0) {
      await tx.user.update({ where: { id: target.id }, data: userData })
    }

    if (nextTeamId !== undefined) {
      const current = target.teamMemberships[0]
      if (nextTeamId === null) {
        if (current) await tx.teamMember.delete({ where: { id: current.id } })
      }
      else if (!current) {
        await tx.teamMember.create({
          data: {
            companyId: auth.companyId,
            teamId: nextTeamId,
            userId: target.id,
            managerId: nextManagerId ?? null,
          },
        })
      }
      else if (current.teamId !== nextTeamId) {
        // Move, keeping the team-level role and dropping a manager that does
        // not belong to the new team.
        await tx.teamMember.update({
          where: { id: current.id },
          data: { teamId: nextTeamId, managerId: nextManagerId ?? null },
        })
      }
      else if (wantsManager) {
        await tx.teamMember.update({
          where: { id: current.id },
          data: { managerId: nextManagerId },
        })
      }
    }

    // Revoke live sessions when the account is disabled or demoted, so the
    // change takes effect immediately instead of at the next token refresh.
    if ((wantsStatus && input.status !== 'ACTIVE') || (wantsRole && input.role !== target.role)) {
      await tx.session.updateMany({
        where: { userId: target.id, revokedAt: null },
        data: { revokedAt: new Date() },
      })
    }

    return tx.user.findUnique({
      where: { id: target.id },
      select: {
        id: true,
        fullName: true,
        phone: true,
        email: true,
        avatarUrl: true,
        jobTitle: true,
        role: true,
        status: true,
        lastLoginAt: true,
        teamMemberships: {
          select: {
            role: true,
            manager: { select: { id: true, fullName: true } },
            team: { select: { id: true, name: true, slug: true } },
          },
        },
      },
    })
  })

  if (!updated) throw errors.notFound('کاربر مورد نظر پیدا نشد')

  await db.auditLog.create({
    data: {
      companyId: auth.companyId,
      actorId: auth.userId,
      action: 'member.update',
      targetType: 'User',
      targetId: target.id,
      ip: getRequestIP(event, { xForwardedFor: true }),
      data: { fields: Object.keys(input) },
    },
  })

  const membership = updated.teamMemberships[0] ?? null
  return {
    member: {
      id: updated.id,
      fullName: updated.fullName,
      phone: updated.phone ?? '',
      email: updated.email,
      avatarUrl: updated.avatarUrl,
      jobTitle: updated.jobTitle,
      role: updated.role as Role,
      status: updated.status as UserStatus,
      lastLoginAt: updated.lastLoginAt?.toISOString() ?? null,
      team: membership?.team ?? null,
      manager: membership?.manager ?? null,
      teamRole: (membership?.role ?? null) as MemberSummary['teamRole'],
      subordinateCount: 0,
    },
  }
})
