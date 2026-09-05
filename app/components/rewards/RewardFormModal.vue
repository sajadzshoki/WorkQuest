<script setup lang="ts">
import type { ApiErrorBody, RewardAdminItem, RewardMutationResponse } from '#shared/types/api'
import { CATALOG_STATUSES, REWARD_TYPES, type CatalogStatus, type RewardType } from '#shared/utils/marketplace'

/**
 * Create or edit a shelf item — the whole economy of the store, in one form.
 *
 * The company sets the price, the stock and the rules here; nothing is suggested
 * by the product. Two details are worth the extra code:
 *
 *  - **"Unlimited" is a switch, not a zero.** Typing `0` into a stock field and
 *    meaning "no limit" is the classic way to sell out a shelf by accident, so
 *    unlimited is an explicit toggle that clears the number.
 *  - **An edit sends only what changed.** The server treats a missing key as
 *    "leave it alone" and an explicit `null` as "no limit", so this form must not
 *    invent values for fields the admin never touched.
 */
const props = defineProps<{
  open: boolean
  reward: RewardAdminItem | null
}>()

const emit = defineEmits<{
  (event: 'update:open', value: boolean): void
  (event: 'saved'): void
}>()

const { t } = useI18n()
const toast = useToast()
const { typeLabel, catalogStatusLabel } = useRewards()

const typeItems = computed(() => REWARD_TYPES.map(value => ({ label: typeLabel(value), value })))
const statusItems = computed(() =>
  CATALOG_STATUSES.map(value => ({
    label: catalogStatusLabel(value),
    value,
  })),
)

interface FormState {
  title: string
  description: string
  type: RewardType
  coinCost: number | null
  unlimitedStock: boolean
  stock: number | null
  imageUrl: string
  status: CatalogStatus
  autoApprove: boolean
  unlimitedPerUser: boolean
  maxPerUser: number | null
  unlimitedLevel: boolean
  minLevel: number | null
  requiresNote: boolean
  availableFrom: string
  availableUntil: string
}

const emptyForm = (): FormState => ({
  title: '',
  description: '',
  type: 'CUSTOM',
  coinCost: null,
  unlimitedStock: true,
  stock: null,
  imageUrl: '',
  status: 'ACTIVE',
  autoApprove: false,
  unlimitedPerUser: true,
  maxPerUser: null,
  unlimitedLevel: true,
  minLevel: null,
  requiresNote: false,
  availableFrom: '',
  availableUntil: '',
})

const form = reactive<FormState>(emptyForm())
const pending = ref(false)
const errorMessage = ref<string | null>(null)

const isEdit = computed(() => props.reward !== null)
const dialogTitle = computed(() =>
  isEdit.value
    ? t('rewards.admin.form.editTitle', { title: props.reward?.title ?? '' })
    : t('rewards.admin.form.createTitle'),
)

/** `2026-09-30T00:00:00.000Z` → `2026-09-30`, the shape a date input wants. */
function toDateInput(value: string | null): string {
  if (!value) return ''
  return value.slice(0, 10)
}

watch(
  () => props.open,
  (open) => {
    if (!open) return
    errorMessage.value = null
    Object.assign(form, emptyForm())

    const reward = props.reward
    if (!reward) return

    form.title = reward.title
    form.description = reward.description ?? ''
    form.type = reward.type
    form.coinCost = reward.coinCost
    form.unlimitedStock = reward.stock === null
    form.stock = reward.stock
    form.imageUrl = reward.imageUrl ?? ''
    form.status = reward.status
    form.autoApprove = reward.rules.autoApprove
    form.unlimitedPerUser = reward.rules.maxPerUser === null
    form.maxPerUser = reward.rules.maxPerUser
    form.unlimitedLevel = reward.rules.minLevel === null
    form.minLevel = reward.rules.minLevel
    form.requiresNote = reward.rules.requiresNote
    form.availableFrom = toDateInput(reward.rules.availableFrom)
    form.availableUntil = toDateInput(reward.rules.availableUntil)
  },
)

// A limit that is switched off is no limit at all, whatever the number said.
watch(() => form.unlimitedStock, unlimited => (form.stock = unlimited ? null : (form.stock ?? 1)))
watch(() => form.unlimitedPerUser, unlimited => (form.maxPerUser = unlimited ? null : (form.maxPerUser ?? 1)))
watch(() => form.unlimitedLevel, unlimited => (form.minLevel = unlimited ? null : (form.minLevel ?? 1)))

const priceValid = computed(() =>
  form.coinCost !== null && Number.isInteger(form.coinCost) && form.coinCost >= 1 && form.coinCost <= 1_000_000,
)
const canSubmit = computed(() =>
  !pending.value && form.title.trim().length >= 2 && priceValid.value,
)

function close() {
  emit('update:open', false)
}

/** The body: only keys the admin actually set, so an edit cannot reset a rule. */
function buildBody() {
  const rules: Record<string, unknown> = {
    autoApprove: form.autoApprove,
    requiresNote: form.requiresNote,
    // Explicit nulls: "no cap" and "no gate" are decisions, not omissions.
    maxPerUser: form.maxPerUser,
    minLevel: form.minLevel,
    availableFrom: form.availableFrom ? new Date(`${form.availableFrom}T00:00:00`).toISOString() : null,
    availableUntil: form.availableUntil ? new Date(`${form.availableUntil}T00:00:00`).toISOString() : null,
  }

  return {
    title: form.title.trim(),
    description: form.description.trim() || '',
    type: form.type,
    coinCost: form.coinCost,
    stock: form.stock,
    imageUrl: form.imageUrl.trim() || '',
    status: form.status,
    rules,
  }
}

async function submit() {
  if (!canSubmit.value) return

  pending.value = true
  errorMessage.value = null

  try {
    const body = buildBody()
    if (isEdit.value && props.reward) {
      await $fetch<RewardMutationResponse>(`/api/rewards/${props.reward.id}`, { method: 'PATCH', body })
      toast.add({ title: t('rewards.admin.form.updated'), color: 'success', icon: 'i-heroicons-check' })
    }
    else {
      await $fetch<RewardMutationResponse>('/api/rewards', { method: 'POST', body })
      toast.add({ title: t('rewards.admin.form.created'), color: 'success', icon: 'i-heroicons-check' })
    }
    emit('saved')
    close()
  }
  catch (error) {
    const body = (error as { data?: ApiErrorBody }).data
    errorMessage.value = body?.message ?? t('common.retry')
    const firstIssue = body?.issues?.[0]
    if (firstIssue) errorMessage.value = `${firstIssue.message}`
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <UModal
    :open="props.open"
    :title="dialogTitle"
    :ui="{ content: 'max-w-2xl' }"
    @update:open="emit('update:open', $event)"
  >
    <template #body>
      <form
        class="space-y-4"
        @submit.prevent="submit"
      >
        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField
            :label="t('rewards.admin.form.title')"
            required
            class="sm:col-span-2"
          >
            <UInput
              v-model="form.title"
              size="lg"
              :maxlength="80"
              :placeholder="t('rewards.admin.form.titlePlaceholder')"
              icon="i-heroicons-tag"
              class="w-full"
            />
          </UFormField>

          <UFormField
            :label="t('rewards.admin.form.description')"
            :hint="t('common.optional')"
            class="sm:col-span-2"
          >
            <UTextarea
              v-model="form.description"
              :rows="2"
              :maxlength="600"
              :placeholder="t('rewards.admin.form.descriptionPlaceholder')"
              class="w-full"
            />
          </UFormField>

          <UFormField :label="t('rewards.admin.form.type')">
            <USelect
              v-model="form.type"
              :items="typeItems"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField :label="t('rewards.admin.form.status')">
            <USelect
              v-model="form.status"
              :items="statusItems"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField
            :label="t('rewards.admin.form.coinCost')"
            required
            :error="form.coinCost !== null && !priceValid ? t('rewards.admin.form.invalidPrice') : undefined"
          >
            <UInput
              v-model.number="form.coinCost"
              type="number"
              dir="ltr"
              size="lg"
              :min="1"
              :max="1000000"
              icon="i-heroicons-circle-stack"
              class="w-full"
            />
          </UFormField>

          <UFormField
            :label="t('rewards.admin.form.stock')"
            :hint="t('rewards.admin.form.stockUnlimited')"
          >
            <div class="flex items-center gap-2">
              <USwitch
                v-model="form.unlimitedStock"
                :aria-label="t('rewards.admin.form.stockUnlimited')"
              />
              <UInput
                v-model.number="form.stock"
                type="number"
                dir="ltr"
                size="lg"
                :min="0"
                :max="1000000"
                :disabled="form.unlimitedStock"
                class="w-full"
              />
            </div>
          </UFormField>

          <UFormField
            :label="t('rewards.admin.form.imageUrl')"
            :hint="t('rewards.admin.form.imageUrlHint')"
            class="sm:col-span-2"
          >
            <UInput
              v-model="form.imageUrl"
              type="url"
              dir="ltr"
              size="lg"
              placeholder="https://…"
              icon="i-heroicons-photo"
              class="w-full"
            />
          </UFormField>
        </div>

        <!-- Rules -->
        <fieldset class="rounded-xl border border-default bg-elevated/40 p-3">
          <legend class="px-1 text-xs font-black text-highlighted">
            {{ t('rewards.admin.form.rulesTitle') }}
          </legend>
          <p class="mb-3 text-[11px] text-muted">
            {{ t('rewards.admin.form.rulesHint') }}
          </p>

          <div class="grid gap-3 sm:grid-cols-2">
            <div class="flex items-start justify-between gap-3 rounded-lg bg-default/60 p-2.5">
              <div class="min-w-0">
                <p class="text-xs font-bold text-highlighted">
                  {{ t('rewards.admin.form.autoApprove') }}
                </p>
                <p class="mt-0.5 text-[10px] text-muted">
                  {{ t('rewards.admin.form.autoApproveHelp') }}
                </p>
              </div>
              <USwitch
                v-model="form.autoApprove"
                :aria-label="t('rewards.admin.form.autoApprove')"
              />
            </div>

            <div class="flex items-start justify-between gap-3 rounded-lg bg-default/60 p-2.5">
              <div class="min-w-0">
                <p class="text-xs font-bold text-highlighted">
                  {{ t('rewards.admin.form.requiresNote') }}
                </p>
                <p class="mt-0.5 text-[10px] text-muted">
                  {{ t('rewards.requiresNote') }}
                </p>
              </div>
              <USwitch
                v-model="form.requiresNote"
                :aria-label="t('rewards.admin.form.requiresNote')"
              />
            </div>

            <UFormField :label="t('rewards.admin.form.maxPerUser')">
              <div class="flex items-center gap-2">
                <USwitch
                  v-model="form.unlimitedPerUser"
                  :aria-label="t('rewards.admin.form.stockUnlimited')"
                />
                <UInput
                  v-model.number="form.maxPerUser"
                  type="number"
                  dir="ltr"
                  :min="1"
                  :max="1000"
                  :disabled="form.unlimitedPerUser"
                  class="w-full"
                />
              </div>
            </UFormField>

            <UFormField :label="t('rewards.admin.form.minLevel')">
              <div class="flex items-center gap-2">
                <USwitch
                  v-model="form.unlimitedLevel"
                  :aria-label="t('rewards.admin.form.stockUnlimited')"
                />
                <UInput
                  v-model.number="form.minLevel"
                  type="number"
                  dir="ltr"
                  :min="1"
                  :max="200"
                  :disabled="form.unlimitedLevel"
                  class="w-full"
                />
              </div>
            </UFormField>

            <UFormField :label="t('rewards.admin.form.availableFrom')">
              <UInput
                v-model="form.availableFrom"
                type="date"
                dir="ltr"
                class="w-full"
              />
            </UFormField>

            <UFormField :label="t('rewards.admin.form.availableUntil')">
              <UInput
                v-model="form.availableUntil"
                type="date"
                dir="ltr"
                class="w-full"
              />
            </UFormField>
          </div>
        </fieldset>

        <p
          v-if="errorMessage"
          class="rounded-xl bg-error/10 p-3 text-xs font-semibold text-error"
          role="alert"
        >
          {{ errorMessage }}
        </p>
      </form>
    </template>

    <template #footer>
      <div class="flex w-full items-center justify-between gap-2">
        <UButton
          color="neutral"
          variant="ghost"
          :label="t('common.cancel')"
          @click="close"
        />
        <UButton
          color="primary"
          icon="i-heroicons-check"
          :loading="pending"
          :disabled="!canSubmit"
          :label="isEdit ? t('rewards.admin.form.save') : t('rewards.admin.form.create')"
          @click="submit"
        />
      </div>
    </template>
  </UModal>
</template>
