import { describe, it, expect } from 'vitest';
import { ALL_PUZZLES } from '../data/puzzles';
import { validateNoGuess } from '../game/solver';
import { toBoolGrid } from '../game/clues';

describe('every shipped puzzle is solvable by logic alone (no guessing)', () => {
  for (const puzzle of ALL_PUZZLES) {
    it(`${puzzle.id} (${puzzle.name}) is no-guess solvable`, () => {
      expect(validateNoGuess(puzzle)).toBe(true);
    });

    it(`${puzzle.id} has consistent dimensions`, () => {
      expect(puzzle.grid).toHaveLength(puzzle.height);
      const solution = toBoolGrid(puzzle);
      expect(solution.every((r) => r.length === puzzle.width)).toBe(true);
      for (const row of puzzle.grid) {
        expect(row.length).toBe(puzzle.width);
      }
    });
  }
});
