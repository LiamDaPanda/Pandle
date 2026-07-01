import { describe, it, expect } from 'vitest';
import { runLengths, deriveClues } from '../game/clues';
import { Puzzle } from '../game/types';

describe('runLengths', () => {
  it('handles empty line', () => {
    expect(runLengths([false, false, false])).toEqual([0]);
  });
  it('handles a full line', () => {
    expect(runLengths([true, true, true])).toEqual([3]);
  });
  it('handles multiple runs', () => {
    expect(runLengths([true, false, true, true, false, true])).toEqual([1, 2, 1]);
  });
  it('handles trailing run', () => {
    expect(runLengths([false, true, true])).toEqual([2]);
  });
});

describe('deriveClues', () => {
  const puzzle: Puzzle = {
    id: 't', name: 'T', icon: 'panda', difficulty: 'easy',
    width: 3, height: 3,
    grid: ['K.K', '.K.', 'K.K'],
  };
  it('derives row and column clues', () => {
    const clues = deriveClues(puzzle);
    expect(clues.rows).toEqual([[1, 1], [1], [1, 1]]);
    expect(clues.cols).toEqual([[1, 1], [1], [1, 1]]);
  });
});
