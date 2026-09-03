import type { Prisma } from '#prisma/client'
import type { TaskAction, TaskStatus } from '#shared/utils/task'
import type { TenantTx } from '../../../utils/tasks'

import { taskTransitionSchema } from '#shared/schemas'
import { nextStatus } from '#shared/utils/task'

import { requireAuth } from '../../../utils/auth'
import { errors, readValidated } from '../../../utils/http'
import { createTenantClient } from '../../../utils/tenant'
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
 * Approving also awards the task's XP and coins, writes the ledger rows and
 * bumps `UserProgress` — all inside the same transaction as the status change,
 * because a task that is approved but unpaid is a support ticket.
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

  const db = createTenantClient(auth)
  const now = new Date()
  const assigneeId = task.assignee?.id ?? null

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
          feedback: note,
          xpAwarded: input.action === 'approve' ? task.xpReward : 0,
          coinsAwarded: input.action === 'approve' ? task.coinReward : 0,
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

    if (input.action === 'approve' && assigneeId) {
      await awardTaskRewards(tx, {
        companyId: auth.companyId,
        userId: assigneeId,
        taskId,
        title: task.title,
        xp: task.xpReward,
        coins: task.coinReward,
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

  return { task: toTaskSummary(updated as never, now) }
})

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
 * Two immutable ledger rows plus an upsert on the counters — the ledger is the
 * source of truth and `UserProgress` is a cache of it, which is why both are
 * written together or not at all.
 */
async function awardTaskRewards(
  tx: TenantTx,
  input: { companyId: string, userId: string, taskId: string, title: string, xp: number, coins: number },
): Promise<void> {
  if (input.xp <= 0 && input.coins <= 0) return

  if (input.xp > 0) {
    await tx.xpTransaction.create({
      data: {
        companyId: input.companyId,
        userId: input.userId,
        amount: input.xp,
        source: 'TASK_REVIEW',
        reason: input.title,
        referenceType: 'Task',
        referenceId: input.taskId,
      },
    })
  }

  if (input.coins > 0) {
    await tx.coinTransaction.create({
      data: {
        companyId: input.companyId,
        userId: input.userId,
        amount: input.coins,
        source: 'TASK_REVIEW',
        reason: input.title,
        referenceType: 'Task',
        referenceId: input.taskId,
      },
    })
  }

  await tx.userProgress.upsert({
    where: { userId: input.userId },
    create: { companyId: input.companyId, userId: input.userId, xp: input.xp, coins: input.coins },
    update: { xp: { increment: input.xp }, coins: { increment: input.coins } },
  })
}
