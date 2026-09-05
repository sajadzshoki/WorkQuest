import type { LeaderboardPeriod, LeaderboardScope } from '#shared/utils/leaderboard'

import { LEADERBOARD_PERIODS, MAX_LEADERBOARD_ENTRIES } from '#shared/utils/leaderboard'

/** The three surfaces of the leaderboard page. */
export type LeaderboardTab = 'company' | 'team' | 'progress'

/**
 * Leaderboard view state.
 *
 * The page owns the fetching; this composable owns the *shape* of the request so
 * the query string and the server's zod schema cannot drift apart. The values it
 * can produce are exactly the ones `shared/schemas` accepts: `week`/`month`
 * (never "all"), `company`/`team`, and a limit at or below the privacy ceiling.
 */
export function useLeaderboard() {
  const { t } = useI18n()

  const tab = ref<LeaderboardTab>('company')
  const period = ref<LeaderboardPeriod>('week')
  const teamId = ref<string | null>(null)

  /**
   * How many rows the board asks for. The server clamps this too; asking for the
   * ceiling is a product decision (top five), not a client preference.
   */
  const limit = ref<number>(MAX_LEADERBOARD_ENTRIES)

  const scope = computed<LeaderboardScope>(() => (tab.value === 'team' ? 'team' : 'company'))

  const boardQuery = computed(() => ({
    period: period.value,
    scope: scope.value,
    limit: String(limit.value),
    ...(scope.value === 'team' && teamId.value ? { teamId: teamId.value } : {}),
  }))

  const tabs = computed(() => [
    { label: t('leaderboard.tabs.company'), value: 'company' as const, icon: 'i-heroicons-building-office-2' },
    { label: t('leaderboard.tabs.team'), value: 'team' as const, icon: 'i-heroicons-user-group' },
    { label: t('leaderboard.tabs.progress'), value: 'progress' as const, icon: 'i-heroicons-arrow-trending-up' },
  ])

  const periodOptions = computed(() =>
    LEADERBOARD_PERIODS.map(value => ({
      value,
      label: t(`leaderboard.period.${value}`),
      fullLabel: t(`leaderboard.periodFull.${value}`),
    })),
  )

  function setTab(value: LeaderboardTab): void {
    tab.value = value
  }

  function setPeriod(value: LeaderboardPeriod): void {
    period.value = value
  }

  function setTeam(value: string | null): void {
    teamId.value = value
  }

  return {
    tab,
    tabs,
    period,
    periodOptions,
    teamId,
    limit,
    scope,
    boardQuery,
    setTab,
    setPeriod,
    setTeam,
  }
}
