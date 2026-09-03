import type { TaskMutationResponse, TaskSummary } from '#shared/types/api'
import type { TaskAction, TaskStatus } from '#shared/utils/task'

import { availableActions, daysUntilDue } from '#shared/utils/task'

/**
 * Task helpers shared by the list, the cards and the dashboards.
 *
 * The permission logic here is the *same* function the server enforces
 * (`availableActions`), so a button is never rendered that the API would
 * refuse — and, just as importantly, the UI is not the security boundary: it
 * only mirrors a decision the server makes again on every mutation.
 */
export function useTaskActions() {
  const { user } = useSession()
  const { can } = useCan()

  /** The moves the current user can make on a task, right now. */
  function actionsFor(task: Pick<TaskSummary, 'status' | 'assignee'>): TaskAction[] {
    return availableActions(task.status as TaskStatus, {
      isAssignee: task.assignee?.id === user.value?.id,
      canReview: can('task:review'),
    })
  }

  function isAssignee(task: Pick<TaskSummary, 'assignee'>): boolean {
    return task.assignee?.id === user.value?.id
  }

  /** Perform a lifecycle move and hand back the refreshed task. */
  async function transition(
    taskId: string,
    action: TaskAction,
    payload: { note?: string, score?: number, progress?: number } = {},
  ): Promise<TaskSummary> {
    const response = await $fetch<TaskMutationResponse>(`/api/tasks/${taskId}/transition`, {
      method: 'POST',
      body: { action, ...payload },
    })
    return response.task
  }

  async function setProgress(taskId: string, progress: number): Promise<TaskSummary> {
    const response = await $fetch<TaskMutationResponse>(`/api/tasks/${taskId}/progress`, {
      method: 'PATCH',
      body: { progress },
    })
    return response.task
  }

  return { actionsFor, isAssignee, transition, setProgress }
}

/**
 * Persian-first due-date wording.
 *
 * Deliberately relative rather than a bare date: "۳ روز مانده" is what a person
 * actually needs to know, and the exact Persian date is still available in the
 * tooltip. Uses the shared calendar-day maths so it matches the server's
 * overdue flag instead of drifting by a few hours.
 */
export function useDueLabel() {
  const { t } = useI18n()
  const format = useLocaleFormat()
  const { company } = useSession()

  function label(dueDate: string | null): string {
    if (!dueDate) return t('tasks.noDueDate')
    const days = daysUntilDue(dueDate, new Date(), company.value?.timezone ?? 'Asia/Tehran')
    if (days === null) return t('tasks.noDueDate')
    if (days === 0) return t('tasks.dueToday')
    if (days === 1) return t('tasks.dueTomorrow')
    if (days > 0) return t('tasks.dueIn', { days: format.number(days) })
    return t('tasks.overdue', { days: format.number(Math.abs(days)) })
  }

  /** Full Persian calendar date, for tooltips and the detail page. */
  function exact(dueDate: string | null): string {
    return dueDate ? format.date(dueDate) : t('tasks.noDueDate')
  }

  return { label, exact }
}
