<script setup lang="ts">
import type { NotificationItem } from '#shared/types/api'

const { t } = useI18n()
const localePath = useLocalePath()
const { user, company, gamification, logout } = useSession()
const router = useRouter()
const format = useLocaleFormat()
const toast = useToast()
const { unread, startPolling, markRead, markAllRead, fetchPage, isUnread, chipClass, metaOf } = useNotifications()

const userItems = computed(() => [
  [
    {
      label: user.value?.fullName ?? '',
      type: 'label' as const,
    },
  ],
  [
    {
      label: t('nav.settings'),
      icon: 'i-heroicons-cog-6-tooth',
      to: localePath('/settings'),
    },
    {
      label: t('common.logout'),
      icon: 'i-heroicons-arrow-right-start-on-rectangle',
      onSelect: async () => {
        await logout()
        toast.add({ title: t('auth.signedOut'), color: 'success', icon: 'i-heroicons-check' })
        await router.push(localePath('/login'))
      },
    },
  ],
])

// --- the bell ---------------------------------------------------------------

const open = ref(false)
const recent = ref<NotificationItem[]>([])
const loading = ref(false)

onMounted(() => {
  // The topbar is on every authenticated page, so this is where the tab-wide
  // unread poll starts.
  startPolling()
})

async function loadRecent(): Promise<void> {
  loading.value = true
  try {
    const page = await fetchPage(1, 8)
    recent.value = page.items
  }
  catch {
    recent.value = []
  }
  finally {
    loading.value = false
  }
}

watch(open, (isOpen) => {
  if (isOpen) void loadRecent()
})

async function onRowClick(item: NotificationItem): Promise<void> {
  if (isUnread(item)) await markRead(item.id).catch(() => {})
}

async function onMarkAll(): Promise<void> {
  const updated = await markAllRead().catch(() => 0)
  toast.add({
    title: t('notifications.allReadDone', { count: format.number(updated) }),
    color: 'success',
    icon: 'i-heroicons-check',
  })
  await loadRecent()
}
</script>

<template>
  <header
    class="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-default bg-default/85 px-4 backdrop-blur sm:px-6"
  >
    <div class="min-w-0 flex-1">
      <p class="truncate text-sm font-bold text-highlighted">
        {{ company?.name }}
      </p>
      <p class="truncate text-xs text-muted">
        {{ t('dashboard.greeting', { name: user?.fullName ?? '' }) }}
      </p>
    </div>

    <div class="flex items-center gap-1 sm:gap-2">
      <div
        class="hidden items-center gap-1.5 rounded-full bg-coin-50 px-3 py-1.5 text-xs font-bold text-coin-700 dark:bg-coin-950/40 dark:text-coin-300 sm:flex"
        :title="t('gamification.coins')"
      >
        <UIcon
          name="i-heroicons-circle-stack-solid"
          class="size-4"
        />
        <span class="tabular-nums">{{ format.number(gamification?.coins ?? 0) }}</span>
      </div>

      <div
        class="hidden items-center gap-1.5 rounded-full bg-streak-50 px-3 py-1.5 text-xs font-bold text-streak-600 dark:bg-streak-500/10 dark:text-streak-400 sm:flex"
        :title="t('gamification.streak')"
      >
        <UIcon
          name="i-heroicons-fire-solid"
          class="size-4"
        />
        <span class="tabular-nums">{{ format.number(gamification?.currentStreak ?? 0) }}</span>
      </div>

      <UPopover
        v-model:open="open"
        :content="{ align: 'end', sideOffset: 8 }"
        :ui="{ content: 'w-80 sm:w-96 p-0 max-h-[28rem] flex flex-col' }"
      >
        <UTooltip :text="t('nav.notifications')">
          <UButton
            square
            variant="ghost"
            color="neutral"
            icon="i-heroicons-bell"
            :aria-label="t('nav.notifications')"
          >
            <template
              v-if="unread > 0"
              #trailing
            >
              <span
                class="absolute -top-0.5 -end-0.5 grid size-4 place-items-center rounded-full bg-error text-[9px] font-bold text-inverted"
              >
                {{ format.number(unread) }}
              </span>
            </template>
          </UButton>
        </UTooltip>

        <template #content>
          <div class="flex items-center justify-between gap-2 border-b border-default px-4 py-3">
            <p class="text-sm font-bold text-highlighted">
              {{ t('notifications.recent') }}
            </p>
            <UButton
              size="xs"
              color="neutral"
              variant="ghost"
              icon="i-heroicons-check-double"
              :label="t('notifications.markAllRead')"
              :disabled="unread === 0"
              @click="onMarkAll"
            />
          </div>

          <div class="min-h-0 flex-1 divide-y divide-default overflow-y-auto">
            <p
              v-if="loading && !recent.length"
              class="px-4 py-6 text-center text-xs text-muted"
            >
              {{ t('common.loading') }}
            </p>
            <p
              v-else-if="!recent.length"
              class="px-4 py-6 text-center text-xs text-muted"
            >
              {{ t('notifications.empty') }}
            </p>

            <template v-else>
              <button
                v-for="item in recent"
                :key="item.id"
                type="button"
                class="flex w-full items-start gap-3 px-4 py-3 text-start transition-colors hover:bg-elevated/50"
                :class="isUnread(item) ? 'bg-primary/5' : ''"
                @click="onRowClick(item)"
              >
                <span
                  class="grid size-8 shrink-0 place-items-center rounded-lg"
                  :class="isUnread(item) ? chipClass(item.type) : 'bg-elevated text-muted'"
                >
                  <UIcon
                    :name="metaOf(item.type).icon"
                    class="size-4"
                  />
                </span>

                <span class="min-w-0 flex-1">
                  <span class="flex items-center gap-2">
                    <span
                      class="truncate text-xs"
                      :class="isUnread(item) ? 'font-bold text-highlighted' : 'font-medium text-default'"
                    >
                      {{ item.title }}
                    </span>
                  </span>
                  <span
                    v-if="item.message"
                    class="mt-0.5 block truncate text-[11px] text-muted"
                  >
                    {{ item.message }}
                  </span>
                  <span class="mt-1 block text-[10px] text-dimmed">
                    {{ format.relative(item.createdAt) }}
                  </span>
                </span>

                <span
                  v-if="isUnread(item)"
                  class="mt-1.5 size-2 shrink-0 rounded-full bg-primary"
                  aria-hidden="true"
                />
              </button>
            </template>
          </div>

          <div class="border-t border-default p-2">
            <UButton
              block
              color="neutral"
              variant="ghost"
              icon="i-heroicons-bell"
              :label="t('notifications.viewAll')"
              @click="open = false; router.push(localePath('/notifications'))"
            />
          </div>
        </template>
      </UPopover>

      <LayoutThemeToggle />
      <LayoutLocaleSwitcher />

      <UDropdownMenu
        :items="userItems"
        :content="{ align: 'end', sideOffset: 8 }"
      >
        <UButton
          variant="ghost"
          color="neutral"
          class="gap-2 px-2"
        >
          <UAvatar
            :src="user?.avatarUrl ?? undefined"
            :alt="user?.fullName ?? ''"
            :text="user?.fullName?.charAt(0)"
            size="sm"
          />
          <span class="hidden text-sm font-medium sm:inline">{{ user?.fullName }}</span>
        </UButton>
      </UDropdownMenu>
    </div>
  </header>
</template>
