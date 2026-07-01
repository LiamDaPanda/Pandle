import { load, save } from './storage';
import { ALL_LEVELS, Level, levelIndex, starsForTime } from '../data/levels';
import { DEFAULT_EQUIPPED, cosmeticById, defaultOwned } from '../data/cosmetics';

export interface Progress {
  /** levelId -> best star rating earned (1-3). */
  stars: Record<string, number>;
  bamboo: number;
  ownedCosmetics: string[];
  equipped: { theme: string; effect: string; skin: string };
  /** Event ids whose reward has been claimed. */
  claimedEvents: string[];
}

export function defaultProgress(): Progress {
  return {
    stars: {},
    bamboo: 25,
    ownedCosmetics: defaultOwned(),
    equipped: { ...DEFAULT_EQUIPPED },
    claimedEvents: [],
  };
}

export function loadProgress(): Progress {
  return load<Progress>('progress', defaultProgress());
}

export function saveProgress(p: Progress): void {
  save('progress', p);
}

/** A level is unlocked if it is the first level or the previous one is starred. */
export function isLevelUnlocked(p: Progress, levelId: string): boolean {
  const idx = levelIndex(levelId);
  if (idx <= 0) return true;
  const prev = ALL_LEVELS[idx - 1];
  return (p.stars[prev.id] ?? 0) > 0;
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
