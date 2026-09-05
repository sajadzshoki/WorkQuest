<script setup lang="ts">
import type { NotificationItem, NotificationListResponse } from '#shared/types/api'

definePageMeta({ middleware: ['auth'] })

const { t } = useI18n()
const format = useLocaleFormat()
const toast = useToast()
const { unread, markRead, markAllRead, isUnread, chipClass, metaOf, refreshUnread } = useNotifications()

const PAGE_SIZE = 20
const page = ref(1)
const busyId = ref<string | null>(null)

const { data, pending, refresh } = await useFetch<NotificationListResponse>('/api/notifications', {
  query: computed(() => ({ page: page.value, pageSize: PAGE_SIZE })),
  watch: [page],
})

const totalPages = computed(() => Math.max(1, Math.ceil((data.value?.total ?? 0) / PAGE_SIZE)))

async function onMarkRead(item: NotificationItem): Promise<void> {
  busyId.value = item.id
  try {
    await markRead(item.id)
    // One row changes state; re-reading the page keeps the unread-first
    // ordering honest instead of patching it by hand.
    await refresh()
  }
  catch {
    toast.add({ title: t('errors.generic'), color: 'error' })
  }
  finally {
    busyId.value = null
  }
}

async function onMarkAll(): Promise<void> {
  try {
    const updated = await markAllRead()
    toast.add({
      title: t('notifications.allReadDone', { count: format.number(updated) }),
      color: 'success',
      icon: 'i-heroicons-check',
    })
    page.value = 1
    await refresh()
  }
  catch {
    toast.add({ title: t('errors.generic'), color: 'error' })
  }
}

onMounted(() => {
  // Arriving on the page with a stale badge (another tab, a slow poll) fixes
  // it immediately.
  void refreshUnread()
})
</script>

<template>
  <div>
    <CommonPageHeader
      :title="t('notifications.title')"
      :subtitle="t('notifications.subtitle')"
    >
      <template #actions>
        <UBadge
          v-if="unread > 0"
          color="primary"
          variant="subtle"
          size="lg"
        >
          {{ t('notifications.unreadCount', { count: format.number(unread) }) }}
        </UBadge>
        <UButton
          color="neutral"
          variant="outline"
          icon="i-heroicons-check-double"
          :disabled="unread === 0"
          @click="onMarkAll"
        >
          {{ t('notifications.markAllRead') }}
        </UButton>
      </template>
    </CommonPageHeader>

    <CommonEmptyState
      v-if="!pending && !data?.items.length"
      class="wq-panel"
      icon="i-heroicons-bell-slash"
      :title="t('notifications.empty')"
      :description="t('notifications.emptyHint')"
    />

    <div
      v-else
      class="wq-panel"
    >
      <ul
        class="divide-y divide-default"
        :class="pending ? 'opacity-60 transition-opacity' : ''"
      >
        <li
          v-for="item in data?.items ?? []"
          :key="item.id"
          class="flex items-start gap-3 p-4"
          :class="isUnread(item) ? 'bg-primary/5' : ''"
        >
          <span
            class="grid size-9 shrink-0 place-items-center rounded-lg"
            :class="isUnread(item) ? chipClass(item.type) : 'bg-elevated text-muted'"
          >
            <UIcon
              :name="metaOf(item.type).icon"
              class="size-4.5"
            />
          </span>

          <div class="min-w-0 flex-1">
            <p class="flex flex-wrap items-center gap-2 text-sm font-semibold text-highlighted">
              <span class="truncate">{{ item.title }}</span>
              <UBadge
                color="neutral"
                variant="subtle"
                size="sm"
                class="shrink-0"
              >
                {{ t(`notifications.type.${item.type}`) }}
              </UBadge>
            </p>
            <p
              v-if="item.message"
              class="mt-1 text-xs leading-6 text-muted"
            >
              {{ item.message }}
            </p>
            <p class="mt-1.5 text-[11px] text-dimmed">
              {{ format.relative(item.createdAt) }}
            </p>
          </div>

          <div class="flex shrink-0 items-center gap-2">
            <UButton
              v-if="isUnread(item)"
              size="xs"
              color="neutral"
              variant="ghost"
              icon="i-heroicons-check"
              :label="t('notifications.markRead')"
              :loading="busyId === item.id"
              @click="onMarkRead(item)"
            />
            <span
              v-if="isUnread(item)"
              class="size-2 rounded-full bg-primary"
              aria-hidden="true"
            />
          </div>
        </li>
      </ul>

      <div class="flex flex-col items-center gap-3 border-t border-default px-4 py-3">
        <UPagination
          v-if="totalPages > 1"
          v-model:page="page"
          :total="data?.total ?? 0"
          :items-per-page="PAGE_SIZE"
        />
        <p class="text-xs text-dimmed">
          {{ t('notifications.total', { count: format.number(data?.total ?? 0) }) }}
        </p>
      </div>
    </div>
  </div>
</template>
