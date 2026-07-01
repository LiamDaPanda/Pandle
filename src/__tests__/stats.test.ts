import { describe, it, expect } from 'vitest';
import { applyDailyWin, dayDiff, DEFAULT_STATS } from '../state/stats';

describe('dayDiff', () => {
  it('counts consecutive days', () => {
    expect(dayDiff('2025-06-01', '2025-06-02')).toBe(1);
  });
  it('counts across a month boundary', () => {
    expect(dayDiff('2025-01-31', '2025-02-01')).toBe(1);
  });
});

describe('applyDailyWin', () => {
  it('starts a streak at 1', () => {
    const s = applyDailyWin(DEFAULT_STATS, 30000, '2025-06-01');
    expect(s.streak).toBe(1);
    expect(s.wins).toBe(1);
    expect(s.bestTimeMs).toBe(30000);
  });
  it('increments on the next day', () => {
    let s = applyDailyWin(DEFAULT_STATS, 30000, '2025-06-01');
    s = applyDailyWin(s, 20000, '2025-06-02');
    expect(s.streak).toBe(2);
    expect(s.maxStreak).toBe(2);
    expect(s.bestTimeMs).toBe(20000);
  });
  it('resets after a missed day', () => {
    let s = applyDailyWin(DEFAULT_STATS, 30000, '2025-06-01');
    s = applyDailyWin(s, 30000, '2025-06-03');
    expect(s.streak).toBe(1);
    expect(s.maxStreak).toBe(1);
  });
  it('does not double-count the same day', () => {
    let s = applyDailyWin(DEFAULT_STATS, 30000, '2025-06-01');
    s = applyDailyWin(s, 10000, '2025-06-01');
    expect(s.streak).toBe(1);
    expect(s.wins).toBe(1);
  });
});
