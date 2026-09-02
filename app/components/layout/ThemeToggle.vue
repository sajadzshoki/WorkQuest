<script setup lang="ts">
const { t } = useI18n()
const colorMode = useColorMode()

const options = [
  { value: 'light', label: () => t('common.light'), icon: 'i-heroicons-sun' },
  { value: 'dark', label: () => t('common.dark'), icon: 'i-heroicons-moon' },
  { value: 'system', label: () => t('common.system'), icon: 'i-heroicons-computer-desktop' },
] as const

const items = computed(() =>
  options.map(option => ({
    label: option.label(),
    icon: option.icon,
    value: option.value,
  })),
)

function select(value: string) {
  colorMode.preference = value as 'light' | 'dark' | 'system'
}

const currentIcon = computed(
  () => options.find(option => option.value === colorMode.preference)?.icon ?? 'i-heroicons-sun',
)
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'end', sideOffset: 8 }"
    :aria-label="t('common.theme')"
  >
    <template #default>
      <UButton
        square
        variant="ghost"
        color="neutral"
        :icon="currentIcon"
        :aria-label="t('common.theme')"
      />
    </template>

    <template #item="{ item }">
      <button
        type="button"
        class="flex w-full items-center justify-between gap-4 px-2 py-1.5 text-sm"
        :class="item.value === colorMode.preference ? 'font-bold text-primary' : 'text-default'"
        @click="select(item.value)"
      >
        <span class="flex items-center gap-2">
          <UIcon
            :name="item.icon"
            class="size-4"
          />
          {{ item.label }}
        </span>
        <UIcon
          v-if="item.value === colorMode.preference"
          name="i-heroicons-check"
          class="size-4 text-primary"
        />
      </button>
    </template>
  </UDropdownMenu>
</template>
