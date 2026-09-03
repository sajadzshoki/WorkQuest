import type { LevelBoundary, LevelProgress } from '#shared/utils/xp'

import { computeLevelProgress } from '#shared/utils/xp'

/**
 * The reusable level calculation service.
 *
 * Levels are always calculated **server-side**: every endpoint that needs a
 * level goes through `resolveLevelProgress`, which loads the company's ladder
 * and folds the XP total through the shared, unit-tested `computeLevelProgress`.
 * The browser only renders the numbers it is handed — there is no client-side
 * second implementation of the curve that could disagree with the ledger.
 */

export interface LevelResolution extends LevelProgress {
  /** The rung after the current one, or null at the top of the ladder. */
  next: { level: number, minXp: number, title: string | null } | null
  /** Id of the `Level` row the user currently sits on, when the ladder exists. */
  levelId: string | null
  iconKey: string | null
}

/** The delegate shape the service needs; satisfied by the tenant client and its transactions. */
export interface LevelStore {
  level: {
    findMany(args: {
      where: { companyId: string }
      orderBy: { minXp: 'asc' }
      select: { id: true, level: true, minXp: true, title: true, iconKey: true }
    }): Promise<Array<{ id: string, level: number, minXp: number, title: string | null, iconKey: string | null }>>
  }
}

/**
 * Resolve an XP total to its level, progress and next rung on the company ladder.
 *
 * When the tenant has defined no `Level` rows the shared default curve kicks
 * in, so a fresh company and a seeded one can never disagree about what level
 * a given XP total reaches.
 */
export async function resolveLevelProgress(
  db: LevelStore,
  companyId: string,
  xp: number,
): Promise<LevelResolution> {
  const rows = await db.level.findMany({
    where: { companyId },
    orderBy: { minXp: 'asc' },
    select: { id: true, level: true, minXp: true, title: true, iconKey: true },
  })

  const boundaries: LevelBoundary[] = rows.map(row => ({
    level: row.level,
    minXp: row.minXp,
    title: row.title,
    iconKey: row.iconKey,
  }))

  const progress = computeLevelProgress(xp, boundaries)
  const current = rows.find(row => row.level === progress.level) ?? null
  const next = rows.find(row => row.level === progress.level + 1) ?? null

  return {
    ...progress,
    next: next ? { level: next.level, minXp: next.minXp, title: next.title } : null,
    levelId: current?.id ?? null,
    iconKey: current?.iconKey ?? null,
  }
}
