<script setup lang="ts">
const props = defineProps<{
  /** HTTP status when the request failed. Technical payloads are never shown. */
  statusCode?: number | null
}>()

const emit = defineEmits<{ retry: [] }>()

const { t } = useI18n()

const title = computed(() => {
  if (props.statusCode === 403) return t('errors.forbidden')
  if (props.statusCode === 404) return t('errors.notFound')
  return t('errors.generic')
})

const description = computed(() => {
  if (props.statusCode === 404) return t('errors.notFoundHint')
  if (props.statusCode === 403) return undefined
  return t('errors.networkError')
})
</script>

<template>
  <CommonEmptyState
    class="wq-panel"
    icon="i-heroicons-exclamation-triangle"
    :title="title"
    :description="description"
  >
    <UButton
      color="neutral"
      variant="outline"
      icon="i-heroicons-arrow-path"
      @click="emit('retry')"
    >
      {{ t('common.retry') }}
    </UButton>
  </CommonEmptyState>
</template>
