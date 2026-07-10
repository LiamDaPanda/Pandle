import { dateKey } from '../game/daily';
import { load, save } from './storage';

export interface Stats {
  streak: number;
  maxStreak: number;
  played: number;
  wins: number;
  bestTimeMs: number | null;
  lastDailyDate: string | null;
}

export const DEFAULT_STATS: Stats = {
  streak: 0,
  maxStreak: 0,
  played: 0,
  wins: 0,
  bestTimeMs: null,
  lastDailyDate: null,
};

/** Difference in whole days between two YYYY-MM-DD keys. */
export function dayDiff(fromKey: string, toKey: string): number {
  const [fy, fm, fd] = fromKey.split('-').map(Number);
  const [ty, tm, td] = toKey.split('-').map(Number);
  const from = Date.UTC(fy, fm - 1, fd);
  const to = Date.UTC(ty, tm - 1, td);
  return Math.round((to - from) / (24 * 60 * 60 * 1000));
}

/**
 * Pure streak transition when a daily puzzle is solved on `todayKey`:
 *  - same day already recorded -> unchanged (no double count)
 *  - exactly the next day      -> streak + 1
 *  - any other gap             -> reset to 1
 */
export function applyDailyWin(stats: Stats, timeMs: number, todayKey: string): Stats {
  if (stats.lastDailyDate === todayKey) return stats;

  let streak: number;
  if (stats.lastDailyDate && dayDiff(stats.lastDailyDate, todayKey) === 1) {
    streak = stats.streak + 1;
  } else {
    streak = 1;
  }

  return {
    streak,
    maxStreak: Math.max(stats.maxStreak, streak),
    played: stats.played + 1,
    wins: stats.wins + 1,
    bestTimeMs: stats.bestTimeMs == null ? timeMs : Math.min(stats.bestTimeMs, timeMs),
    lastDailyDate: todayKey,
  };
}

/**
 * Bamboo earned for a daily solve: a base amount plus a streak bonus, capped
 * so long streaks stay rewarding without breaking the economy.
 */
export function dailyReward(streak: number): number {
  return 12 + 2 * Math.min(Math.max(streak, 0), 12);
}

export function loadStats(): Stats {
  return load<Stats>('stats', DEFAULT_STATS);
}

export function saveStats(stats: Stats): void {
  save('stats', stats);
}

/** Record a daily win and persist. Returns the updated stats. */
export function recordDailyWin(timeMs: number, date = new Date()): Stats {
  const next = applyDailyWin(loadStats(), timeMs, dateKey(date));
  saveStats(next);
  return next;
}
