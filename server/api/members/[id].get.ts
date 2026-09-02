import type { MemberDetail, MemberDetailResponse } from '#shared/types/api'
import type { Role } from '#shared/utils/permissions'

import { can } from '#shared/utils/permissions'

import { getManagedUserIds, requireAuth } from '../../utils/auth'
import { errors } from '../../utils/http'
import { memberPermissions } from '#shared/utils/member-scope'
import { MEMBER_SELECT } from '../../utils/members'
import { createTenantClient } from '../../utils/tenant'

/**
 * One member's profile: identity, team, role, gamification snapshot and a
 * performance summary.
 *
 * Scope: OWNER/ADMIN see anyone in the company, a MANAGER sees their reports,
 * and every employee may see their own profile. Anything else is a 404 — the
 * endpoint deliberately does not distinguish "exists but you may not" from
 * "does not exist", so it cannot be used to enumerate the company.
 */
export default defineEventHandler(async (event): Promise<MemberDetailResponse> => {
  const auth = requireAuth(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw errors.notFound('کاربر مورد نظر پیدا نشد')

  const db = createTenantClient(auth)
  const managedUserIds = can(auth.role, 'member:manage')
    ? []
    : await getManagedUserIds(auth.companyId, auth.userId)

  const visible = new Set(managedUserIds).has(id) || id === auth.userId || can(auth.role, 'member:manage')
  if (!visible) throw errors.notFound('کاربر مورد نظر پیدا نشد')

  const user = await db.user.findUnique({
    where: { id },
    select: MEMBER_SELECT,
  })
  if (!user) throw errors.notFound('کاربر مورد نظر پیدا نشد')

  const membership = user.teamMemberships[0] ?? null

  const [progress, achievements, taskCounts, openTasks] = await Promise.all([
    db.userProgress.findUnique({
      where: { userId: user.id },
      select: {
        xp: true,
        coins: true,
        currentStreak: true,
        longestStreak: true,
        // `UserProgress` has no relation to `Level`, so the ladder position is
        // resolved from `minXp` below.
      },
    }),
    db.userAchievement.findMany({
      where: { userId: user.id },
      select: {
        unlockedAt: true,
        achievement: { select: { title: true, description: true, iconKey: true } },
      },
      orderBy: { unlockedAt: 'desc' },
      take: 12,
    }),
    db.task.groupBy({
      by: ['status'],
      where: { assigneeId: user.id },
      _count: { _all: true },
    }),
    db.task.count({
      where: {
        assigneeId: user.id,
        dueDate: { lt: new Date() },
        status: { in: ['ASSIGNED', 'IN_PROGRESS', 'SUBMITTED'] },
      },
    }),
  ])

  const countOf = (status: string) =>
    taskCounts.find(row => row.status === status)?._count._all ?? 0

  // Current ladder rung: the highest level whose `minXp` the member has passed.
  const level = progress
    ? await db.level.findFirst({
        where: { minXp: { lte: progress.xp } },
        orderBy: { level: 'desc' },
        select: { title: true, level: true, iconKey: true },
      })
    : null

  const permissions = memberPermissions(
    auth,
    { id: user.id, role: user.role as Role, status: user.status },
    managedUserIds,
  )

  const member: MemberDetail = {
    id: user.id,
    fullName: user.fullName,
    phone: user.phone ?? '',
    email: user.email,
    avatarUrl: user.avatarUrl,
    jobTitle: user.jobTitle,
    role: user.role as Role,
    status: user.status as MemberDetail['status'],
    lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
    team: membership?.team ?? null,
    manager: membership?.manager ?? null,
    teamRole: (membership?.role ?? null) as MemberDetail['teamRole'],
    subordinateCount: 0,
    createdAt: user.createdAt.toISOString(),
    progress: progress
      ? {
          xp: progress.xp,
          coins: progress.coins,
          currentStreak: progress.currentStreak,
          longestStreak: progress.longestStreak,
          level: level
            ? { name: level.title ?? `سطح ${level.level}`, level: level.level, iconKey: level.iconKey }
            : null,
        }
      : null,
    achievements: achievements.map(row => ({
      name: row.achievement.title,
      description: row.achievement.description,
      iconKey: row.achievement.iconKey,
      unlockedAt: row.unlockedAt.toISOString(),
    })),
    performance: {
      assigned: countOf('ASSIGNED'),
      completed: countOf('APPROVED'),
      inReview: countOf('SUBMITTED'),
      overdue: openTasks,
    },
    permissions,
  }

  if (permissions.canEdit || can(auth.role, 'member:manage')) {
    const reports = await db.teamMember.count({ where: { managerId: user.id } })
    member.subordinateCount = reports
  }

  return { member }
})
