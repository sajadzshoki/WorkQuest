<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()
const items = useMobileNavItems()
const moreItems = useMobileMoreItems()
const { session } = useSession()

const moreOpen = ref(false)

function isActive(to: string): boolean {
  return route.path === to || route.path.startsWith(`${to}/`)
}

function badgeFor(to: string): number | null {
  if (to.endsWith('/notifications') && (session.value?.unreadNotifications ?? 0) > 0) {
    return session.value?.unreadNotifications ?? null
  }
  return null
}

const moreActive = computed(() => moreItems.value.some(item => isActive(item.to)))
const moreBadge = computed(() => moreItems.value.reduce((total, item) => total + (badgeFor(item.to) ?? 0), 0))

watch(() => route.path, () => {
  moreOpen.value = false
})
</script>

<template>
  <nav
    class="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-default pb-[env(safe-area-inset-bottom)] lg:hidden"
    :aria-label="t('nav.main')"
  >
    <div class="flex items-stretch">
      <NuxtLink
        v-for="item in items"
        :key="item.key"
        :to="item.to"
        class="relative flex min-w-0 flex-1 flex-col items-center gap-1 px-1 py-2.5 text-[11px] font-medium transition-colors"
        :class="isActive(item.to) ? 'text-primary' : 'text-muted'"
        :aria-current="isActive(item.to) ? 'page' : undefined"
      >
        <UIcon
          :name="item.icon"
          class="size-5"
        />
        <span class="max-w-full truncate">{{ item.label }}</span>
        <span
          v-if="badgeFor(item.to)"
          class="absolute end-[18%] top-1.5 grid min-w-4 place-items-center rounded-full bg-error px-1 text-[9px] font-bold text-inverted"
        >
          {{ badgeFor(item.to) }}
        </span>
        <span
          v-if="isActive(item.to)"
          class="absolute inset-x-4 top-0 h-0.5 rounded-full bg-primary"
          aria-hidden="true"
        />
      </NuxtLink>

      <button
        type="button"
        class="relative flex min-w-0 flex-1 flex-col items-center gap-1 px-1 py-2.5 text-[11px] font-medium transition-colors"
        :class="moreActive || moreOpen ? 'text-primary' : 'text-muted'"
        :aria-expanded="moreOpen"
        :aria-label="t('nav.more')"
        @click="moreOpen = true"
      >
        <UIcon
          name="i-heroicons-ellipsis-horizontal"
          class="size-5"
        />
        <span class="max-w-full truncate">{{ t('nav.more') }}</span>
        <span
          v-if="moreBadge > 0"
          class="absolute end-[18%] top-1.5 grid min-w-4 place-items-center rounded-full bg-error px-1 text-[9px] font-bold text-inverted"
        >
          {{ moreBadge }}
        </span>
        <span
          v-if="moreActive"
          class="absolute inset-x-4 top-0 h-0.5 rounded-full bg-primary"
          aria-hidden="true"
        />
      </button>
    </div>

    <USlideover
      v-model:open="moreOpen"
      :title="t('nav.more')"
      side="bottom"
      :ui="{ content: 'max-h-[80dvh]' }"
    >
      <template #body>
        <nav
          class="grid gap-1 pb-2"
          :aria-label="t('nav.more')"
        >
          <NuxtLink
            v-for="item in moreItems"
            :key="item.key"
            :to="item.to"
            class="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors"
            :class="isActive(item.to) ? 'bg-primary/10 text-primary' : 'text-highlighted hover:bg-elevated'"
            :aria-current="isActive(item.to) ? 'page' : undefined"
            @click="moreOpen = false"
          >
            <UIcon
              :name="item.icon"
              class="size-5 shrink-0"
            />
            <span class="min-w-0 flex-1 truncate">{{ item.label }}</span>
            <span
              v-if="badgeFor(item.to)"
              class="grid min-w-5 place-items-center rounded-full bg-error px-1.5 text-[11px] font-bold text-inverted"
            >
              {{ badgeFor(item.to) }}
            </span>
          </NuxtLink>
        </nav>
      </template>
    </USlideover>
  </nav>
</template>
