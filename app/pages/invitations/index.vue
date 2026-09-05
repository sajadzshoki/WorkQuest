<script setup lang="ts">
import type { ApiErrorBody, InvitationListResponse, InvitationStatus, TeamSummary } from '#shared/types/api'

definePageMeta({ middleware: ['auth'] })

const { t } = useI18n()
const localePath = useLocalePath()
const format = useLocaleFormat()
const toast = useToast()
const confirm = useConfirm()
const { can } = useCan()

/**
 * Status tab drives the query. `PENDING` is the default because that is the
 * only list an inviter can still act on.
 */
const status = ref<InvitationStatus>('PENDING')

const { data, pending, refresh } = await useFetch<InvitationListResponse>('/api/invitations', {
  query: computed(() => ({ status: status.value, pageSize: 100 })),
  watch: [status],
})

const { data: teamsData } = await useFetch<{ teams: TeamSummary[] }>('/api/teams', {
  transform: response => ({
    teams: response.teams.map(team => ({
      id: team.id,
      name: team.name,
      slug: team.slug,
      description: team.description,
      memberCount: team.memberCount,
      lead: team.lead,
      createdAt: '',
    })),
  }),
})

const inviteOpen = ref(false)
const revokingId = ref<string | null>(null)

const tabs = computed(() =>
  (['PENDING', 'ACCEPTED', 'REVOKED', 'EXPIRED'] as const).map(value => ({
    label: t(`status.invitation.${value}`),
    value,
  })),
)

/** Days left on an open invitation, floored at zero — shown in Persian digits. */
function daysLeft(expiresAt: string): string {
  const ms = new Date(expiresAt).getTime() - Date.now()
  return format.number(Math.max(0, Math.ceil(ms / 86_400_000)))
}

async function revoke(id: string, fullName: string) {
  if (!(await confirm({ title: t('invitations.confirmTitle'), description: t('invitations.revokeConfirm', { name: fullName }), tone: 'error' }))) return

  revokingId.value = id
  try {
    await $fetch(`/api/invitations/${id}`, { method: 'DELETE' })
    toast.add({ title: t('invitations.revoked'), color: 'success', icon: 'i-heroicons-check-circle' })
    await refresh()
  }
  catch (error) {
    const payload = (error as { data?: ApiErrorBody }).data
    toast.add({
      title: payload?.message ?? t('invitations.errors.generic'),
      color: 'error',
      icon: 'i-heroicons-exclamation-triangle',
    })
  }
  finally {
    revokingId.value = null
  }
}
</script>

<template>
  <div>
    <CommonPageHeader
      :title="t('invitations.title')"
      :subtitle="t('invitations.subtitle')"
    >
      <template #actions>
        <UButton
          icon="i-heroicons-user-plus"
          size="lg"
          @click="inviteOpen = true"
        >
          {{ t('members.invite.cta') }}
        </UButton>
      </template>
    </CommonPageHeader>

    <div class="mb-4 flex flex-wrap gap-2">
      <UButton
        v-for="tab in tabs"
        :key="tab.value"
        :color="status === tab.value ? 'primary' : 'neutral'"
        :variant="status === tab.value ? 'solid' : 'outline'"
        size="sm"
        @click="status = tab.value"
      >
        {{ tab.label }}
      </UButton>
    </div>

    <CommonSectionCard
      :title="t(`status.invitation.${status}`)"
      :description="data ? t('members.total', { count: format.number(data.total) }) : undefined"
      icon="i-heroicons-envelope"
    >
      <CommonEmptyState
        v-if="!pending && !data?.invitations.length"
        icon="i-heroicons-envelope-open"
        :title="t('invitations.empty')"
        :description="t('invitations.emptyHint')"
      />

      <!-- Horizontal scroll on narrow screens: the table keeps its columns
           rather than collapsing into something unreadable. -->
      <div
        v-else
        class="-mx-4 overflow-x-auto sm:-mx-5"
      >
        <table
          class="w-full min-w-[640px] border-collapse text-sm"
        >
          <thead>
            <tr class="border-b border-default text-start text-xs text-muted">
              <th class="py-2 text-start font-semibold">
                {{ t('members.invite.nameLabel') }}
              </th>
              <th class="py-2 text-start font-semibold">
                {{ t('members.invite.phoneLabel') }}
              </th>
              <th class="py-2 text-start font-semibold">
                {{ t('members.invite.teamLabel') }}
              </th>
              <th class="py-2 text-start font-semibold">
                {{ t('members.invite.roleLabel') }}
              </th>
              <th class="py-2 text-start font-semibold">
                {{ t('common.status') }}
              </th>
              <th class="py-2 text-start font-semibold">
                {{ t('invitations.expires') }}
              </th>
              <th class="py-2" />
            </tr>
          </thead>
          <tbody class="divide-y divide-default">
            <tr
              v-for="invitation in data?.invitations ?? []"
              :key="invitation.id"
            >
              <td class="py-3">
                <p class="font-bold text-highlighted">
                  {{ invitation.fullName }}
                </p>
                <p class="text-xs text-muted">
                  {{ invitation.jobTitle ?? t('members.noJobTitle') }}
                </p>
              </td>
              <td
                dir="ltr"
                class="py-3 text-start text-muted"
              >
                {{ format.phone(invitation.phone) }}
              </td>
              <td class="py-3 text-muted">
                {{ invitation.team?.name ?? t('members.noTeam') }}
              </td>
              <td class="py-3">
                <MembersRoleBadge :role="invitation.role" />
              </td>
              <td class="py-3">
                <MembersStatusBadge :status="invitation.status" />
              </td>
              <td class="py-3 text-muted">
                <template v-if="invitation.status === 'PENDING'">
                  {{ t('invitations.daysLeft', { count: daysLeft(invitation.expiresAt) }) }}
                </template>
                <template v-else-if="invitation.acceptedAt">
                  {{ format.date(invitation.acceptedAt, { month: 'short', day: 'numeric' }) }}
                </template>
                <template v-else>
                  {{ format.date(invitation.expiresAt, { month: 'short', day: 'numeric' }) }}
                </template>
              </td>
              <td class="py-3 text-end">
                <UButton
                  v-if="invitation.status === 'PENDING' && (data?.canRevoke || can('member:invite'))"
                  color="error"
                  variant="ghost"
                  size="xs"
                  icon="i-heroicons-x-circle"
                  :loading="revokingId === invitation.id"
                  @click="revoke(invitation.id, invitation.fullName)"
                >
                  {{ t('invitations.revoke') }}
                </UButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </CommonSectionCard>

    <MembersInviteModal
      v-model:open="inviteOpen"
      :teams="teamsData?.teams ?? []"
      @invited="refresh()"
    />

    <NuxtLink
      :to="localePath('/members')"
      class="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-primary"
    >
      <UIcon
        name="i-heroicons-users"
        class="size-4"
      />
      {{ t('members.title') }}
    </NuxtLink>
  </div>
</template>
