import { describe, it, expect } from 'vitest';
import { buildShareText, formatTime, emojiMosaic } from '../game/share';
import { Puzzle } from '../game/types';

const puzzle: Puzzle = {
  id: 'p', name: 'Baby Panda', emoji: '🐼', difficulty: 'easy',
  width: 4, height: 4, grid: ['KK..', 'KK..', '..KK', '..KK'],
};

describe('formatTime', () => {
  it('formats minutes and seconds', () => {
    expect(formatTime(272000)).toBe('4:32');
    expect(formatTime(5000)).toBe('0:05');
  });
});

describe('emojiMosaic', () => {
  it('produces one row per grid row for small grids', () => {
    const mosaic = emojiMosaic(puzzle);
    expect(mosaic.split('\n')).toHaveLength(4);
  });
});

describe('buildShareText', () => {
  it('includes daily number, name, time and streak', () => {
    const text = buildShareText({
      puzzle, puzzleNumber: 123, timeMs: 272000, streak: 5, mode: 'daily',
    });
    expect(text).toContain('Pandle #123');
    expect(text).toContain('Baby Panda');
    expect(text).toContain('4:32');
    expect(text).toContain('🔥5');
  });
});
