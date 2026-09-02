<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    icon?: string
    title: string
    description?: string
  }>(),
  { icon: 'i-heroicons-sparkles' },
)
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3 px-4 py-12 text-center">
    <span class="grid size-12 place-items-center rounded-2xl bg-elevated text-muted">
      <UIcon
        :name="props.icon"
        class="size-6"
      />
    </span>
    <p class="text-sm font-semibold text-highlighted">
      {{ props.title }}
    </p>
    <p
      v-if="props.description"
      class="max-w-sm text-xs text-muted"
    >
      {{ props.description }}
    </p>
    <slot />
  </div>
</template>
