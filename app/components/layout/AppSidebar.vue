<script setup lang="ts">
import type { NavItem } from '~/composables/useNav'

const route = useRoute()
const { t } = useI18n()
const items = useNavItems()
const { gamification, company } = useSession()
const format = useLocaleFormat()

function isActive(item: NavItem): boolean {
  return route.path === item.to || route.path.startsWith(`${item.to}/`)
}
</script>

<template>
  <aside
    class="fixed inset-y-0 start-0 z-40 hidden w-64 flex-col border-e border-default bg-default/80 backdrop-blur lg:flex"
    :aria-label="t('nav.main')"
  >
    <div class="flex h-16 items-center border-b border-default px-5">
      <LayoutAppLogo />
    </div>

    <nav class="flex-1 space-y-1 overflow-y-auto p-3">
      <NuxtLink
        v-for="item in items"
        :key="item.key"
        :to="item.to"
        class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
        :class="
          isActive(item)
            ? 'bg-primary/10 text-primary'
            : 'text-muted hover:bg-elevated hover:text-highlighted'
        "
      >
        <UIcon
          :name="item.icon"
          class="size-5 shrink-0"
        />
        <span class="truncate">{{ item.label }}</span>
        <span
          v-if="isActive(item)"
          class="ms-auto size-1.5 rounded-full bg-primary"
          aria-hidden="true"
        />
      </NuxtLink>
    </nav>

    <div class="border-t border-default p-3">
      <div class="rounded-xl bg-elevated/70 p-3">
        <div class="flex items-center justify-between text-xs">
          <span class="font-bold text-highlighted">
            {{ t('dashboard.level', { level: format.number(gamification?.level ?? 1) }) }}
          </span>
          <span class="text-muted tabular-nums">{{ format.number(gamification?.xp ?? 0) }} XP</span>
        </div>
        <UProgress
          :model-value="gamification?.levelPercent ?? 0"
          size="sm"
          color="primary"
          class="mt-2"
        />
        <p class="mt-2 truncate text-[11px] text-muted">
          {{ company?.name }}
        </p>
      </div>
    </div>
  </aside>
</template>
