import { requireAuth } from '../../utils/auth'
import { errors } from '../../utils/http'
import { createTenantClient } from '../../utils/tenant'
import { canManageTask, fanOut, loadVisibleTask, toTaskSummary } from '../../utils/tasks'

/**
 * `GET /api/tasks/:id` — the full task page in one request.
 *
 * Returns the task plus its comments, attachments, reviews, history and — the
 * part the UI actually needs — the caller's own capabilities. Those flags are
 * computed from the same shared rules the mutation endpoints enforce, so the
 * buttons a client renders are exactly the buttons the server will honour.
 */
export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const taskId = getRouterParam(event, 'id')
  if (!taskId) throw errors.notFound('تسک پیدا نشد')

  const task = await loadVisibleTask(auth, taskId)
  const db = createTenantClient(auth)
  const now = new Date()

  // Bounded fan-out rather than `Promise.all`: five simultaneous queries is
  // five simultaneous pool connections, and a pooled deployment will refuse
  // the surplus rather than queue it. See `fanOut`.
  const [comments, attachments, reviews, events, canManage] = await fanOut([
    () => db.taskComment.findMany({
      where: { taskId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        body: true,
        createdAt: true,
        author: { select: { id: true, fullName: true, avatarUrl: true } },
      },
    }),
    () => db.taskAttachment.findMany({
      where: { taskId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fileName: true,
        url: true,
        mimeType: true,
        sizeBytes: true,
        createdAt: true,
        uploadedBy: { select: { id: true, fullName: true } },
      },
    }),
    () => db.taskReview.findMany({
      where: { taskId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        decision: true,
        score: true,
        feedback: true,
        xpAwarded: true,
        coinsAwarded: true,
        createdAt: true,
        reviewer: { select: { id: true, fullName: true, avatarUrl: true } },
      },
    }),
    () => db.taskEvent.findMany({
      where: { taskId },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        action: true,
        fromStatus: true,
        toStatus: true,
        note: true,
        createdAt: true,
        actor: { select: { id: true, fullName: true, avatarUrl: true } },
      },
    }),
    () => canManageTask(auth, task),
  ] as const)

  return {
    task: toTaskSummary(task, now),
    comments: comments.map(comment => ({
      ...comment,
      createdAt: comment.createdAt.toISOString(),
    })),
    attachments: attachments.map(file => ({
      ...file,
      createdAt: file.createdAt.toISOString(),
    })),
    reviews: reviews.map(review => ({
      ...review,
      createdAt: review.createdAt.toISOString(),
    })),
    events: events.map(entry => ({
      ...entry,
      createdAt: entry.createdAt.toISOString(),
    })),
    permissions: {
      canManage,
      isAssignee: task.assignee?.id === auth.userId,
    },
  }
})
