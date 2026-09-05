<script setup lang="ts">
import type { AnalyticsEmployeeRow, AnalyticsOverviewResponse, ApiErrorBody } from '#shared/types/api'

definePageMeta({ middleware: ['auth'] })

/**
 * The company administration dashboard.
 *
 * One request paints the whole page — KPI tiles, four small charts, the
 * employee performance table and the team comparison — because every number
 * should describe the same moment. The server decides the scope; the page
 * only labels it: an admin sees the company, a manager sees their own
 * subordinates and led teams, and an employee never reaches the page (no
 * nav entry, and a direct URL gets a 403, not a smaller chart).
 *
 * Nothing here is a decorative number: every KPI, row and point is computed
 * by `/api/analytics/overview` from tasks, reviews and the XP/coin ledgers.
 */
const { t } = useI18n()
const format = useLocaleFormat()
const localePath = useLocalePath()
const { can } = useCan()

const { data, status, error, refresh } = await useFetch<AnalyticsOverviewResponse>(
  '/api/analytics/overview',
)

const errorMessage = computed(() => {
  const body = error.value?.data as ApiErrorBody | undefined
  return body?.message ?? null
})

const isCompanyScope = computed(() => data.value?.scope === 'company')

/** KPI tiles — value, label, icon and an accent tone, in reading order. */
const kpiTiles = computed(() => {
  const kpis = data.value?.kpis
  if (!kpis) return []
  return [
    {
      key: 'totalEmployees',
      value: format.number(kpis.totalEmployees),
      icon: 'i-heroicons-users',
      tone: 'text-primary',
    },
    {
      key: 'activeEmployees',
      value: format.number(kpis.activeEmployees),
      icon: 'i-heroicons-user-check',
      tone: 'text-primary',
    },
    {
      key: 'tasks',
      value: format.number(kpis.tasks),
      icon: 'i-heroicons-clipboard-document-list',
      tone: 'text-neutral',
    },
    {
      key: 'completedTasks',
      value: format.number(kpis.completedTasks),
      icon: 'i-heroicons-check-circle',
      tone: 'text-success',
    },
    {
      key: 'pendingReviews',
      value: format.number(kpis.pendingReviews),
      icon: 'i-heroicons-eye',
      tone: 'text-warning',
    },
    {
      key: 'overdueTasks',
      value: format.number(kpis.overdueTasks),
      icon: 'i-heroicons-exclamation-triangle',
      tone: 'text-error',
    },
    {
      key: 'averageScore',
      value: kpis.averageScore === null ? '—' : format.number(kpis.averageScore),
      icon: 'i-heroicons-chart-bar',
      tone: 'text-primary',
    },
    {
      key: 'onTimeRate',
      value: kpis.onTimeRate === null ? '—' : format.percent(kpis.onTimeRate),
      icon: 'i-heroicons-clock',
      tone: 'text-success',
    },
    {
      key: 'totalXp',
      value: format.compact(kpis.totalXp),
      icon: 'i-heroicons-bolt',
      tone: 'text-primary',
    },
    {
      key: 'totalCoinsEarned',
      value: format.compact(kpis.totalCoinsEarned),
      icon: 'i-heroicons-circle-stack-solid',
      tone: 'text-warning',
    },
    {
      key: 'coinsRedeemed',
      value: format.compact(kpis.coinsRedeemed),
      icon: 'i-heroicons-gift',
      tone: 'text-neutral',
    },
  ]
})

const tasksCompletedPoints = computed(() => data.value?.series.tasksCompleted ?? [])
const averageScorePoints = computed(() => data.value?.series.averageScore ?? [])
const xpEarnedPoints = computed(() => data.value?.series.xpEarned ?? [])

const coinSeries = computed(() => [
  {
    name: t('analytics.charts.coinsEarned'),
    points: (data.value?.series.coins ?? []).map(point => ({ day: point.day, value: point.earned as number | null })),
    colorClass: 'text-warning',
  },
  {
    name: t('analytics.charts.coinsRedeemed'),
    points: (data.value?.series.coins ?? []).map(point => ({ day: point.day, value: point.redeemed as number | null })),
    colorClass: 'text-primary',
  },
])

const teams = computed(() => data.value?.teams ?? [])
const employees = computed(() => data.value?.employees ?? [])

const employeesEmpty = computed(
  () => status.value !== 'pending' && employees.value.length === 0,
)

const rangeLabel = computed(() => {
  const range = data.value?.range
  if (!range) return ''
  return t('analytics.rangeLabel', {
    from: format.shortDate(range.from),
    to: format.shortDate(range.to),
  })
})

/** Score cells are 0–100 — a fixed axis keeps the trend honest. */
const scoreFormatter = (value: number) => format.number(value)

/** The admin hub: shortcuts to the management surfaces. */
const hubLinks = computed(() => [
  { to: '/settings', icon: 'i-heroicons-building-office-2', title: t('analytics.hub.settings'), description: t('analytics.hub.settingsDesc') },
  { to: '/team', icon: 'i-heroicons-user-group', title: t('analytics.hub.team'), description: t('analytics.hub.teamDesc') },
  { to: '/members', icon: 'i-heroicons-users', title: t('analytics.hub.members'), description: t('analytics.hub.membersDesc') },
  { to: '/recognition/admin', icon: 'i-heroicons-hand-thumb-up', title: t('analytics.hub.recognition'), description: t('analytics.hub.recognitionDesc') },
  { to: '/rewards/admin', icon: 'i-heroicons-gift', title: t('analytics.hub.rewards'), description: t('analytics.hub.rewardsDesc') },
  { to: '/challenges', icon: 'i-heroicons-flag', title: t('analytics.hub.challenges'), description: t('analytics.hub.challengesDesc') },
])

const percentOrDash = (value: number | null) => (value === null ? '—' : format.percent(value))
const numberOrDash = (value: number | null) => (value === null ? '—' : format.number(value))

const employeeRowTone = (row: AnalyticsEmployeeRow) =>
  row.onTimeRate !== null && row.onTimeRate < 50 ? 'text-error' : 'text-highlighted'
</script>

<template>
  <div>
    <CommonPageHeader
      :title="t('analytics.title')"
      :subtitle="isCompanyScope ? t('analytics.subtitle') : t('analytics.subtitleTeam')"
    >
      <template #actions>
        <UButton
          color="neutral"
          variant="outline"
          icon="i-heroicons-arrow-path"
          :loading="status === 'pending'"
          :aria-label="t('common.retry')"
          square
          @click="refresh()"
        />
      </template>
    </CommonPageHeader>

    <!-- A direct URL past the permission check gets a plain error, never a
         half-empty chart. -->
    <CommonEmptyState
      v-if="errorMessage"
      class="wq-panel"
      icon="i-heroicons-lock-closed"
      :title="t('analytics.accessDenied')"
      :description="errorMessage"
    />

    <div
      v-else-if="data"
      class="space-y-4"
    >
      <!-- scope + window of every number below -->
      <div class="flex flex-wrap items-center justify-between gap-2">
        <UBadge
          :icon="isCompanyScope ? 'i-heroicons-building-office-2' : 'i-heroicons-user-group'"
          color="primary"
          variant="subtle"
        >
          {{ isCompanyScope ? t('analytics.scopeCompany') : t('analytics.scopeTeam') }}
        </UBadge>
        <p class="text-xs text-muted">
          {{ rangeLabel }}
        </p>
      </div>

      <!-- KPI tiles -->
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <div
          v-for="tile in kpiTiles"
          :key="tile.key"
          class="wq-panel p-3.5"
        >
          <UIcon
            :name="tile.icon"
            class="size-5"
            :class="tile.tone"
          />
          <p class="mt-2 truncate text-xl font-black tabular-nums text-highlighted">
            {{ tile.value }}
          </p>
          <p class="mt-0.5 truncate text-[11px] text-muted">
            {{ t(`analytics.kpis.${tile.key}`) }}
          </p>
        </div>
      </div>

      <!-- charts: two per row on wide screens, full width on phones -->
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CommonSectionCard
          :title="t('analytics.charts.tasksCompleted')"
          icon="i-heroicons-check-circle"
        >
          <AnalyticsBarChart
            :points="tasksCompletedPoints"
            :format-value="format.number"
          />
        </CommonSectionCard>

        <CommonSectionCard
          :title="t('analytics.charts.averageScore')"
          icon="i-heroicons-chart-bar"
        >
          <AnalyticsLineChart
            :series="[{
              name: t('analytics.kpis.averageScore'),
              points: averageScorePoints,
              colorClass: 'text-primary',
            }]"
            :max="100"
            :format-value="scoreFormatter"
          />
        </CommonSectionCard>

        <CommonSectionCard
          :title="t('analytics.charts.xpEarned')"
          icon="i-heroicons-bolt"
        >
          <AnalyticsBarChart
            :points="xpEarnedPoints"
            :format-value="format.number"
          />
        </CommonSectionCard>

        <CommonSectionCard
          :title="t('analytics.charts.coins')"
          icon="i-heroicons-circle-stack-solid"
        >
          <AnalyticsLineChart
            :series="coinSeries"
            :format-value="format.number"
          />
        </CommonSectionCard>
      </div>

      <!-- team performance: one row per team, a real bar for completion -->
      <CommonSectionCard
        :title="t('analytics.teams.title')"
        icon="i-heroicons-user-group"
      >
        <CommonEmptyState
          v-if="teams.length === 0"
          icon="i-heroicons-user-group"
          :title="t('analytics.teams.empty')"
        />
        <ul
          v-else
          class="divide-y divide-default"
        >
          <li
            v-for="team in teams"
            :key="team.id"
            class="py-4 first:pt-0 last:pb-0"
          >
            <div class="flex flex-wrap items-center justify-between gap-2">
              <p class="text-sm font-bold text-highlighted">
                {{ team.name }}
                <span class="text-xs font-normal text-muted">
                  · {{ format.number(team.memberCount) }} {{ t('analytics.teams.members') }}
                </span>
              </p>
              <div class="flex items-center gap-2 text-xs text-muted">
                <span class="tabular-nums">
                  {{ t('analytics.teams.avgScore') }}:
                  <span class="font-bold text-highlighted">{{ numberOrDash(team.averageScore) }}</span>
                </span>
                <span class="tabular-nums">
                  {{ t('analytics.teams.onTime') }}:
                  <span class="font-bold text-highlighted">{{ percentOrDash(team.onTimeRate) }}</span>
                </span>
              </div>
            </div>

            <div class="mt-3 flex items-center gap-3">
              <div class="h-2 flex-1 overflow-hidden rounded-full bg-elevated">
                <div
                  class="h-full rounded-full bg-primary transition-[width] duration-500"
                  :style="{ width: `${team.completionRate}%` }"
                />
              </div>
              <span class="w-10 shrink-0 text-end text-xs font-bold text-primary tabular-nums">
                {{ format.percent(team.completionRate) }}
              </span>
            </div>

            <div class="mt-2.5 flex flex-wrap items-center gap-2">
              <UBadge
                color="neutral"
                variant="subtle"
                size="sm"
                icon="i-heroicons-clipboard-document-list"
              >
                {{ t('analytics.teams.activeTasks') }}: {{ format.number(team.activeTasks) }}
              </UBadge>
              <UBadge
                :color="team.overdueTasks > 0 ? 'error' : 'neutral'"
                variant="subtle"
                size="sm"
                icon="i-heroicons-exclamation-triangle"
              >
                {{ t('analytics.teams.overdue') }}: {{ format.number(team.overdueTasks) }}
              </UBadge>
            </div>
          </li>
        </ul>
      </CommonSectionCard>

      <!-- employee performance table -->
      <CommonSectionCard
        :title="t('analytics.employees.title')"
        :description="t('analytics.employees.description')"
        icon="i-heroicons-users"
      >
        <CommonEmptyState
          v-if="employeesEmpty"
          icon="i-heroicons-users"
          :title="t('analytics.employees.empty')"
        />
        <div
          v-else
          class="-mx-4 overflow-x-auto px-4 sm:-mx-5 sm:px-5"
        >
          <table class="w-full min-w-[900px] text-sm">
            <thead>
              <tr class="border-b border-default text-start text-xs text-muted">
                <th class="px-2 py-2.5 text-start font-semibold">
                  {{ t('analytics.employees.employee') }}
                </th>
                <th class="px-2 py-2.5 text-start font-semibold">
                  {{ t('analytics.employees.team') }}
                </th>
                <th class="px-2 py-2.5 text-end font-semibold">
                  {{ t('analytics.employees.completed') }}
                </th>
                <th class="px-2 py-2.5 text-end font-semibold">
                  {{ t('analytics.employees.avgScore') }}
                </th>
                <th class="px-2 py-2.5 text-end font-semibold">
                  {{ t('analytics.employees.onTime') }}
                </th>
                <th class="px-2 py-2.5 text-end font-semibold">
                  {{ t('analytics.employees.xp') }}
                </th>
                <th class="px-2 py-2.5 text-end font-semibold">
                  {{ t('analytics.employees.level') }}
                </th>
                <th class="px-2 py-2.5 text-end font-semibold">
                  {{ t('analytics.employees.coinsEarned') }}
                </th>
                <th class="px-2 py-2.5 text-end font-semibold">
                  {{ t('analytics.employees.coinsSpent') }}
                </th>
                <th class="px-2 py-2.5 text-end font-semibold">
                  {{ t('analytics.employees.achievements') }}
                </th>
                <th class="px-2 py-2.5 text-end font-semibold">
                  {{ t('analytics.employees.recognition') }}
                </th>
                <th class="px-2 py-2.5 text-end font-semibold">
                  {{ t('analytics.employees.streak') }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-default">
              <tr
                v-for="row in employees"
                :key="row.id"
                class="transition-colors hover:bg-elevated/50"
              >
                <td class="px-2 py-3">
                  <NuxtLink
                    :to="localePath(`/members/${row.id}`)"
                    class="flex items-center gap-2.5 font-bold text-highlighted hover:text-primary"
                  >
                    <UAvatar
                      :src="row.avatarUrl ?? undefined"
                      :text="row.fullName.charAt(0)"
                      size="sm"
                    />
                    <span class="whitespace-nowrap">{{ row.fullName }}</span>
                  </NuxtLink>
                </td>
                <td class="whitespace-nowrap px-2 py-3 text-xs text-muted">
                  {{ row.teamName ?? '—' }}
                </td>
                <td class="px-2 py-3 text-end font-bold tabular-nums text-highlighted">
                  {{ format.number(row.tasksCompleted) }}
                </td>
                <td class="px-2 py-3 text-end tabular-nums">
                  {{ numberOrDash(row.averageScore) }}
                </td>
                <td
                  class="px-2 py-3 text-end tabular-nums"
                  :class="employeeRowTone(row)"
                >
                  {{ percentOrDash(row.onTimeRate) }}
                </td>
                <td class="px-2 py-3 text-end tabular-nums text-highlighted">
                  {{ format.compact(row.xp) }}
                </td>
                <td class="whitespace-nowrap px-2 py-3 text-end text-xs text-muted">
                  {{ row.level === null ? '—' : `${t('analytics.employees.level')} ${format.number(row.level)}${row.levelTitle ? ` · ${row.levelTitle}` : ''}` }}
                </td>
                <td class="px-2 py-3 text-end tabular-nums">
                  {{ format.number(row.coinsEarned) }}
                </td>
                <td class="px-2 py-3 text-end tabular-nums text-muted">
                  {{ format.number(row.coinsSpent) }}
                </td>
                <td class="px-2 py-3 text-end tabular-nums">
                  {{ format.number(row.achievements) }}
                </td>
                <td class="px-2 py-3 text-end tabular-nums">
                  {{ format.number(row.recognition) }}
                </td>
                <td class="px-2 py-3 text-end tabular-nums">
                  {{ format.number(row.currentStreak) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CommonSectionCard>

      <!-- the admin hub — only for people who can actually use the targets -->
      <CommonSectionCard
        v-if="isCompanyScope && can('company:update')"
        :title="t('analytics.hub.title')"
        :description="t('analytics.hub.description')"
        icon="i-heroicons-squares-2x2"
      >
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <NuxtLink
            v-for="link in hubLinks"
            :key="link.to"
            :to="localePath(link.to)"
            class="group flex items-start gap-3 rounded-xl border border-default p-3.5 transition-colors hover:border-primary hover:bg-primary/5"
          >
            <span class="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <UIcon
                :name="link.icon"
                class="size-5"
              />
            </span>
            <span class="min-w-0">
              <span class="block truncate text-sm font-bold text-highlighted group-hover:text-primary">
                {{ link.title }}
              </span>
              <span class="mt-0.5 block text-[11px] leading-4 text-muted">
                {{ link.description }}
              </span>
            </span>
          </NuxtLink>
        </div>
      </CommonSectionCard>
    </div>
  </div>
</template>
