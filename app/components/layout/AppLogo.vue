<script setup lang="ts">
const runtime = useRuntimeConfig()
const { t } = useI18n()

const props = withDefaults(defineProps<{ compact?: boolean }>(), { compact: false })
</script>

<template>
  <div class="flex items-center gap-2.5">
    <span
      class="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-inverted"
      aria-hidden="true"
    >
      <UIcon
        name="i-heroicons-bolt-solid"
        class="size-5"
      />
    </span>
    <span
      v-if="!props.compact"
      class="flex flex-col leading-tight"
    >
      <span class="text-base font-extrabold text-highlighted">
        {{ runtime.public.appName }}
      </span>
      <span class="text-[11px] text-muted">{{ t('app.tagline') }}</span>
    </span>
  </div>
</template>
