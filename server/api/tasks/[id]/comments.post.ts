import { createTaskCommentSchema } from '#shared/schemas'

import { requireAuth } from '../../../utils/auth'
import { errors, readValidated } from '../../../utils/http'
import { createTenantClient } from '../../../utils/tenant'
import { loadVisibleTask, notifyTask } from '../../../utils/tasks'

/**
 * `POST /api/tasks/:id/comments`
 *
 * Anyone who can see the task can comment on it: that is the whole point of the
 * thread — the assignee asks, the reviewer answers, both without leaving the
 * task. Visibility is the authorisation, and `loadVisibleTask` is what decides
 * it (404, not 403, for a task outside the caller's scope).
 *
 * The counterpart — assignee or assigner, whichever the author is not — gets a
 * notification, so a question does not sit unread.
 */
export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const taskId = getRouterParam(event, 'id')
  if (!taskId) throw errors.notFound('تسک پیدا نشد')

  const input = await readValidated(event, createTaskCommentSchema)
  const task = await loadVisibleTask(auth, taskId)
  const db = createTenantClient(auth)

  const comment = await db.taskComment.create({
    data: { companyId: auth.companyId, taskId, authorId: auth.userId, body: input.body },
    select: {
      id: true,
      body: true,
      createdAt: true,
      author: { select: { id: true, fullName: true, avatarUrl: true } },
    },
  })

  const counterpart = auth.userId === task.assignee?.id
    ? task.assigner?.id ?? null
    : task.assignee?.id ?? null

  await notifyTask(db, {
    companyId: auth.companyId,
    userId: counterpart,
    actorId: auth.userId,
    // A comment is not one of the fourteen product events — it stays in the
    // feed as an internal notice rather than stretching a task type to mean
    // something it does not.
    type: 'SYSTEM',
    title: 'یادداشت جدید روی تسک',
    body: task.title,
    taskId,
  })

  setResponseStatus(event, 201)
  return { comment: { ...comment, createdAt: comment.createdAt.toISOString() } }
})
