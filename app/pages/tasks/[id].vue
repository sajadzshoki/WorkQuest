<script setup lang="ts">
import type { TaskDetailResponse } from '#shared/types/api'
import type { TaskAction } from '#shared/utils/task'

definePageMeta({ middleware: ['auth'] })

const route = useRoute()
const { t } = useI18n()
const format = useLocaleFormat()
const localePath = useLocalePath()
const toast = useToast()
const due = useDueLabel()
const { actionsFor, transition, setProgress } = useTaskActions()

const taskId = computed(() => String(route.params.id))

const { data, refresh, status } = await useFetch<TaskDetailResponse>(
  () => `/api/tasks/${taskId.value}`,
)

const task = computed(() => data.value?.task ?? null)
const actions = computed(() => (task.value ? actionsFor(task.value) : []))
const isAssignee = computed(() => data.value?.permissions.isAssignee ?? false)
const canManage = computed(() => data.value?.permissions.canManage ?? false)

const busy = ref(false)
const editOpen = ref(false)

// --- review ----------------------------------------------------------------
// The review modal owns the scores, the reward preview and the decision
// buttons, so the page only has to open it.
const reviewOpen = ref(false)

function openReview(_action: 'approve' | 'request_revision') {
  reviewOpen.value = true
}

// --- progress ---------------------------------------------------------------
const progressDraft = ref(0)
watch(
  task,
  (value) => {
    progressDraft.value = value?.progress ?? 0
  },
  { immediate: true },
)

const canEditProgress = computed(() =>
  isAssignee.value && (task.value?.status === 'IN_PROGRESS' || task.value?.status === 'NEEDS_REVISION'))

// --- comments ---------------------------------------------------------------
const commentBody = ref('')

// --- attachments ------------------------------------------------------------
const attachmentOpen = ref(false)
const attachmentName = ref('')
const attachmentUrl = ref('')

function notify(error: unknown) {
  const payload = (error as { data?: { message?: string } }).data
  toast.add({
    title: payload?.message ?? t('errors.generic'),
    color: 'error',
    icon: 'i-heroicons-exclamation-triangle',
  })
}

async function run(action: TaskAction, payload: Record<string, unknown> = {}) {
  busy.value = true
  try {
    await transition(taskId.value, action, payload)
    toast.add({
      title: t(`tasks.actionDone.${action}`),
      color: 'success',
      icon: 'i-heroicons-check-circle',
    })
    reviewOpen.value = false
    await refresh()
  }
  catch (error) { notify(error) }
  finally { busy.value = false }
}

async function saveProgress() {
  busy.value = true
  try {
    await setProgress(taskId.value, progressDraft.value)
    await refresh()
  }
  catch (error) { notify(error) }
  finally { busy.value = false }
}

async function addComment() {
  if (!commentBody.value.trim()) return
  busy.value = true
  try {
    await $fetch(`/api/tasks/${taskId.value}/comments`, {
      method: 'POST',
      body: { body: commentBody.value.trim() },
    })
    commentBody.value = ''
    await refresh()
  }
  catch (error) { notify(error) }
  finally { busy.value = false }
}

async function addAttachment() {
  if (!attachmentName.value.trim() || !attachmentUrl.value.trim()) return
  busy.value = true
  try {
    await $fetch(`/api/tasks/${taskId.value}/attachments`, {
      method: 'POST',
      body: { fileName: attachmentName.value.trim(), url: attachmentUrl.value.trim() },
    })
    attachmentName.value = ''
    attachmentUrl.value = ''
    attachmentOpen.value = false
    await refresh()
  }
  catch (error) { notify(error) }
  finally { busy.value = false }
}

/** Buttons that fire straight away; reviewing goes through the modal. */
const inlineActions = computed(() => actions.value.filter(action => action === 'start' || action === 'submit'))
</script>

<template>
  <div>
    <div
      v-if="status === 'pending' && !data"
      class="grid gap-4"
    >
      <div class="wq-skeleton h-32 rounded-xl" />
      <div class="wq-skeleton h-64 rounded-xl" />
    </div>

    <CommonEmptyState
      v-else-if="!task"
      icon="i-heroicons-exclamation-triangle"
      :title="t('errors.notFound')"
      class="wq-panel"
    />

    <div v-else>
      <UButton
        :to="localePath('/tasks')"
        color="neutral"
        variant="ghost"
        icon="i-heroicons-arrow-right"
        size="sm"
        class="mb-3"
      >
        {{ t('tasks.backToList') }}
      </UButton>

      <div class="grid gap-4 lg:grid-cols-3">
        <!-- ---------------------------------------------------------------- -->
        <!-- Main column                                                       -->
        <!-- ---------------------------------------------------------------- -->
        <div class="grid gap-4 lg:col-span-2">
          <section class="wq-panel p-4 sm:p-5">
            <div class="flex flex-wrap items-center gap-2">
              <GamificationTaskStatusBadge
                :status="task.status"
                size="md"
              />
              <GamificationPriorityBadge :priority="task.priority" />
              <span
                v-if="task.team"
                class="rounded-md bg-elevated px-2 py-0.5 text-[11px] text-muted"
              >{{ task.team.name }}</span>
              <span
                v-if="task.isOverdue"
                class="rounded-md bg-error/12 px-2 py-0.5 text-[11px] font-bold text-error"
              >{{ due.label(task.dueDate) }}</span>
            </div>

            <h1 class="mt-3 text-xl font-black text-highlighted sm:text-2xl">
              {{ task.title }}
            </h1>

            <p
              v-if="task.description"
              class="mt-3 whitespace-pre-line text-sm leading-7 text-muted"
            >
              {{ task.description }}
            </p>

            <!-- Progress -->
            <div class="mt-5">
              <div class="mb-2 flex items-center justify-between text-xs font-bold text-muted">
                <span>{{ t('tasks.progress') }}</span>
                <span class="tabular-nums">{{ t('tasks.progressValue', { value: format.number(progressDraft) }) }}</span>
              </div>
              <USlider
                v-if="canEditProgress"
                v-model="progressDraft"
                :min="0"
                :max="100"
                :step="5"
                @update:model-value="saveProgress()"
              />
              <UProgress
                v-else
                :model-value="task.progress"
                :color="task.status === 'APPROVED' ? 'success' : 'primary'"
              />
            </div>

            <!-- Actions -->
            <div class="mt-5 flex flex-col gap-2 border-t border-default pt-4 sm:flex-row sm:flex-wrap">
              <UButton
                v-for="action in inlineActions"
                :key="action"
                color="primary"
                :variant="action === 'submit' ? 'solid' : 'soft'"
                size="lg"
                block
                class="sm:w-auto"
                :loading="busy"
                :icon="action === 'start' ? 'i-heroicons-play' : 'i-heroicons-paper-airplane'"
                @click="run(action)"
              >
                {{ t(`tasks.actions.${action}`) }}
              </UButton>

              <UButton
                v-if="actions.includes('approve')"
                color="success"
                size="lg"
                block
                class="sm:w-auto"
                icon="i-heroicons-check-badge"
                @click="openReview('approve')"
              >
                {{ t('tasks.actions.approve') }}
              </UButton>

              <UButton
                v-if="actions.includes('request_revision')"
                color="warning"
                variant="soft"
                size="lg"
                block
                class="sm:w-auto"
                icon="i-heroicons-arrow-path"
                @click="openReview('request_revision')"
              >
                {{ t('tasks.actions.request_revision') }}
              </UButton>

              <UButton
                v-if="canManage"
                color="neutral"
                variant="ghost"
                size="lg"
                block
                class="sm:w-auto sm:ms-auto"
                icon="i-heroicons-pencil-square"
                @click="editOpen = true"
              >
                {{ t('tasks.edit') }}
              </UButton>
            </div>
          </section>

          <!-- Comments -->
          <CommonSectionCard
            :title="t('tasks.comments')"
            icon="i-heroicons-chat-bubble-left-right"
          >
            <div class="grid gap-3 p-4">
              <p
                v-if="!data?.comments.length"
                class="py-4 text-center text-xs text-dimmed"
              >
                {{ t('tasks.noComments') }}
              </p>

              <div
                v-for="comment in data?.comments"
                :key="comment.id"
                class="flex gap-3"
              >
                <UAvatar
                  :src="comment.author.avatarUrl ?? undefined"
                  :text="comment.author.fullName.charAt(0)"
                  size="sm"
                  class="mt-0.5 shrink-0"
                />
                <div class="min-w-0 flex-1 rounded-xl bg-elevated px-3 py-2">
                  <div class="flex flex-wrap items-baseline gap-2">
                    <span class="text-xs font-bold text-highlighted">{{ comment.author.fullName }}</span>
                    <span class="text-[11px] text-dimmed">{{ format.relative(comment.createdAt) }}</span>
                  </div>
                  <p class="mt-1 whitespace-pre-line text-xs leading-6 text-muted">
                    {{ comment.body }}
                  </p>
                </div>
              </div>

              <div class="flex flex-col gap-2 border-t border-default pt-3 sm:flex-row">
                <UTextarea
                  v-model="commentBody"
                  :rows="2"
                  :placeholder="t('tasks.commentPlaceholder')"
                  class="flex-1"
                />
                <UButton
                  color="primary"
                  size="md"
                  icon="i-heroicons-paper-airplane"
                  :loading="busy"
                  :disabled="!commentBody.trim()"
                  class="sm:self-end"
                  @click="addComment"
                >
                  {{ t('tasks.addComment') }}
                </UButton>
              </div>
            </div>
          </CommonSectionCard>

          <!-- History -->
          <CommonSectionCard
            :title="t('tasks.history')"
            icon="i-heroicons-clock"
          >
            <ol class="grid gap-3 p-4">
              <li
                v-for="entry in data?.events"
                :key="entry.id"
                class="flex items-start gap-3 text-xs"
              >
                <span class="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                <div class="min-w-0">
                  <p class="font-semibold text-highlighted">
                    {{ t(`tasks.events.${entry.action}`, entry.action) }}
                    <span
                      v-if="entry.actor"
                      class="font-normal text-muted"
                    >— {{ entry.actor.fullName }}</span>
                  </p>
                  <p
                    v-if="entry.note"
                    class="mt-0.5 text-muted"
                  >
                    {{ entry.note }}
                  </p>
                  <p class="mt-0.5 text-dimmed">
                    {{ format.relative(entry.createdAt) }}
                  </p>
                </div>
              </li>
            </ol>
          </CommonSectionCard>
        </div>

        <!-- ---------------------------------------------------------------- -->
        <!-- Sidebar                                                           -->
        <!-- ---------------------------------------------------------------- -->
        <div class="grid content-start gap-4">
          <CommonSectionCard
            :title="t('tasks.detailTitle')"
            icon="i-heroicons-information-circle"
          >
            <dl class="grid gap-3 p-4 text-xs">
              <div class="flex items-center justify-between gap-2">
                <dt class="text-dimmed">
                  {{ t('tasks.assignee') }}
                </dt>
                <dd class="flex items-center gap-1.5 font-semibold text-highlighted">
                  <template v-if="task.assignee">
                    <UAvatar
                      :src="task.assignee.avatarUrl ?? undefined"
                      :text="task.assignee.fullName.charAt(0)"
                      size="3xs"
                    />
                    {{ task.assignee.fullName }}
                  </template>
                  <span v-else>{{ t('tasks.unassigned') }}</span>
                </dd>
              </div>

              <div
                v-if="task.assigner"
                class="flex items-center justify-between gap-2"
              >
                <dt class="text-dimmed">
                  {{ t('tasks.assignedBy', { name: '' }).trim() }}
                </dt>
                <dd class="font-semibold text-highlighted">
                  {{ task.assigner.fullName }}
                </dd>
              </div>

              <div class="flex items-center justify-between gap-2">
                <dt class="text-dimmed">
                  {{ t('tasks.dueDate') }}
                </dt>
                <dd
                  class="font-semibold"
                  :class="task.isOverdue ? 'text-error' : 'text-highlighted'"
                >
                  {{ due.exact(task.dueDate) }}
                </dd>
              </div>

              <div
                v-if="task.estimatedHours"
                class="flex items-center justify-between gap-2"
              >
                <dt class="text-dimmed">
                  {{ t('tasks.estimate') }}
                </dt>
                <dd class="font-semibold text-highlighted">
                  {{ t('tasks.estimateHours', { hours: format.number(task.estimatedHours, 2) }) }}
                </dd>
              </div>

              <div
                v-if="task.revisionCount > 0"
                class="flex items-center justify-between gap-2"
              >
                <dt class="text-dimmed">
                  {{ t('tasks.actions.request_revision') }}
                </dt>
                <dd class="font-semibold text-warning">
                  {{ t('tasks.revisionCount', { count: format.number(task.revisionCount) }) }}
                </dd>
              </div>

              <div class="flex items-center justify-between gap-2 border-t border-default pt-3">
                <dt class="text-dimmed">
                  {{ t('tasks.reward') }}
                </dt>
                <dd class="flex items-center gap-1.5">
                  <span class="rounded-lg bg-primary/10 px-2 py-1 font-bold text-primary tabular-nums">
                    +{{ format.number(task.xpReward) }} XP
                  </span>
                  <span class="rounded-lg bg-coin-500/12 px-2 py-1 font-bold text-coin-600 tabular-nums dark:text-coin-300">
                    +{{ format.number(task.coinReward) }}
                  </span>
                </dd>
              </div>
            </dl>
          </CommonSectionCard>

          <!-- Attachments -->
          <CommonSectionCard
            :title="t('tasks.attachments')"
            icon="i-heroicons-paper-clip"
          >
            <div class="grid gap-2 p-4">
              <p
                v-if="!data?.attachments.length"
                class="py-2 text-center text-xs text-dimmed"
              >
                {{ t('tasks.noAttachments') }}
              </p>

              <a
                v-for="file in data?.attachments"
                :key="file.id"
                :href="file.url"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-2 rounded-lg bg-elevated px-3 py-2 text-xs font-semibold text-highlighted transition-colors hover:text-primary"
              >
                <UIcon
                  name="i-heroicons-document"
                  class="size-4 shrink-0"
                />
                <span class="truncate">{{ file.fileName }}</span>
              </a>

              <UButton
                color="neutral"
                variant="soft"
                size="sm"
                block
                icon="i-heroicons-plus"
                @click="attachmentOpen = true"
              >
                {{ t('tasks.addAttachment') }}
              </UButton>
            </div>
          </CommonSectionCard>

          <!-- Reviews -->
          <CommonSectionCard
            v-if="data?.reviews.length"
            :title="t('tasks.reviews')"
            icon="i-heroicons-clipboard-document-check"
          >
            <div class="grid gap-3 p-4">
              <div
                v-for="review in data.reviews"
                :key="review.id"
                class="rounded-xl bg-elevated p-3 text-xs"
              >
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <span class="font-bold text-highlighted">{{ review.reviewer.fullName }}</span>
                  <UBadge
                    :color="review.decision === 'APPROVED' ? 'success' : 'warning'"
                    variant="subtle"
                    size="sm"
                  >
                    {{ t(`status.task.${review.decision === 'APPROVED' ? 'APPROVED' : 'NEEDS_REVISION'}`) }}
                  </UBadge>
                </div>
                <p
                  v-if="review.score !== null"
                  class="mt-1 font-semibold text-muted tabular-nums"
                >
                  {{ t('tasks.review.score') }}: {{ format.number(review.score) }}
                </p>
                <p
                  v-if="review.feedback"
                  class="mt-1 whitespace-pre-line leading-6 text-muted"
                >
                  {{ review.feedback }}
                </p>
                <p class="mt-1 text-dimmed">
                  {{ format.relative(review.createdAt) }}
                </p>
              </div>
            </div>
          </CommonSectionCard>
        </div>
      </div>
    </div>

    <!-- Review modal: scores, live reward preview and the decision. -->
    <TasksTaskReviewModal
      v-if="task"
      v-model:open="reviewOpen"
      :task-id="task.id"
      :task-title="task.title"
      @reviewed="refresh"
    />

    <!-- Attachment modal -->
    <UModal
      v-model:open="attachmentOpen"
      :title="t('tasks.addAttachment')"
    >
      <template #body>
        <div class="grid gap-4">
          <UFormField
            :label="t('tasks.fileName')"
            required
          >
            <UInput
              v-model="attachmentName"
              size="lg"
              class="w-full"
            />
          </UFormField>
          <UFormField
            :label="t('tasks.fileUrl')"
            required
          >
            <UInput
              v-model="attachmentUrl"
              type="url"
              dir="ltr"
              placeholder="https://…"
              size="lg"
              class="w-full"
            />
          </UFormField>
        </div>
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            @click="attachmentOpen = false"
          >
            {{ t('common.cancel') }}
          </UButton>
          <UButton
            color="primary"
            :loading="busy"
            @click="addAttachment"
          >
            {{ t('common.save') }}
          </UButton>
        </div>
      </template>
    </UModal>

    <TasksTaskFormModal
      v-if="task && canManage"
      v-model:open="editOpen"
      :task="task"
      @saved="refresh()"
    />
  </div>
</template>
