<script setup lang="ts">
/**
 * The teammate picker. A plain, searchable list of the caller's ACTIVE
 * coworkers — the server never returns the caller themselves, so self-voting is
 * impossible from the UI and enforced again on the server.
 */
const props = defineProps<{
  open: boolean
  categoryName: string
  coworkers: Array<{ id: string, fullName: string, avatarUrl: string | null, jobTitle: string | null }>
  pending?: boolean
}>()

const emit = defineEmits<{
  (event: 'update:open', value: boolean): void
  (event: 'select', userId: string): void
}>()

const { t } = useI18n()
const query = ref('')

const filtered = computed(() => {
  const needle = query.value.trim()
  if (!needle) return props.coworkers
  return props.coworkers.filter(coworker => coworker.fullName.includes(needle))
})

watch(
  () => props.open,
  (open) => {
    if (!open) query.value = ''
  },
)
</script>

<template>
  <UModal
    :model-value="props.open"
    @update:model-value="emit('update:open', $event)"
  >
    <UCard>
      <template #header>
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-sm font-bold text-highlighted">
              {{ t('recognition.pickCoworker') }}
            </p>
            <p class="mt-0.5 text-xs text-muted">
              {{ props.categoryName }}
            </p>
          </div>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-x-mark"
            aria-label="close"
            @click="emit('update:open', false)"
          />
        </div>
      </template>

      <div class="px-4 py-3">
        <UInput
          v-model="query"
          icon="i-heroicons-magnifying-glass"
          :placeholder="t('recognition.searchCoworker')"
          size="md"
        />
      </div>

      <div class="max-h-80 overflow-y-auto px-2 pb-2">
        <p
          v-if="!filtered.length"
          class="px-3 py-8 text-center text-xs text-muted"
        >
          {{ t('recognition.noCoworkers') }}
        </p>

        <button
          v-for="coworker in filtered"
          :key="coworker.id"
          type="button"
          class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-start transition-colors hover:bg-elevated"
          :disabled="props.pending"
          @click="emit('select', coworker.id)"
        >
          <UAvatar
            :src="coworker.avatarUrl ?? undefined"
            :text="coworker.fullName.charAt(0)"
            size="md"
          />
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-semibold text-highlighted">
              {{ coworker.fullName }}
            </p>
            <p class="truncate text-xs text-muted">
              {{ coworker.jobTitle ?? '' }}
            </p>
          </div>
          <UIcon
            name="i-heroicons-chevron-left"
            class="size-4 shrink-0 text-dimmed rtl:rotate-180"
          />
        </button>
      </div>
    </UCard>
  </UModal>
</template>
