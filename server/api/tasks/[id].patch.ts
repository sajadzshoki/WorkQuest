import type { Prisma } from '#prisma/client'

import { updateTaskSchema } from '#shared/schemas'

import { requirePermission } from '../../utils/auth'
import { errors, readValidated } from '../../utils/http'
import { createTenantClient } from '../../utils/tenant'
import {
  TASK_SELECT,
  assertAssignable,
  assertUsableTeam,
  canManageTask,
  loadVisibleTask,
  notifyTask,
  recordTaskEvent,
  toTaskSummary,
} from '../../utils/tasks'

/**
 * `PATCH /api/tasks/:id` — a manager edits a task.
 *
 * Scope, not just role: holding `task:assign` gets you through the door, but
 * `canManageTask` decides whether *this* task is yours to edit. A manager
 * cannot retitle another manager's work just because they share a role.
 *
 * Status is intentionally not editable here — see `updateTaskSchema`.
 */
export default defineEventHandler(async (event) => {
  const auth = requirePermission(event, 'task:assign')
  const taskId = getRouterParam(event, 'id')
  if (!taskId) throw errors.notFound('تسک پیدا نشد')

  const input = await readValidated(event, updateTaskSchema)
  const task = await loadVisibleTask(auth, taskId)

  if (!await canManageTask(auth, task)) {
    throw errors.forbidden('اجازهٔ ویرایش این تسک را ندارید')
  }

  const db = createTenantClient(auth)
  const data: Prisma.TaskUpdateInput = {}
  const previousAssigneeId = task.assignee?.id ?? null
  let reassignedTo: string | null = null

  if (input.title !== undefined) data.title = input.title
  if (input.description !== undefined) data.description = input.description || null
  if (input.priority !== undefined) data.priority = input.priority
  if (input.dueDate !== undefined) data.dueDate = input.dueDate ?? null
  if (input.estimatedHours !== undefined) data.estimatedHours = input.estimatedHours ?? null
  if (input.xpReward !== undefined) data.xpReward = input.xpReward
  if (input.coinReward !== undefined) data.coinReward = input.coinReward

  if (input.teamId !== undefined) {
    const teamId = input.teamId || null
    if (teamId) await assertUsableTeam(auth, teamId)
    data.team = teamId ? { connect: { id: teamId } } : { disconnect: true }
  }

  if (input.assigneeId !== undefined && input.assigneeId !== previousAssigneeId) {
    const assignee = await assertAssignable(auth, input.assigneeId)
    data.assignee = { connect: { id: assignee.id } }
    data.assignedAt = new Date()
    reassignedTo = assignee.id
  }

  const updated = await db.$transaction(async (tx) => {
    await tx.task.update({ where: { id: taskId }, data })

    if (reassignedTo) {
      await recordTaskEvent(tx, {
        companyId: auth.companyId,
        taskId,
        actorId: auth.userId,
        action: 'task.reassigned',
        fromStatus: task.status,
        toStatus: task.status,
      })
      await notifyTask(tx, {
        companyId: auth.companyId,
        userId: reassignedTo,
        actorId: auth.userId,
        type: 'TASK_ASSIGNED',
        title: 'تسکی به شما محول شد',
        body: input.title ?? task.title,
        taskId,
      })
    }
    else {
      await recordTaskEvent(tx, {
        companyId: auth.companyId,
        taskId,
        actorId: auth.userId,
        action: 'task.updated',
        fromStatus: task.status,
        toStatus: task.status,
      })
    }

    await tx.auditLog.create({
      data: {
        companyId: auth.companyId,
        actorId: auth.userId,
        action: 'task.update',
        targetType: 'Task',
        targetId: taskId,
        data: { fields: Object.keys(data) },
      },
    })

    return tx.task.findUniqueOrThrow({ where: { id: taskId }, select: TASK_SELECT })
  })

  return { task: toTaskSummary(updated as never, new Date()) }
})
