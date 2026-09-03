import type { Prisma } from '#prisma/client'
import type { TaskAction, TaskStatus } from '#shared/utils/task'
import type { TenantTx } from '../../../utils/tasks'

import { taskTransitionSchema } from '#shared/schemas'
import { calculateReward, taskRewardKey } from '#shared/utils/rewards'
import { nextStatus } from '#shared/utils/task'

import { requireAuth } from '../../../utils/auth'
import { runGamification, type GamificationOutcome } from '../../../utils/gamification'
import { errors, readValidated } from '../../../utils/http'
import { createTenantClient } from '../../../utils/tenant'
import { applyCoinDelta, applyXpDelta, loadRewardRules, syncLevel } from '../../../utils/wallet'
import {
  TASK_SELECT,
  assertTransitionAllowed,
  loadVisibleTask,
  notifyTask,
  recordTaskEvent,
  toTaskSummary,
} from '../../../utils/tasks'

/**
 * `POST /api/tasks/:id/transition` — the only way a task changes status.
 *
 * Funnelling all five moves through one handler is the point: there is exactly
 * one place where a status is written, so there is exactly one place where the
 * lifecycle can be violated — and it is guarded by `assertTransitionAllowed`,
 * which delegates to the shared, unit-tested rules.
 *
 * Bodies carry an *action* (`start`, `submit`, `approve`, `request_revision`,
 * `reopen`), never a target status, so an unknown or skipped state is rejected
 * by Zod before any row is read.
 *
 * Approving also prices the work through the reward engine and pays it out —
 * inside the same transaction as the status change, because a task that is
 * approved but unpaid is a support ticket. The payout is keyed on the task id,
 * so approving twice pays once.
 */
export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const taskId = getRouterParam(event, 'id')
  if (!taskId) throw errors.notFound('تسک پیدا نشد')

  const input = await readValidated(event, taskTransitionSchema)
  const task = await loadVisibleTask(auth, taskId)

  assertTransitionAllowed(auth, task, input.action)

  const target = nextStatus(task.status, input.action)
  // `assertTransitionAllowed` already proved the edge exists; this keeps the
  // type narrow without a non-null assertion.
  if (!target) throw errors.conflict('این تغییر وضعیت با وضعیت فعلی تسک سازگار نیست')

  const note = input.note?.trim() || null
  if (input.action === 'request_revision' && !note) {
    throw errors.badRequest('REVISION_NOTE_REQUIRED', 'برای درخواست اصلاح، توضیح بنویسید')
  }

  // An approval without a score has no defensible payout, so it is refused
  // rather than silently paying zero (or paying full).
  if (input.action === 'approve' && input.score === undefined) {
    throw errors.badRequest('SCORE_REQUIRED', 'برای تأیید تسک، امتیاز را ثبت کنید')
  }

  const db = createTenantClient(auth)
  const now = new Date()
  const assigneeId = task.assignee?.id ?? null

  // Price the work up front so the review row, the ledger rows and the
  // response all quote exactly the same numbers.
  const rules = await loadRewardRules(db, auth.companyId)
  const breakdown = input.action === 'approve'
    ? calculateReward({
        score: input.score ?? 0,
        qualityScore: input.qualityScore ?? null,
        priority: task.priority,
        dueDate: task.dueDate,
        // Approving a task that was never formally submitted (a manager
        // closing out their own work) is timed as of now.
        submittedAt: task.submittedAt ?? now,
        revisionCount: task.revisionCount,
        baseXp: task.xpReward > 0 ? task.xpReward : null,
        baseCoins: task.coinReward > 0 ? task.coinReward : null,
      }, rules)
    : null

  let payout: TaskPayout | null = null
  let gamification: GamificationOutcome | null = null

  const updated = await db.$transaction(async (tx) => {
    await tx.task.update({
      where: { id: taskId },
      data: buildData(task.status, target, input.action, input.progress, now),
    })

    await recordTaskEvent(tx, {
      companyId: auth.companyId,
      taskId,
      actorId: auth.userId,
      action: `task.${input.action}`,
      fromStatus: task.status,
      toStatus: target,
      note,
    })

    // --- review outcomes --------------------------------------------------
    if (input.action === 'approve' || input.action === 'request_revision') {
      await tx.taskReview.create({
        data: {
          companyId: auth.companyId,
          taskId,
          reviewerId: auth.userId,
          decision: input.action === 'approve' ? 'APPROVED' : 'CHANGES_REQUESTED',
          score: input.score ?? null,
          qualityScore: input.qualityScore ?? null,
          timelinessScore: input.timelinessScore ?? null,
          feedback: note,
          xpAwarded: breakdown?.xp ?? 0,
          coinsAwarded: breakdown?.coins ?? 0,
          // `RewardBreakdown` is a plain JSON-safe object; the cast is only to
          // satisfy Prisma's structural `InputJsonValue`, which cannot see
          // that an interface has no non-serialisable members.
          rewardBreakdown: breakdown
            ? ({ ...breakdown, ruleVersion: rules.version } as unknown as Prisma.InputJsonValue)
            : undefined,
        },
      })

      await notifyTask(tx, {
        companyId: auth.companyId,
        userId: assigneeId,
        actorId: auth.userId,
        type: 'TASK_REVIEWED',
        title: input.action === 'approve' ? 'تسک شما تأیید شد' : 'تسک شما نیاز به اصلاح دارد',
        body: task.title,
        taskId,
      })
    }

    if (input.action === 'approve' && assigneeId && breakdown) {
      payout = await awardTaskRewards(tx, {
        companyId: auth.companyId,
        userId: assigneeId,
        taskId,
        title: task.title,
        xp: breakdown.xp,
        coins: breakdown.coins,
      })

      // Streaks and achievements follow the payout in the same transaction, so
      // an unlock and its ledger rows never diverge from the task's status.
      gamification = await runGamification(tx, {
        companyId: auth.companyId,
        userId: assigneeId,
        activityAt: now,
        timezone: auth.company.timezone,
      })
    }

    // --- submission -------------------------------------------------------
    if (input.action === 'submit') {
      await notifyTask(tx, {
        companyId: auth.companyId,
        userId: task.assigner?.id ?? null,
        actorId: auth.userId,
        type: 'TASK_SUBMITTED',
        title: 'تسکی برای بازبینی ارسال شد',
        body: task.title,
        taskId,
      })
    }

    await tx.auditLog.create({
      data: {
        companyId: auth.companyId,
        actorId: auth.userId,
        action: `task.${input.action}`,
        targetType: 'Task',
        targetId: taskId,
        data: { from: task.status, to: target },
      },
    })

    return tx.task.findUniqueOrThrow({ where: { id: taskId }, select: TASK_SELECT })
  })

  return {
    task: toTaskSummary(updated as never, now),
    reward: breakdown ? { ...breakdown, ruleVersion: rules.version } : null,
    payout,
    gamification,
  }
})

interface TaskPayout {
  /** False when this task had already been paid — see `taskRewardKey`. */
  applied: boolean
  xp: number
  coins: number
  balance: number
  level: number
  levelUp: boolean
}

/**
 * The column writes that accompany each move.
 *
 * Timestamps are set once and never cleared: `startedAt` keeps the *first*
 * time the work began even after a revision loop, which is what makes
 * cycle-time reporting meaningful later.
 */
function buildData(
  from: TaskStatus,
  to: TaskStatus,
  action: TaskAction,
  progress: number | undefined,
  now: Date,
): Prisma.TaskUpdateInput {
  const data: Prisma.TaskUpdateInput = { status: to }

  if (progress !== undefined) data.progress = progress

  switch (action) {
    case 'start':
      // Only stamp the first start; a restart after revision keeps the original.
      data.startedAt = undefined
      if (from === 'TODO') data.startedAt = now
      break
    case 'submit':
      data.submittedAt = now
      if (progress === undefined) data.progress = 100
      break
    case 'approve':
      data.completedAt = now
      data.progress = 100
      break
    case 'request_revision':
      data.revisionCount = { increment: 1 }
      break
    case 'reopen':
      data.submittedAt = null
      data.completedAt = null
      break
  }

  return data
}

/**
 * Pay out an approved task.
 *
 * Both ledgers are keyed on the *task*, not the review, so a duplicate
 * approval — a double-clicked button, a retried request, a second reviewer
 * racing the first — collides on the unique index and pays nothing further.
 * `applied: false` is a normal outcome, not an error.
 */
async function awardTaskRewards(
  tx: TenantTx,
  input: { companyId: string, userId: string, taskId: string, title: string, xp: number, coins: number },
): Promise<TaskPayout> {
  const key = taskRewardKey(input.taskId)

  const xpResult = await applyXpDelta(tx, {
    companyId: input.companyId,
    userId: input.userId,
    amount: input.xp,
    source: 'TASK_REVIEW',
    reason: input.title,
    referenceType: 'Task',
    referenceId: input.taskId,
    idempotencyKey: key,
  })

  const coinResult = await applyCoinDelta(tx, {
    companyId: input.companyId,
    userId: input.userId,
    amount: input.coins,
    type: 'TASK_REWARD',
    source: 'TASK_REVIEW',
    reason: input.title,
    referenceType: 'Task',
    referenceId: input.taskId,
    idempotencyKey: key,
  })

  const { level, levelUp } = await syncLevel(tx, input.companyId, input.userId, xpResult.xp)

  return {
    applied: xpResult.applied || coinResult.applied,
    xp: xpResult.applied ? input.xp : 0,
    coins: coinResult.applied ? input.coins : 0,
    balance: coinResult.balance,
    level,
    levelUp,
  }
}
