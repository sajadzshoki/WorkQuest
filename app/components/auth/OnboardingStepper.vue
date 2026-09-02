<script setup lang="ts">
const props = withDefaults(defineProps<{ step?: 1 | 2 | 3 }>(), { step: 1 })

const { t } = useI18n()

const steps = computed(() => [
  { index: 1, label: t('onboarding.steps.verify'), icon: 'i-heroicons-device-phone-mobile' },
  { index: 2, label: t('onboarding.steps.profile'), icon: 'i-heroicons-user-circle' },
  { index: 3, label: t('onboarding.steps.company'), icon: 'i-heroicons-building-office' },
])

const isDone = (index: number) => index < props.step
const isCurrent = (index: number) => index === props.step
</script>

<template>
  <ol
    class="mb-7 flex items-center gap-1.5"
    :aria-label="t('onboarding.stepsLabel')"
  >
    <li
      v-for="(item, position) in steps"
      :key="item.index"
      class="flex flex-1 items-center gap-1.5"
      :aria-current="isCurrent(item.index) ? 'step' : undefined"
    >
      <div class="flex flex-col items-center gap-1.5">
        <span
          class="flex size-9 shrink-0 items-center justify-center rounded-xl border text-sm transition-colors"
          :class="
            isDone(item.index)
              ? 'border-success bg-success/10 text-success'
              : isCurrent(item.index)
                ? 'border-primary bg-primary text-inverted shadow-sm'
                : 'border-default bg-elevated text-dimmed'
          "
        >
          <UIcon
            :name="isDone(item.index) ? 'i-heroicons-check' : item.icon"
            class="size-4.5"
          />
        </span>
        <span
          class="hidden text-center text-[11px] leading-4 sm:block"
          :class="isCurrent(item.index) ? 'font-bold text-highlighted' : 'text-dimmed'"
        >
          {{ item.label }}
        </span>
      </div>

      <span
        v-if="position < steps.length - 1"
        class="mb-4 h-0.5 flex-1 rounded-full transition-colors sm:mb-5"
        :class="isDone(item.index) ? 'bg-success/50' : 'bg-default'"
        aria-hidden="true"
      />
    </li>
  </ol>
</template>
