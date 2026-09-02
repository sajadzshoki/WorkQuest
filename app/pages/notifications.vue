<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

interface NotificationsResponse {
  items: Array<{
    id: string
    type: string
    title: string
    body: string | null
    status: string
    createdAt: string
  }>
  total: number
  unread: number
  page: number
  pageSize: number
}

const { t } = useI18n()
const format = useLocaleFormat()

const { data } = await useFetch<NotificationsResponse>(`/api/notifications`)

const icons: Record<string, string> = {
  TASK_ASSIGNED: 'i-heroicons-clipboard-document-list',
  TASK_REVIEWED: 'i-heroicons-clipboard-document-check',
  ACHIEVEMENT_UNLOCKED: 'i-heroicons-star',
  LEVEL_UP: 'i-heroicons-arrow-trending-up',
  REWARD_AVAILABLE: 'i-heroicons-gift',
  REDEMPTION_UPDATE: 'i-heroicons-receipt-percent',
  RECOGNITION_RECEIVED: 'i-heroicons-heart',
  CHALLENGE_UPDATE: 'i-heroicons-flag',
  SYSTEM: 'i-heroicons-information-circle',
}
</script>

<template>
  <div>
    <CommonPageHeader
      :title="t('notifications.title')"
      :subtitle="t('notifications.subtitle')"
    >
      <template #actions>
        <UBadge
          v-if="data?.unread"
          color="primary"
          variant="subtle"
          size="lg"
        >
          {{ t('notifications.unreadCount', { count: format.number(data.unread) }) }}
        </UBadge>
        <UButton
          color="neutral"
          variant="outline"
          icon="i-heroicons-check"
          disabled
        >
          {{ t('notifications.markAllRead') }}
        </UButton>
      </template>
    </CommonPageHeader>

    <CommonEmptyState
      v-if="!data?.items.length"
      class="wq-panel"
      icon="i-heroicons-bell-slash"
      :title="t('notifications.empty')"
    />

    <ul
      v-else
      class="wq-panel divide-y divide-default"
    >
      <li
        v-for="notification in data.items"
        :key="notification.id"
        class="flex items-start gap-3 p-4"
        :class="notification.status === 'UNREAD' ? 'bg-primary/5' : ''"
      >
        <span
          class="grid size-9 shrink-0 place-items-center rounded-lg"
          :class="notification.status === 'UNREAD' ? 'bg-primary/12 text-primary' : 'bg-elevated text-muted'"
        >
          <UIcon
            :name="icons[notification.type] ?? 'i-heroicons-bell'"
            class="size-4.5"
          />
        </span>

        <div class="min-w-0 flex-1">
          <p class="flex items-center gap-2 text-sm font-semibold text-highlighted">
            <span class="truncate">{{ notification.title }}</span>
            <UBadge
              color="neutral"
              variant="subtle"
              size="sm"
              class="shrink-0"
            >
              {{ t(`notifications.type.${notification.type}`) }}
            </UBadge>
          </p>
          <p
            v-if="notification.body"
            class="mt-1 text-xs leading-6 text-muted"
          >
            {{ notification.body }}
          </p>
          <p class="mt-1.5 text-[11px] text-dimmed">
            {{ format.relative(notification.createdAt) }}
          </p>
        </div>

        <span
          v-if="notification.status === 'UNREAD'"
          class="mt-1.5 size-2 shrink-0 rounded-full bg-primary"
          aria-hidden="true"
        />
      </li>
    </ul>
  </div>
</template>
