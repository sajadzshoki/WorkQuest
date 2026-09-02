<script setup lang="ts">
const route = useRoute()
const items = useMobileNavItems()
const { session } = useSession()

function isActive(to: string): boolean {
  return route.path === to || route.path.startsWith(`${to}/`)
}

function badgeFor(to: string): number | null {
  if (to.endsWith('/notifications') && (session.value?.unreadNotifications ?? 0) > 0) {
    return session.value?.unreadNotifications ?? null
  }
  return null
}
</script>

<template>
  <nav
    class="fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t border-default bg-default/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
  >
    <NuxtLink
      v-for="item in items"
      :key="item.key"
      :to="item.to"
      class="relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors"
      :class="isActive(item.to) ? 'text-primary' : 'text-muted'"
    >
      <UIcon
        :name="item.icon"
        class="size-5"
      />
      <span class="max-w-full truncate px-1">{{ item.label }}</span>
      <span
        v-if="badgeFor(item.to)"
        class="absolute end-[22%] top-1.5 grid size-4 place-items-center rounded-full bg-error text-[9px] font-bold text-inverted"
      >
        {{ badgeFor(item.to) }}
      </span>
      <span
        v-if="isActive(item.to)"
        class="absolute inset-x-6 top-0 h-0.5 rounded-full bg-primary"
        aria-hidden="true"
      />
    </NuxtLink>
  </nav>
</template>
