import { describe, it, expect } from 'vitest';
import { solveLine, solveLogically, validateNoGuess } from '../game/solver';
import { deriveClues } from '../game/clues';
import { Puzzle } from '../game/types';

describe('solveLine', () => {
  it('forces the overlap of a long run', () => {
    // clue [3] in width 4 -> placements [XXX.] and [.XXX] overlap at 1 and 2
    const result = solveLine([3], [null, null, null, null]);
    expect(result).toEqual([null, true, true, null]);
  });
  it('fully determines a saturated line', () => {
    const result = solveLine([4], [null, null, null, null]);
    expect(result).toEqual([true, true, true, true]);
  });
  it('marks an empty line as all crossed', () => {
    const result = solveLine([0], [null, null, null]);
    expect(result).toEqual([false, false, false]);
  });
  it('returns null on contradiction', () => {
    // clue [3] cannot fit if a middle cell is known empty in width 3
    const result = solveLine([3], [null, false, null]);
    expect(result).toBeNull();
  });
});

describe('solveLogically', () => {
  it('solves a simple logic-only puzzle', () => {
    const puzzle: Puzzle = {
      id: 'x', name: 'X', emoji: '🐼', difficulty: 'easy',
      width: 3, height: 3, grid: ['KKK', 'K.K', 'KKK'],
    };
    const res = solveLogically(deriveClues(puzzle));
    expect(res.solved).toBe(true);
    expect(res.contradiction).toBe(false);
    expect(res.grid[1][1]).toBe(false);
  });
});

describe('validateNoGuess', () => {
  it('accepts a logic-solvable puzzle', () => {
    const good: Puzzle = {
      id: 'g', name: 'G', emoji: '🐼', difficulty: 'easy',
      width: 3, height: 3, grid: ['KKK', 'KKK', 'KKK'],
    };
    expect(validateNoGuess(good)).toBe(true);
  });
  it('rejects a puzzle that would require guessing', () => {
    // Classic 2x2 checkerboard: clues are ambiguous between two solutions.
    const ambiguous: Puzzle = {
      id: 'a', name: 'A', emoji: '🐼', difficulty: 'easy',
      width: 2, height: 2, grid: ['K.', '.K'],
    };
    expect(validateNoGuess(ambiguous)).toBe(false);
  });
});
