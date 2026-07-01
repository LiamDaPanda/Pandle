import { describe, it, expect } from 'vitest';
import { computeHint } from '../game/hint';
import { deriveClues } from '../game/clues';
import { emptyBoard } from '../game/solve';
import { CellMark, Puzzle } from '../game/types';

const puzzle: Puzzle = {
  id: 'ring', name: 'Ring', emoji: '🐼', difficulty: 'easy',
  width: 3, height: 3, grid: ['KKK', 'K.K', 'KKK'],
};
const clues = deriveClues(puzzle);

describe('computeHint', () => {
  it('reveals a correct forced cell from an empty board', () => {
    const hint = computeHint(emptyBoard(3, 3), clues);
    expect(hint).not.toBeNull();
    // The centre (1,1) is the only empty solution cell; every other is filled.
    const shouldBeFilled = !(hint!.x === 1 && hint!.y === 1);
    expect(hint!.mark).toBe(shouldBeFilled ? 'filled' : 'crossed');
  });

  it('flags a contradicting mark as a fix', () => {
    const marks: CellMark[][] = emptyBoard(3, 3);
    marks[1][1] = 'filled'; // centre should be empty
    const hint = computeHint(marks, clues);
    expect(hint).toEqual({ x: 1, y: 1, mark: 'crossed', reason: 'fix' });
  });

  it('returns null when the board is already solved', () => {
    const marks: CellMark[][] = [
      ['filled', 'filled', 'filled'],
      ['filled', 'crossed', 'filled'],
      ['filled', 'filled', 'filled'],
    ];
    expect(computeHint(marks, clues)).toBeNull();
  });
});
