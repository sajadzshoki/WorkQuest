import { taskProgressSchema } from '#shared/schemas'
import { ACTIVE_TASK_STATUSES } from '#shared/utils/task'

import { requireAuth } from '../../../utils/auth'
import { errors, readValidated } from '../../../utils/http'
import { createTenantClient } from '../../../utils/tenant'
import { TASK_SELECT, loadVisibleTask, toTaskSummary } from '../../../utils/tasks'

/**
 * `PATCH /api/tasks/:id/progress` — the assignee moves the completion slider.
 *
 * Separate from the transition endpoint because it is *not* a lifecycle move:
 * it says "I am 60% through", not "I am done". Only the assignee may write it —
 * a manager guessing at someone else's progress would make the number
 * worthless — and only while the task is actually being worked on, so a number
 * cannot be edited after approval.
 */
export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const taskId = getRouterParam(event, 'id')
  if (!taskId) throw errors.notFound('تسک پیدا نشد')

  const input = await readValidated(event, taskProgressSchema)
  const task = await loadVisibleTask(auth, taskId)

  if (task.assignee?.id !== auth.userId) {
    throw errors.forbidden('فقط انجام‌دهندهٔ تسک می‌تواند درصد پیشرفت را تغییر دهد')
  }
  if (!ACTIVE_TASK_STATUSES.includes(task.status)) {
    throw errors.conflict('برای ثبت پیشرفت، ابتدا تسک را شروع کنید')
  }

  const db = createTenantClient(auth)
  const updated = await db.task.update({
    where: { id: taskId },
    data: { progress: input.progress },
    select: TASK_SELECT,
  })

  return { task: toTaskSummary(updated as never, new Date()) }
})
