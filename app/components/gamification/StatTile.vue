<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label: string
    value: string | number
    icon?: string
    hint?: string
    tone?: 'primary' | 'coin' | 'streak' | 'success' | 'neutral'
  }>(),
  { tone: 'primary' },
)

const toneClasses: Record<string, string> = {
  primary: 'bg-primary/10 text-primary',
  coin: 'bg-coin-500/12 text-coin-600 dark:text-coin-300',
  streak: 'bg-streak-500/12 text-streak-600 dark:text-streak-400',
  success: 'bg-success/12 text-success',
  neutral: 'bg-elevated text-muted',
}
</script>

<template>
  <div class="wq-panel flex items-center gap-3 p-4">
    <span
      v-if="props.icon"
      class="grid size-11 shrink-0 place-items-center rounded-xl"
      :class="toneClasses[props.tone]"
    >
      <UIcon
        :name="props.icon"
        class="size-5.5"
      />
    </span>

    <div class="min-w-0">
      <p class="truncate text-xs text-muted">
        {{ props.label }}
      </p>
      <p class="mt-0.5 truncate text-xl font-black tabular-nums text-highlighted">
        {{ props.value }}
      </p>
      <p
        v-if="props.hint"
        class="truncate text-[11px] text-dimmed"
      >
        {{ props.hint }}
      </p>
    </div>
  </div>
</template>
