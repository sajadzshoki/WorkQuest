<script setup lang="ts">
const props = defineProps<{
  title?: string
  description?: string
  icon?: string
  to?: string
  toLabel?: string
}>()
</script>

<template>
  <section class="wq-panel overflow-hidden">
    <header
      v-if="props.title"
      class="flex items-center justify-between gap-3 border-b border-default px-4 py-3.5 sm:px-5"
    >
      <div class="flex min-w-0 items-center gap-2.5">
        <span
          v-if="props.icon"
          class="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"
        >
          <UIcon
            :name="props.icon"
            class="size-4.5"
          />
        </span>
        <div class="min-w-0">
          <h2 class="truncate text-sm font-bold text-highlighted">
            {{ props.title }}
          </h2>
          <p
            v-if="props.description"
            class="truncate text-xs text-muted"
          >
            {{ props.description }}
          </p>
        </div>
      </div>

      <NuxtLink
        v-if="props.to"
        :to="props.to"
        class="shrink-0 text-xs font-semibold text-primary hover:underline"
      >
        {{ props.toLabel }}
      </NuxtLink>
      <slot name="header-actions" />
    </header>

    <div class="p-4 sm:p-5">
      <slot />
    </div>
  </section>
</template>
