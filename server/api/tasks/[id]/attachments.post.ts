import { createTaskAttachmentSchema } from '#shared/schemas'
import { can } from '#shared/utils/permissions'

import { requireAuth } from '../../../utils/auth'
import { errors, readValidated } from '../../../utils/http'
import { createTenantClient } from '../../../utils/tenant'
import { loadVisibleTask, recordTaskEvent } from '../../../utils/tasks'

/**
 * `POST /api/tasks/:id/attachments`
 *
 * Stricter than commenting: seeing a task is not a licence to attach files to
 * it. Only the assignee (delivering the work), the person who created it, or a
 * reviewer may add one.
 *
 * Binary upload is deliberately out of scope — the row records a validated URL
 * (protocol allow-listed in `taskAttachmentSchema`, because these are rendered
 * as links). Swapping in an object-store uploader later changes where the URL
 * comes from, not this endpoint's contract.
 */
export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const taskId = getRouterParam(event, 'id')
  if (!taskId) throw errors.notFound('تسک پیدا نشد')

  const input = await readValidated(event, createTaskAttachmentSchema)
  const task = await loadVisibleTask(auth, taskId)

  const mayAttach = task.assignee?.id === auth.userId
    || task.assigner?.id === auth.userId
    || can(auth.role, 'task:review')
  if (!mayAttach) throw errors.forbidden('اجازهٔ افزودن پیوست به این تسک را ندارید')

  const db = createTenantClient(auth)

  const attachment = await db.taskAttachment.create({
    data: {
      companyId: auth.companyId,
      taskId,
      uploadedById: auth.userId,
      fileName: input.fileName,
      url: input.url,
      mimeType: input.mimeType || null,
      sizeBytes: input.sizeBytes ?? null,
    },
    select: {
      id: true,
      fileName: true,
      url: true,
      mimeType: true,
      sizeBytes: true,
      createdAt: true,
      uploadedBy: { select: { id: true, fullName: true } },
    },
  })

  await recordTaskEvent(db, {
    companyId: auth.companyId,
    taskId,
    actorId: auth.userId,
    action: 'task.attachment_added',
    note: input.fileName,
  })

  setResponseStatus(event, 201)
  return { attachment: { ...attachment, createdAt: attachment.createdAt.toISOString() } }
})
