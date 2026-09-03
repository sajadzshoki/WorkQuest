import { createTaskSchema } from '#shared/schemas'

import { requirePermission } from '../../utils/auth'
import { readValidated } from '../../utils/http'
import { createTenantClient } from '../../utils/tenant'
import {
  TASK_SELECT,
  assertAssignable,
  assertUsableTeam,
  notifyTask,
  recordTaskEvent,
  toTaskSummary,
} from '../../utils/tasks'

/**
 * `POST /api/tasks` — a manager creates work.
 *
 * Three permission layers, in order:
 *   1. the role gate (`task:assign`) — an EMPLOYEE never reaches the body;
 *   2. the *scope* check (`assertAssignable`) — a MANAGER can only assign to
 *      their own reports, which the role matrix cannot express;
 *   3. the tenant client — the company id is stamped by the extension, so a
 *      forged `companyId` in the body cannot cross tenants.
 *
 * The task, its attachments and its creation event are written in one
 * transaction: a task whose history starts halfway through would be worse than
 * no task at all.
 */
export default defineEventHandler(async (event) => {
  const auth = requirePermission(event, 'task:assign')
  const input = await readValidated(event, createTaskSchema)
  const db = createTenantClient(auth)

  const assignee = await assertAssignable(auth, input.assigneeId)
  const teamId = input.teamId || null
  if (teamId) await assertUsableTeam(auth, teamId)

  const now = new Date()

  const task = await db.$transaction(async (tx) => {
    const created = await tx.task.create({
      data: {
        companyId: auth.companyId,
        title: input.title,
        description: input.description || null,
        status: 'TODO',
        priority: input.priority,
        assigneeId: assignee.id,
        assignerId: auth.userId,
        teamId,
        dueDate: input.dueDate ?? null,
        estimatedHours: input.estimatedHours ?? null,
        xpReward: input.xpReward,
        coinReward: input.coinReward,
        assignedAt: now,
      },
      select: { id: true },
    })

    if (input.attachments.length > 0) {
      await tx.taskAttachment.createMany({
        data: input.attachments.map(file => ({
          companyId: auth.companyId,
          taskId: created.id,
          uploadedById: auth.userId,
          fileName: file.fileName,
          url: file.url,
          mimeType: file.mimeType || null,
          sizeBytes: file.sizeBytes ?? null,
        })),
      })
    }

    await recordTaskEvent(tx, {
      companyId: auth.companyId,
      taskId: created.id,
      actorId: auth.userId,
      action: 'task.created',
      toStatus: 'TODO',
    })

    await notifyTask(tx, {
      companyId: auth.companyId,
      userId: assignee.id,
      actorId: auth.userId,
      type: 'TASK_ASSIGNED',
      title: 'تسک جدیدی به شما محول شد',
      body: input.title,
      taskId: created.id,
    })

    await tx.auditLog.create({
      data: {
        companyId: auth.companyId,
        actorId: auth.userId,
        action: 'task.create',
        targetType: 'Task',
        targetId: created.id,
        data: { title: input.title, assigneeId: assignee.id },
      },
    })

    return tx.task.findUniqueOrThrow({ where: { id: created.id }, select: TASK_SELECT })
  })

  setResponseStatus(event, 201)
  return { task: toTaskSummary(task as never, now) }
})
