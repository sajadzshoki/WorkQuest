<script setup lang="ts">
/**
 * One voting bucket on the recognition board. Shows the category and either a
 * "pick a teammate" action or the caller's own selection. No vote arithmetic
 * happens here — the server decides who the caller already chose.
 */
const props = withDefaults(
  defineProps<{
    name: string
    description: string | null
    iconKey?: string | null
    tone?: string | null
    /** The caller's own pick (their data only). */
    myVote?: { id: string, fullName: string, avatarUrl: string | null } | null
  }>(),
  { iconKey: null, tone: null, myVote: null },
)

const emit = defineEmits<{ (event: 'pick'): void }>()

type Tone = 'primary' | 'coin' | 'streak' | 'success' | 'info' | 'warning' | 'neutral'

const tones: Record<Tone, string> = {
  primary: 'bg-primary/12 text-primary',
  coin: 'bg-coin-500/12 text-coin-600 dark:text-coin-300',
  streak: 'bg-streak-500/12 text-streak-600 dark:text-streak-400',
  success: 'bg-success/12 text-success',
  info: 'bg-info/12 text-info',
  warning: 'bg-warning/12 text-warning',
  neutral: 'bg-elevated text-muted',
}

const tileClass = computed(() => {
  const tone = props.tone
  return tone && tone in tones ? tones[tone as Tone] : tones.primary
})
</script>

<template>
  <article class="wq-panel flex flex-col gap-4 p-5">
    <div class="flex items-start gap-3">
      <span
        class="grid size-12 shrink-0 place-items-center rounded-xl"
        :class="tileClass"
      >
        <UIcon
          :name="props.iconKey ?? 'i-heroicons-sparkles'"
          class="size-6"
        />
      </span>

      <div class="min-w-0 flex-1">
        <h3 class="truncate text-sm font-bold text-highlighted">
          {{ props.name }}
        </h3>
        <p
          v-if="props.description"
          class="mt-1 text-xs leading-6 text-muted"
        >
          {{ props.description }}
        </p>
      </div>
    </div>

    <div class="mt-auto border-t border-default pt-3">
      <button
        v-if="!props.myVote"
        type="button"
        class="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-default px-3 py-2.5 text-xs font-semibold text-muted transition-colors hover:border-primary/40 hover:text-primary"
        @click="emit('pick')"
      >
        <UIcon
          name="i-heroicons-plus-circle"
          class="size-4"
        />
        <slot name="pick-label" />
      </button>

      <div
        v-else
        class="wq-anim-pop flex items-center gap-2.5"
      >
        <UAvatar
          :src="props.myVote.avatarUrl ?? undefined"
          :text="props.myVote.fullName.charAt(0)"
          size="sm"
        />
        <div class="min-w-0 flex-1">
          <p class="text-[11px] text-muted">
            <slot name="your-vote-label" />
          </p>
          <p class="truncate text-xs font-bold text-highlighted">
            {{ props.myVote.fullName }}
          </p>
        </div>
        <span class="grid size-5 shrink-0 place-items-center rounded-full bg-success/15 text-success">
          <UIcon
            name="i-heroicons-check"
            class="size-3.5"
          />
        </span>
      </div>
    </div>
  </article>
</template>
