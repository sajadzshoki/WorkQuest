<script setup lang="ts">
/**
 * The app-wide unlock feed — level up, achievement unlocked, coin earned,
 * badge unlocked. Mounted once in `app.vue`; any component pushes onto it via
 * `useCelebration()`. Deliberately restrained: small cards, short stay, no
 * confetti, and it honours `prefers-reduced-motion` through the global CSS.
 */
const { celebrations, dismiss } = useCelebration()

interface Visual {
  icon: string
  tile: string
}

const visuals: Record<string, Visual> = {
  level: { icon: 'i-heroicons-arrow-trending-up', tile: 'bg-primary/12 text-primary' },
  achievement: { icon: 'i-heroicons-star-solid', tile: 'bg-coin-500/12 text-coin-600 dark:text-coin-300' },
  coins: { icon: 'i-heroicons-circle-stack-solid', tile: 'bg-coin-500/12 text-coin-600 dark:text-coin-300' },
  badge: { icon: 'i-heroicons-shield-check-solid', tile: 'bg-success/12 text-success' },
}

function visual(type: string): Visual {
  return visuals[type] ?? visuals.level!
}
</script>

<template>
  <div
    class="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex flex-col items-center gap-2 px-4 sm:bottom-6"
    aria-live="polite"
  >
    <TransitionGroup
      name="celebration"
      tag="div"
      class="flex w-full max-w-sm flex-col items-stretch gap-2"
    >
      <div
        v-for="item in celebrations"
        :key="item.id"
        class="wq-panel-elevated pointer-events-auto flex items-center gap-3 p-3"
      >
        <span
          class="relative grid size-10 shrink-0 place-items-center rounded-xl"
          :class="visual(item.type).tile"
        >
          <span
            v-if="item.type === 'level'"
            class="wq-ring-pulse absolute inset-0 rounded-xl ring-2 ring-primary"
            aria-hidden="true"
          />
          <UIcon
            :name="visual(item.type).icon"
            class="size-5"
          />
        </span>

        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-bold text-highlighted">
            {{ item.title }}
          </p>
          <p
            v-if="item.detail"
            class="truncate text-xs text-muted"
          >
            {{ item.detail }}
          </p>
        </div>

        <UButton
          color="neutral"
          variant="ghost"
          size="xs"
          icon="i-heroicons-x-mark"
          aria-label="close"
          @click="dismiss(item.id)"
        />
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.celebration-enter-active,
.celebration-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.celebration-enter-from {
  opacity: 0;
  transform: translateY(8px) scale(0.97);
}

.celebration-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}

.celebration-move {
  transition: transform 0.3s ease;
}
</style>
