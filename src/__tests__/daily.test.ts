import { describe, it, expect } from 'vitest';
import { getDailyPuzzle, daysSinceEpoch, puzzleNumber, dateKey } from '../game/daily';

describe('daily puzzle', () => {
  it('is deterministic for the same date', () => {
    const a = getDailyPuzzle(new Date(2025, 5, 1));
    const b = getDailyPuzzle(new Date(2025, 5, 1));
    expect(a.id).toBe(b.id);
  });
  it('advances across consecutive days', () => {
    const d0 = new Date(2025, 0, 1);
    const d1 = new Date(2025, 0, 2);
    expect(daysSinceEpoch(d1) - daysSinceEpoch(d0)).toBe(1);
  });
  it('numbers the first day as #1', () => {
    expect(puzzleNumber(new Date(2025, 0, 1))).toBe(1);
  });
  it('builds a zero-padded date key', () => {
    expect(dateKey(new Date(2025, 2, 5))).toBe('2025-03-05');
  });
});
