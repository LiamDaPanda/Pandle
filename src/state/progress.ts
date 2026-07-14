import { load, save } from './storage';
import { ALL_LEVELS, CHAPTERS, Chapter, Level, chapterOfLevel, levelIndex, starsForTime } from '../data/levels';
import { DEFAULT_EQUIPPED, cosmeticById, defaultOwned } from '../data/cosmetics';
import { EVENTS, GameEvent } from '../data/events';
import { MILESTONES, Milestone } from '../data/milestones';
import type { Stats } from './stats';

export interface Progress {
  /** levelId -> best star rating earned (1-3). */
  stars: Record<string, number>;
  bamboo: number;
  ownedCosmetics: string[];
  equipped: { theme: string; effect: string; skin: string };
  /** Event ids whose reward has been claimed. */
  claimedEvents: string[];
  /** Ids of every puzzle the player has ever solved. */
  solvedPuzzles: string[];
  /** Milestone ids whose bamboo reward has been granted. */
  claimedMilestones: string[];
  /** Chapter ids whose clear bonus has been granted. */
  claimedChapters: string[];
  /** Lucky Capsule pulls since the last cosmetic drop (pity counter). */
  gachaPity: number;
}

export function defaultProgress(): Progress {
  return {
    stars: {},
    bamboo: 25,
    ownedCosmetics: defaultOwned(),
    equipped: { ...DEFAULT_EQUIPPED },
    claimedEvents: [],
    solvedPuzzles: [],
    claimedMilestones: [],
    claimedChapters: [],
    gachaPity: 0,
  };
}

export function loadProgress(): Progress {
  return load<Progress>('progress', defaultProgress());
}

export function saveProgress(p: Progress): void {
  save('progress', p);
}

/**
 * A level is unlocked if it is the first level or the previous one is starred.
 * The first level of a chapter also opens once all but two of the previous
 * chapter's levels are cleared, so one tricky puzzle never blocks the whole
 * adventure.
 */
export function isLevelUnlocked(p: Progress, levelId: string): boolean {
  const idx = levelIndex(levelId);
  if (idx <= 0) return true;
  const prev = ALL_LEVELS[idx - 1];
  if ((p.stars[prev.id] ?? 0) > 0) return true;

  const chapter = chapterOfLevel(levelId);
  if (chapter && chapter.levels[0]?.id === levelId) {
    const prevChapter = CHAPTERS[CHAPTERS.indexOf(chapter) - 1];
    if (prevChapter) {
      const cleared = prevChapter.levels.filter((l) => (p.stars[l.id] ?? 0) > 0).length;
      return cleared >= Math.max(1, prevChapter.levels.length - 2);
    }
  }
  return false;
}

/**
 * Record a level completion. Awards bamboo the first time it reaches a new best
 * star count, keeps the best rating, and returns the updated progress + stars
 * earned this run.
 */
export function completeLevel(
  p: Progress,
  level: Level,
  timeMs: number,
): { progress: Progress; stars: number; bambooEarned: number; firstClear: boolean } {
  const stars = starsForTime(level, timeMs);
  const prevStars = p.stars[level.id] ?? 0;
  const firstClear = prevStars === 0;

  // Reward bamboo once per level, plus a small bonus for each new star gained.
  let bambooEarned = 0;
  if (firstClear) bambooEarned += level.rewardBamboo;
  if (stars > prevStars) bambooEarned += (stars - prevStars) * 5;

  const progress: Progress = {
    ...p,
    stars: { ...p.stars, [level.id]: Math.max(prevStars, stars) },
    bamboo: p.bamboo + bambooEarned,
  };
  return { progress, stars, bambooEarned, firstClear };
}

/** Buy a cosmetic if affordable and not owned. Returns updated progress or null. */
export function buyCosmetic(p: Progress, cosmeticId: string): Progress | null {
  const cosmetic = cosmeticById(cosmeticId);
  if (!cosmetic) return null;
  if (p.ownedCosmetics.includes(cosmeticId)) return null;
  if (p.bamboo < cosmetic.cost) return null;
  return {
    ...p,
    bamboo: p.bamboo - cosmetic.cost,
    ownedCosmetics: [...p.ownedCosmetics, cosmeticId],
  };
}

/** Equip an owned cosmetic into its slot. */
export function equipCosmetic(p: Progress, cosmeticId: string): Progress {
  const cosmetic = cosmeticById(cosmeticId);
  if (!cosmetic || !p.ownedCosmetics.includes(cosmeticId)) return p;
  return { ...p, equipped: { ...p.equipped, [cosmetic.kind]: cosmeticId } };
}

/** Grant event reward cosmetics once. */
export function claimEventRewards(p: Progress, eventId: string, cosmeticIds: string[]): Progress {
  if (p.claimedEvents.includes(eventId)) return p;
  const newOwned = cosmeticIds.filter((id) => !p.ownedCosmetics.includes(id));
  return {
    ...p,
    ownedCosmetics: [...p.ownedCosmetics, ...newOwned],
    claimedEvents: [...p.claimedEvents, eventId],
  };
}

export function totalStars(p: Progress): number {
  return Object.values(p.stars).reduce((a, b) => a + b, 0);
}

/** Per-event completion progress. */
export function eventProgress(
  p: Progress,
  event: GameEvent,
): { done: number; total: number; complete: boolean } {
  const done = event.puzzleIds.filter((id) => p.solvedPuzzles.includes(id)).length;
  const total = event.puzzleIds.length;
  return { done, total, complete: total > 0 && done === total };
}

export const CHAPTER_CLEAR_BONUS = 40;

/**
 * Grant the one-time bamboo bonus for every newly fully-cleared chapter.
 * Idempotent: already-claimed chapters are skipped.
 */
export function claimChapterBonuses(p: Progress): { progress: Progress; cleared: Chapter[] } {
  const cleared = CHAPTERS.filter(
    (c) =>
      !p.claimedChapters.includes(c.id) &&
      c.levels.every((l) => (p.stars[l.id] ?? 0) > 0),
  );
  if (cleared.length === 0) return { progress: p, cleared };
  return {
    progress: {
      ...p,
      bamboo: p.bamboo + cleared.length * CHAPTER_CLEAR_BONUS,
      claimedChapters: [...p.claimedChapters, ...cleared.map((c) => c.id)],
    },
    cleared,
  };
}

/**
 * Grant the bamboo reward of every milestone that is now reached but not yet
 * claimed. Idempotent.
 */
export function claimMilestones(p: Progress, stats: Stats): { progress: Progress; earned: Milestone[] } {
  const earned = MILESTONES.filter(
    (m) => !p.claimedMilestones.includes(m.id) && m.measure(p, stats) >= m.target,
  );
  if (earned.length === 0) return { progress: p, earned };
  return {
    progress: {
      ...p,
      bamboo: p.bamboo + earned.reduce((sum, m) => sum + m.reward, 0),
      claimedMilestones: [...p.claimedMilestones, ...earned.map((m) => m.id)],
    },
    earned,
  };
}

/**
 * Record a solved puzzle, then auto-claim the rewards of any event whose whole
 * puzzle set is now complete. Idempotent.
 */
export function markSolved(p: Progress, puzzleId: string): Progress {
  let next = p.solvedPuzzles.includes(puzzleId)
    ? p
    : { ...p, solvedPuzzles: [...p.solvedPuzzles, puzzleId] };
  for (const event of EVENTS) {
    if (next.claimedEvents.includes(event.id)) continue;
    if (eventProgress(next, event).complete) {
      next = claimEventRewards(next, event.id, event.rewardCosmetics);
    }
  }
  return next;
}
