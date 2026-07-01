import { Puzzle } from './types';
import { DAILY_PUZZLES } from '../data/puzzles';

/** Epoch day 0 for Pandle daily numbering: 2025-01-01 (UTC). */
const EPOCH = Date.UTC(2025, 0, 1);
const DAY_MS = 24 * 60 * 60 * 1000;

/** Local calendar date as YYYY-MM-DD (used for storage keys). */
export function dateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Whole days since the Pandle epoch for the given local date. */
export function daysSinceEpoch(date: Date = new Date()): number {
  const local = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor((local - EPOCH) / DAY_MS);
}

/** Human-facing daily puzzle number (starts at #1). */
export function puzzleNumber(date: Date = new Date()): number {
  return daysSinceEpoch(date) + 1;
}

/**
 * Deterministic daily puzzle: everyone with the same local date gets the same
 * puzzle, and reloads are stable. Cycles through the curated daily list.
 */
export function getDailyPuzzle(date: Date = new Date()): Puzzle {
  const idx = ((daysSinceEpoch(date) % DAILY_PUZZLES.length) + DAILY_PUZZLES.length) %
    DAILY_PUZZLES.length;
  return DAILY_PUZZLES[idx];
}
