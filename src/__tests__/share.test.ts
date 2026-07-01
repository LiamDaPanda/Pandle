import { describe, it, expect } from 'vitest';
import { buildShareText, formatTime, mosaic } from '../game/share';
import { Puzzle } from '../game/types';

const puzzle: Puzzle = {
  id: 'p', name: 'Baby Panda', icon: 'panda', difficulty: 'easy',
  width: 4, height: 4, grid: ['KK..', 'KK..', '..KK', '..KK'],
};

describe('formatTime', () => {
  it('formats minutes and seconds', () => {
    expect(formatTime(272000)).toBe('4:32');
    expect(formatTime(5000)).toBe('0:05');
  });
});

describe('mosaic', () => {
  it('produces one row per grid row for small grids', () => {
    expect(mosaic(puzzle).split('\n')).toHaveLength(4);
  });
  it('uses non-emoji block glyphs', () => {
    const m = mosaic(puzzle);
    expect(m).toMatch(/^[█·\n]+$/);
  });
});

describe('buildShareText', () => {
  it('includes daily number, name, time and streak, without emojis', () => {
    const text = buildShareText({
      puzzle, puzzleNumber: 123, timeMs: 272000, streak: 5, mode: 'daily',
    });
    expect(text).toContain('Pandle #123');
    expect(text).toContain('Baby Panda');
    expect(text).toContain('4:32');
    expect(text).toContain('Streak 5');
    // no emoji characters
    expect(text).not.toMatch(/\p{Extended_Pictographic}/u);
  });
});
