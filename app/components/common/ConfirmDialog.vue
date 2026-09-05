<script setup lang="ts">
import type { ConfirmOptions } from '~/composables/useConfirm'

/**
 * The one confirmation dialog behind every destructive action.
 *
 * A single global instance (mounted in the default layout) driven by the
 * `useConfirm()` composable, so call sites stay one line —
 * `if (!(await confirm({ description }))) return` — and the app never falls
 * back to the browser's `window.confirm`, which is unstyled, unlocalised and
 * blocked entirely in some embedded contexts.
 */
interface ConfirmState {
  options: ConfirmOptions
  resolve: (accepted: boolean) => void
}

const state = useState<ConfirmState | null>('workquest:confirm', () => null)
const { t } = useI18n()

const open = computed({
  get: () => state.value !== null,
  set: (value: boolean) => {
    if (!value) settle(false)
  },
})

function settle(accepted: boolean) {
  state.value?.resolve(accepted)
  state.value = null
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="state?.options.title ?? ''"
  >
    <template #body>
      <div class="flex items-start gap-3">
        <span
          class="grid size-10 shrink-0 place-items-center rounded-xl"
          :class="state?.options.tone === 'error' ? 'bg-error/12 text-error' : 'bg-primary/10 text-primary'"
        >
          <UIcon
            :name="state?.options.icon ?? (state?.options.tone === 'error' ? 'i-heroicons-exclamation-triangle' : 'i-heroicons-question-mark-circle')"
            class="size-5"
          />
        </span>
        <p
          v-if="state?.options.description"
          class="pt-2 text-sm leading-6 text-muted"
        >
          {{ state.options.description }}
        </p>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full items-center justify-end gap-2">
        <UButton
          color="neutral"
          variant="ghost"
          @click="settle(false)"
        >
          {{ state?.options.cancelLabel ?? t('common.cancel') }}
        </UButton>
        <UButton
          :color="state?.options.tone === 'error' ? 'error' : 'primary'"
          :icon="state?.options.tone === 'error' ? 'i-heroicons-trash' : 'i-heroicons-check'"
          autofocus
          @click="settle(true)"
        >
          {{ state?.options.confirmLabel ?? t('common.confirm') }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
