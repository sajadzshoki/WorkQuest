<script setup lang="ts">
const props = withDefaults(defineProps<{ length?: number, modelValue?: string }>(), {
  length: 6,
  modelValue: '',
})

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const { t } = useI18n()
const input = useTemplateRef('input')

const value = computed({
  get: () => props.modelValue,
  set: (next: string) => emit('update:modelValue', next.replace(/\D/g, '').slice(0, props.length)),
})

const complete = computed(() => value.value.length === props.length)

defineExpose({
  focus: () => input.value?.inputRef?.focus(),
  clear: () => emit('update:modelValue', ''),
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <UInput
      ref="input"
      v-model="value"
      type="text"
      inputmode="numeric"
      autocomplete="one-time-code"
      :maxlength="props.length"
      size="xl"
      class="w-full"
      :ui="{ base: 'text-center text-2xl font-black tabular-nums tracking-[0.6em] ps-[0.6em]' }"
      :aria-label="t('auth.codeLabel')"
      :placeholder="'•'.repeat(props.length)"
    />
    <p
      class="text-center text-xs"
      :class="complete ? 'text-success' : 'text-muted'"
    >
      {{ complete ? t('common.confirm') : t('gamification.progress', { current: value.length, total: props.length }) }}
    </p>
  </div>
</template>
