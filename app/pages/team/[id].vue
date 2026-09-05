<script setup lang="ts">
import type { ApiErrorBody, TeamDetailResponse } from '#shared/types/api'

definePageMeta({ middleware: ['auth'] })

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const localePath = useLocalePath()
const format = useLocaleFormat()
const toast = useToast()
const confirm = useConfirm()
const { user } = useSession()

const teamId = computed(() => String(route.params.id ?? ''))

const { data, error, refresh } = await useFetch<TeamDetailResponse>(() => `/api/teams/${teamId.value}`)

const team = computed(() => data.value?.team ?? null)
const canEdit = computed(() => data.value?.canEdit ?? false)
const candidates = computed(() => data.value?.candidates ?? [])

const editing = ref(false)
const adding = ref(false)
const busy = ref(false)
const errorMessage = ref<string | null>(null)

const draft = reactive({ name: '', description: '', leadId: '' })
const addForm = reactive({ userId: '', managerId: '' })

/**
 * Only MANAGER and above may hold the lead.
 *
 * The server enforces this (`LEAD_ROLE_TOO_LOW`); filtering here means the form
 * never offers a choice that is guaranteed to fail. Members who are not
 * eligible yet are listed as disabled with a hint, so the reason is visible.
 */
const leadItems = computed(() => [
  { label: t('team.noLead'), value: '' },
  ...(team.value?.members ?? []).map(member => ({
    label: ['OWNER', 'ADMIN', 'MANAGER'].includes(member.companyRole)
      ? member.fullName
      : `${member.fullName} — ${t('team.leadNeedsManager')}`,
    value: member.userId,
    disabled: !['OWNER', 'ADMIN', 'MANAGER'].includes(member.companyRole),
  })),
])

const memberItems = computed(() =>
  candidates.value.map(item => ({
    label: item.jobTitle ? `${item.fullName} — ${item.jobTitle}` : item.fullName,
    value: item.id,
  })),
)

/** Manager options are the team's own members — the server enforces this too. */
const managerItems = computed(() => [
  { label: t('team.noManager'), value: '' },
  ...(team.value?.members ?? [])
    .filter(member => member.userId !== addForm.userId)
    .map(member => ({ label: member.fullName, value: member.userId })),
])

function openEdit() {
  if (!team.value) return
  draft.name = team.value.name
  draft.description = team.value.description ?? ''
  draft.leadId = team.value.lead?.id ?? ''
  errorMessage.value = null
  editing.value = true
}

async function save() {
  busy.value = true
  errorMessage.value = null
  try {
    await $fetch(`/api/teams/${teamId.value}`, {
      method: 'PATCH',
      body: { name: draft.name, description: draft.description, leadId: draft.leadId },
    })
    await refresh()
    editing.value = false
    toast.add({ title: t('team.editSuccess'), color: 'success', icon: 'i-heroicons-check-circle' })
  }
  catch (err) {
    errorMessage.value = fail(err)
  }
  finally {
    busy.value = false
  }
}

async function addMember() {
  if (!addForm.userId) return
  busy.value = true
  errorMessage.value = null
  try {
    await $fetch(`/api/teams/${teamId.value}/members`, {
      method: 'POST',
      body: { userId: addForm.userId, managerId: addForm.managerId },
    })
    await refresh()
    addForm.userId = ''
    addForm.managerId = ''
    adding.value = false
    toast.add({ title: t('team.addSuccess'), color: 'success', icon: 'i-heroicons-user-plus' })
  }
  catch (err) {
    errorMessage.value = fail(err)
  }
  finally {
    busy.value = false
  }
}

async function removeMember(userId: string, fullName: string) {
  if (!(await confirm({ title: t('team.removeMemberTitle'), description: t('team.removeMemberConfirm', { name: fullName }), tone: 'error' }))) return
  busy.value = true
  try {
    await $fetch(`/api/teams/${teamId.value}/members/${userId}`, { method: 'DELETE' })
    await refresh()
  }
  catch (err) {
    toast.add({ title: fail(err), color: 'error', icon: 'i-heroicons-exclamation-triangle' })
  }
  finally {
    busy.value = false
  }
}

async function destroy() {
  if (!team.value) return
  if (!(await confirm({ title: t('team.deleteTitle'), description: t('team.deleteConfirm', { name: team.value.name }), tone: 'error', icon: 'i-heroicons-trash' }))) return
  busy.value = true
  try {
    await $fetch(`/api/teams/${teamId.value}`, { method: 'DELETE' })
    toast.add({ title: t('team.deleteSuccess'), color: 'success', icon: 'i-heroicons-check-circle' })
    await router.push(localePath('/team'))
  }
  catch (err) {
    toast.add({ title: fail(err), color: 'error', icon: 'i-heroicons-exclamation-triangle' })
  }
  finally {
    busy.value = false
  }
}

function fail(err: unknown): string {
  const payload = (err as { data?: ApiErrorBody }).data
  return payload?.message ?? t('team.errors.generic')
}
</script>

<template>
  <div>
    <NuxtLink
      :to="localePath('/team')"
      class="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-primary"
    >
      <UIcon
        name="i-heroicons-arrow-right"
        class="size-4"
      />
      {{ t('team.title') }}
    </NuxtLink>

    <CommonEmptyState
      v-if="error || !team"
      class="wq-panel"
      icon="i-heroicons-user-group"
      :title="t('team.notFound')"
    />

    <template v-else>
      <CommonPageHeader
        :title="team.name"
        :subtitle="team.description ?? t('team.memberCount', { count: format.number(team.members.length) })"
      >
        <template #actions>
          <UButton
            v-if="canEdit"
            color="neutral"
            variant="outline"
            icon="i-heroicons-user-plus"
            size="lg"
            @click="adding = true"
          >
            {{ t('team.addMember') }}
          </UButton>
          <UButton
            v-if="canEdit"
            color="neutral"
            variant="outline"
            icon="i-heroicons-pencil-square"
            size="lg"
            @click="openEdit"
          >
            {{ t('common.edit') }}
          </UButton>
        </template>
      </CommonPageHeader>

      <div class="grid gap-4 lg:grid-cols-3">
        <CommonSectionCard
          :title="t('team.aboutTitle')"
          icon="i-heroicons-information-circle"
          class="lg:col-span-1"
        >
          <dl class="space-y-3 text-sm">
            <div class="flex items-center justify-between gap-3">
              <dt class="text-muted">
                {{ t('team.lead') }}
              </dt>
              <dd class="truncate font-semibold text-highlighted">
                {{ team.lead?.fullName ?? t('team.noLead') }}
              </dd>
            </div>
            <div class="flex items-center justify-between gap-3">
              <dt class="text-muted">
                {{ t('team.members') }}
              </dt>
              <dd class="font-semibold text-highlighted">
                {{ format.number(team.members.length) }}
              </dd>
            </div>
            <div class="flex items-center justify-between gap-3">
              <dt class="text-muted">
                {{ t('team.createdAt') }}
              </dt>
              <dd class="text-highlighted">
                {{ format.date(team.createdAt, { year: 'numeric', month: 'short', day: 'numeric' }) }}
              </dd>
            </div>
          </dl>

          <UButton
            v-if="canEdit"
            class="mt-4"
            color="error"
            variant="ghost"
            size="sm"
            icon="i-heroicons-trash"
            block
            :loading="busy"
            @click="destroy"
          >
            {{ t('team.delete') }}
          </UButton>
        </CommonSectionCard>

        <CommonSectionCard
          :title="t('team.members')"
          icon="i-heroicons-users"
          class="lg:col-span-2"
        >
          <CommonEmptyState
            v-if="!team.members.length"
            icon="i-heroicons-user-group"
            :title="t('team.noMembers')"
          />

          <ul
            v-else
            class="divide-y divide-default"
          >
            <li
              v-for="member in team.members"
              :key="member.id"
              class="flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0"
            >
              <UAvatar
                :src="member.avatarUrl ?? undefined"
                :text="member.fullName.charAt(0)"
                size="md"
              />

              <div class="min-w-0 flex-1">
                <NuxtLink
                  :to="localePath(`/members/${member.userId}`)"
                  class="flex items-center gap-2 truncate text-sm font-bold text-highlighted hover:text-primary"
                >
                  {{ member.fullName }}
                  <UBadge
                    v-if="member.userId === user?.id"
                    color="success"
                    variant="subtle"
                    size="sm"
                  >
                    {{ t('members.you') }}
                  </UBadge>
                  <UBadge
                    v-if="member.role === 'LEAD'"
                    color="primary"
                    variant="subtle"
                    size="sm"
                  >
                    {{ t('team.lead') }}
                  </UBadge>
                </NuxtLink>
                <p class="truncate text-xs text-muted">
                  {{ member.jobTitle ?? t('members.noJobTitle') }}
                  <span v-if="member.manager"> · {{ t('team.manager') }}: {{ member.manager.fullName }}</span>
                </p>
              </div>

              <UButton
                v-if="canEdit"
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-heroicons-user-minus"
                :loading="busy"
                @click="removeMember(member.userId, member.fullName)"
              >
                {{ t('team.removeMember') }}
              </UButton>
            </li>
          </ul>
        </CommonSectionCard>
      </div>
    </template>

    <UModal
      v-model:open="editing"
      :title="t('team.editTitle')"
      :description="team?.name"
    >
      <template #body>
        <form
          class="space-y-4"
          @submit.prevent="save"
        >
          <UFormField
            :label="t('team.nameLabel')"
            required
          >
            <UInput
              v-model="draft.name"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField :label="t('team.descriptionLabel')">
            <UTextarea
              v-model="draft.description"
              :rows="3"
              class="w-full"
            />
          </UFormField>

          <UFormField
            :label="t('team.lead')"
            :hint="t('common.optional')"
          >
            <USelect
              v-model="draft.leadId"
              :items="leadItems"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UAlert
            v-if="errorMessage"
            color="error"
            variant="subtle"
            icon="i-heroicons-exclamation-triangle"
            :title="errorMessage"
          />
        </form>
      </template>

      <template #footer>
        <div class="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <UButton
            color="neutral"
            variant="ghost"
            size="lg"
            @click="editing = false"
          >
            {{ t('common.cancel') }}
          </UButton>
          <UButton
            type="submit"
            size="lg"
            :loading="busy"
            @click="save"
          >
            {{ t('common.save') }}
          </UButton>
        </div>
      </template>
    </UModal>

    <UModal
      v-model:open="adding"
      :title="t('team.addMemberTitle')"
      :description="t('team.addMemberSubtitle')"
    >
      <template #body>
        <CommonEmptyState
          v-if="!memberItems.length"
          icon="i-heroicons-user-group"
          :title="t('team.noCandidates')"
          :description="t('team.noCandidatesHint')"
        />

        <form
          v-else
          class="space-y-4"
          @submit.prevent="addMember"
        >
          <UFormField
            :label="t('team.candidateLabel')"
            required
          >
            <USelect
              v-model="addForm.userId"
              :items="memberItems"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField
            :label="t('team.manager')"
            :hint="t('common.optional')"
          >
            <USelect
              v-model="addForm.managerId"
              :items="managerItems"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UAlert
            v-if="errorMessage"
            color="error"
            variant="subtle"
            icon="i-heroicons-exclamation-triangle"
            :title="errorMessage"
          />
        </form>
      </template>

      <template #footer>
        <div class="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <UButton
            color="neutral"
            variant="ghost"
            size="lg"
            @click="adding = false"
          >
            {{ t('common.cancel') }}
          </UButton>
          <UButton
            type="submit"
            size="lg"
            :loading="busy"
            :disabled="!addForm.userId"
            @click="addMember"
          >
            {{ t('team.addMember') }}
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
