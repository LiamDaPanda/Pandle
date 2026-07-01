import { describe, it, expect } from 'vitest';
import { isSolved, isLineSatisfied, emptyBoard } from '../game/solve';
import { deriveClues } from '../game/clues';
import { CellMark, Puzzle } from '../game/types';
import { toBoolGrid } from '../game/clues';

const puzzle: Puzzle = {
  id: 'p', name: 'P', icon: 'panda', difficulty: 'easy',
  width: 3, height: 3, grid: ['KKK', 'K.K', 'KKK'],
};

function marksFromSolution(p: Puzzle): CellMark[][] {
  return toBoolGrid(p).map((row) => row.map((f): CellMark => (f ? 'filled' : 'crossed')));
}

describe('isLineSatisfied', () => {
  it('matches a satisfied line', () => {
    expect(isLineSatisfied(['filled', 'empty', 'filled'], [1, 1])).toBe(true);
  });
  it('rejects a mismatched line', () => {
    expect(isLineSatisfied(['filled', 'filled', 'empty'], [1, 1])).toBe(false);
  });
});

describe('isSolved', () => {
  const clues = deriveClues(puzzle);
  it('is true for the correct solution', () => {
    expect(isSolved(marksFromSolution(puzzle), clues)).toBe(true);
  });
  it('is false for an empty board', () => {
    expect(isSolved(emptyBoard(3, 3), clues)).toBe(false);
  });
  it('is false when one cell is wrong', () => {
    const marks = marksFromSolution(puzzle);
    marks[1][1] = 'filled';
    expect(isSolved(marks, clues)).toBe(false);
  });
});
