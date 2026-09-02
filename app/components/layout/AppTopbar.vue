<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const { session, user, company, gamification, logout } = useSession()
const router = useRouter()
const format = useLocaleFormat()
const toast = useToast()

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

async function openNotifications() {
  await router.push(localePath('/notifications'))
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

      <UTooltip :text="t('nav.notifications')">
        <UButton
          square
          variant="ghost"
          color="neutral"
          icon="i-heroicons-bell"
          :aria-label="t('nav.notifications')"
          @click="openNotifications"
        >
          <template
            v-if="(session?.unreadNotifications ?? 0) > 0"
            #trailing
          >
            <span
              class="absolute -top-0.5 -end-0.5 grid size-4 place-items-center rounded-full bg-error text-[9px] font-bold text-inverted"
            >
              {{ session?.unreadNotifications }}
            </span>
          </template>
        </UButton>
      </UTooltip>

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
