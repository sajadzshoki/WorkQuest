/**
 * Level ladder maths.
 *
 * Levels are stored per company (`Level` rows) so a tenant can tune the curve,
 * but every screen needs the same "how far to the next level" arithmetic, so the
 * pure functions live here and are shared by client and server.
 */

export interface LevelBoundary {
  level: number
  minXp: number
  title?: string | null
  iconKey?: string | null
}

/**
 * Default curve used when a company has no explicit ladder yet:
 * level 1 starts at 0 XP and every level after that is 500 XP wide.
 */
export function defaultMinXp(level: number): number {
  return Math.max(0, level - 1) * 500
}

/**
 * Resolve the level a given XP total falls into.
 * `boundaries` must be sorted ascending by `minXp`.
 */
export function resolveLevel(xp: number, boundaries: readonly LevelBoundary[]): number {
  if (boundaries.length === 0) return Math.floor(xp / 500) + 1
  let current = boundaries[0]
  for (const boundary of boundaries) {
    if (xp >= boundary.minXp) current = boundary
    else break
  }
  return current?.level ?? 1
}

export interface LevelProgress {
  level: number
  /** XP inside the current level. */
  currentXp: number
  /** XP span of the current level. */
  neededXp: number
  /** 0-100, safe for a progress bar. */
  percent: number
  title: string | null
}

/** Compute progress between `boundaries`; falls back to the default curve. */
export function computeLevelProgress(
  xp: number,
  boundaries: readonly LevelBoundary[],
): LevelProgress {
  const sorted = [...boundaries].sort((a, b) => a.minXp - b.minXp)
  const level = resolveLevel(xp, sorted)

  const current = sorted.find(b => b.level === level)
  const next = sorted.find(b => b.level === level + 1)

  const floor = current?.minXp ?? defaultMinXp(level)
  const ceiling = next?.minXp ?? floor + 500
  const span = Math.max(1, ceiling - floor)
  const into = Math.max(0, xp - floor)

  return {
    level,
    currentXp: Math.min(into, span),
    neededXp: span,
    percent: Math.min(100, Math.round((into / span) * 100)),
    title: current?.title ?? null,
  }
}

/** Percentage used by streak widgets; caps at 100. */
export function streakProgressPercent(current: number, target: number): number {
  if (target <= 0) return 0
  return Math.min(100, Math.round((current / target) * 100))
}
