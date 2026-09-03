/**
 * Achievement rule evaluation — pure, no I/O.
 *
 * Achievements are *data*, not code. An admin adds a new one by creating an
 * `Achievement` row whose `criteria` JSON names a metric and a threshold:
 *
 *   { "metric": "tasks_approved", "threshold": 10 }
 *
 * This file is the single interpreter of that JSON, so the metric vocabulary
 * is the only contract an admin has to learn. The metrics themselves are
 * computed server-side (see `server/utils/gamification.ts`) and must never be
 * supplied by a client.
 */

/** Declarative rule shape stored in `Achievement.criteria`. */
export interface AchievementCriteria {
  /** Machine key of a metric in the server's vocabulary, e.g. `tasks_approved`. */
  metric?: string
  /** Unlock when the metric reaches (or passes) this value. */
  threshold?: number
}

/** The server-computed metric snapshot an achievement is evaluated against. */
export type GamificationMetrics = Record<string, number>

/**
 * Does this criteria unlock against the given metrics?
 *
 * `>=` rather than `===` on purpose: metrics are monotonic (approved-task
 * counts, streak highs, levels) so an unlock must survive the value overshooting
 * the threshold between evaluations.
 */
export function evaluateAchievement(
  criteria: unknown,
  metrics: GamificationMetrics,
): boolean {
  if (!criteria || typeof criteria !== 'object' || Array.isArray(criteria)) return false

  const rule = criteria as AchievementCriteria
  const { metric, threshold } = rule

  if (typeof metric !== 'string' || typeof threshold !== 'number') return false
  if (!Number.isFinite(threshold)) return false

  const current = metrics[metric]
  return typeof current === 'number' && Number.isFinite(current) && current >= threshold
}

/**
 * The metric vocabulary the server can compute. Kept here (not just in the
 * server util) so it is documented next to the rules that reference it and the
 * unit tests can assert on it.
 */
export const ACHIEVEMENT_METRICS = [
  /** Approved tasks assigned to the user. */
  'tasks_approved',
  /** Approved tasks that went through at least one revision loop. */
  'revisions_overcome',
  /** Recognitions received from colleagues. */
  'recognitions_received',
  /** Current consecutive-activity streak, in days. */
  'streak_days',
  /** Current level (1-based) on the company ladder. */
  'level',
  /** Lifetime XP. */
  'total_xp',
] as const

export type AchievementMetric = (typeof ACHIEVEMENT_METRICS)[number]
