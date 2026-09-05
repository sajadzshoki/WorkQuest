import type { MemberDetail, MemberDetailResponse } from '#shared/types/api'
import type { Role } from '#shared/utils/permissions'

import {
  averageOf,
  buildAverageDaySeries,
  dayKeyRange,
  isOnTime,
  localDayKey,
  rateOrNull,
} from '#shared/utils/analytics'
import { memberPermissions } from '#shared/utils/member-scope'
import { can } from '#shared/utils/permissions'
import { CLOSED_TASK_STATUSES } from '#shared/utils/task'

import { getManagedUserIds, requireAuth } from '../../utils/auth'
import { errors } from '../../utils/http'
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

  const [progress, achievements, badges, taskCounts, openTasks, approvedTasks, reviewScores, wallet, achievementCount, recognitionCount]
    = await Promise.all([
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
      db.userBadge.findMany({
        where: { userId: user.id },
        orderBy: { awardedAt: 'desc' },
        select: {
          awardedAt: true,
          badge: { select: { id: true, name: true, description: true, iconKey: true, tone: true, imageUrl: true } },
        },
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
          status: { notIn: [...CLOSED_TASK_STATUSES] },
        },
      }),
      // The deep performance profile: every approved task plus the APPROVED
      // review that graded it — together they power the average score, the
      // on-time rate, the 30-day trend and the recent list. One definition of
      // each number, four views of it.
      db.task.findMany({
        where: { assigneeId: user.id, status: 'APPROVED', completedAt: { not: null } },
        orderBy: { completedAt: 'desc' },
        select: { id: true, title: true, completedAt: true, dueDate: true },
      }),
      db.taskReview.findMany({
        where: { decision: 'APPROVED', task: { assigneeId: user.id } },
        select: { taskId: true, score: true },
      }),
      db.wallet.findUnique({
        where: { userId: user.id },
        select: { lifetimeEarned: true, lifetimeSpent: true },
      }),
      db.userAchievement.count({ where: { userId: user.id } }),
      db.recognition.count({ where: { toUserId: user.id } }),
    ])

  const countOf = (status: string) =>
    taskCounts.find(row => row.status === status)?._count._all ?? 0

  // The performance profile — same rules as the company dashboard: averages
  // are null over nothing, undated tasks never count as late, and trend days
  // are company-local. Scores come from the APPROVED review of each task.
  const scoreByTask = new Map(
    reviewScores.filter(review => review.score !== null).map(review => [review.taskId, review.score!] as const),
  )
  const scoredTasks = approvedTasks.filter(task => scoreByTask.has(task.id))
  const withDueDate = approvedTasks.filter(task => task.dueDate !== null)
  const now = new Date()
  const dayKeys = dayKeyRange(30, auth.company.timezone, now)
  const trendSource = scoredTasks
    .filter(task => dayKeys.includes(localDayKey(task.completedAt!, auth.company.timezone)))
    .map(task => ({
      day: localDayKey(task.completedAt!, auth.company.timezone),
      value: scoreByTask.get(task.id)!,
    }))

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
    badges: badges.map(row => ({
      id: row.badge.id,
      name: row.badge.name,
      description: row.badge.description,
      iconKey: row.badge.iconKey,
      tone: row.badge.tone,
      imageUrl: row.badge.imageUrl,
      awardedAt: row.awardedAt.toISOString(),
    })),
    performance: {
      // "Assigned" for the profile means open work, i.e. everything not yet
      // approved and not yet handed in.
      assigned: countOf('TODO') + countOf('IN_PROGRESS') + countOf('NEEDS_REVISION'),
      completed: countOf('APPROVED'),
      inReview: countOf('SUBMITTED'),
      overdue: openTasks,
    },
    performanceProfile: {
      tasksCompleted: approvedTasks.length,
      averageScore: averageOf(scoredTasks.map(task => scoreByTask.get(task.id)!)),
      onTimeRate: rateOrNull(
        withDueDate.filter(task => isOnTime(task)).length,
        withDueDate.length,
      ),
      coinsEarned: wallet?.lifetimeEarned ?? 0,
      coinsSpent: wallet?.lifetimeSpent ?? 0,
      achievements: achievementCount,
      recognition: recognitionCount,
      scoreTrend: buildAverageDaySeries(trendSource, dayKeys),
      recentTasks: approvedTasks.slice(0, 8).map(task => ({
        id: task.id,
        title: task.title,
        score: scoreByTask.get(task.id) ?? null,
        completedAt: task.completedAt!.toISOString(),
      })),
    },
    permissions,
  }

  if (permissions.canEdit || can(auth.role, 'member:manage')) {
    const reports = await db.teamMember.count({ where: { managerId: user.id } })
    member.subordinateCount = reports
  }

  return { member }
})
