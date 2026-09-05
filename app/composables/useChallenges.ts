import type { ChallengeGoalKey, ChallengeStatus, ChallengeType, ParticipantStatus } from '#shared/utils/challenges'
import { CHALLENGE_GOALS, goalAllowedFor, isRateGoal } from '#shared/utils/challenges'

/**
 * Presentation vocabulary for challenges.
 *
 * The *rules* — what a status means, which goal a type may track, when a
 * challenge may be edited — come from the API and `shared/utils/challenges.ts`.
 * What lives here is only how to draw them: which icon a type gets, which
 * colour a status wears, and how a goal reads as a sentence. Keeping the copy
 * in one place means a status can never reach the screen untranslated.
 */

/** Icon per challenge type. */
const TYPE_ICONS: Record<ChallengeType, string> = {
  INDIVIDUAL: 'i-heroicons-user',
  TEAM: 'i-heroicons-user-group',
}

/** Icon per goal key — what the bar is actually counting. */
const GOAL_ICONS: Record<ChallengeGoalKey, string> = {
  tasks_completed: 'i-heroicons-check-badge',
  on_time_rate: 'i-heroicons-clock',
  team_completion_rate: 'i-heroicons-chart-bar',
}

/** Tone per challenge status — running is alive, history is calm. */
const STATUS_TONES: Record<ChallengeStatus, 'primary' | 'success' | 'warning' | 'neutral' | 'error'> = {
  DRAFT: 'neutral',
  ACTIVE: 'primary',
  COMPLETED: 'success',
  ENDED: 'neutral',
  CANCELLED: 'error',
}

const PARTICIPANT_TONES: Record<ParticipantStatus, 'primary' | 'success' | 'warning' | 'neutral'> = {
  NOT_STARTED: 'neutral',
  IN_PROGRESS: 'warning',
  COMPLETED: 'success',
  CLAIMED: 'success',
}

export function useChallenges() {
  const { t } = useI18n()

  return {
    typeIcon: (type: ChallengeType) => TYPE_ICONS[type] ?? 'i-heroicons-flag',
    typeLabel: (type: ChallengeType) => t(`challenges.type.${type}`),
    goalIcon: (key: ChallengeGoalKey) => GOAL_ICONS[key] ?? 'i-heroicons-flag',
    statusTone: (status: ChallengeStatus) => STATUS_TONES[status] ?? 'neutral',
    statusLabel: (status: ChallengeStatus) => t(`challenges.status.${status}`),
    participantTone: (status: ParticipantStatus) => PARTICIPANT_TONES[status] ?? 'neutral',
    participantLabel: (status: ParticipantStatus) => t(`challenges.participant.${status}`),

    /**
     * The goal as a sentence: «۱۰ تسک تأییدشده» or «۹۰٪ تحویل به‌موقع».
     * The value arrives pre-formatted (Persian digits) from the caller.
     */
    goalLabel: (key: ChallengeGoalKey, formattedValue: string) =>
      t(`challenges.goal.${key}`, { value: formattedValue }),

    /** Goal keys the chosen type may track, as select options. */
    goalOptions: (type: ChallengeType) =>
      (Object.keys(CHALLENGE_GOALS) as ChallengeGoalKey[])
        .filter(key => goalAllowedFor(type, key))
        .map(key => ({
          value: key,
          label: t(`challenges.goalOption.${key}`),
          icon: GOAL_ICONS[key],
        })),

    /** The unit suffix a goal value input carries. */
    goalUnitLabel: (key: ChallengeGoalKey) =>
      isRateGoal(key) ? t('challenges.unit.percent') : t('challenges.unit.tasks'),
  }
}
