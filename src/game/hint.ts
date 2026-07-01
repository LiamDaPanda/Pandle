import { CellMark, Clues } from './types';
import { solveLine, solveLogically, Tri } from './solver';

export interface Hint {
  x: number;
  y: number;
  mark: 'filled' | 'crossed';
  /** 'fix' = corrects a wrong mark; 'deduce' = a forced next move. */
  reason: 'fix' | 'deduce';
}

function marksToKnown(line: CellMark[]): Tri[] {
  return line.map((m) => (m === 'filled' ? true : m === 'crossed' ? false : null));
}

/**
 * Suggest the next helpful cell:
 *  1. If a mark contradicts the unique solution, point that out (a fix).
 *  2. Otherwise reveal a cell that is *forced* by line logic from the current
 *     board — a move the player could deduce right now.
 *  3. Fallback: any still-empty solution cell.
 * Returns null only when the board is already solved.
 */
export function computeHint(marks: CellMark[][], clues: Clues): Hint | null {
  const solution = solveLogically(clues).grid; // unique for our puzzles
  const height = clues.rows.length;
  const width = clues.cols.length;

  // 1. Fix a contradiction with the solution.
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const sol = solution[y][x] === true;
      if (marks[y][x] === 'filled' && !sol) return { x, y, mark: 'crossed', reason: 'fix' };
      if (marks[y][x] === 'crossed' && sol) return { x, y, mark: 'filled', reason: 'fix' };
    }
  }

  // 2. A forced move from the current (consistent) marks.
  const forced = (): Hint | null => {
    for (let y = 0; y < height; y++) {
      const solved = solveLine(clues.rows[y], marksToKnown(marks[y]));
      if (!solved) continue;
      for (let x = 0; x < width; x++) {
        if (marks[y][x] === 'empty' && solved[x] !== null) {
          return { x, y, mark: solved[x] ? 'filled' : 'crossed', reason: 'deduce' };
        }
      }
    }
    for (let x = 0; x < width; x++) {
      const col = marks.map((row) => row[x]);
      const solved = solveLine(clues.cols[x], marksToKnown(col));
      if (!solved) continue;
      for (let y = 0; y < height; y++) {
        if (marks[y][x] === 'empty' && solved[y] !== null) {
          return { x, y, mark: solved[y] ? 'filled' : 'crossed', reason: 'deduce' };
        }
      }
    }
    return null;
  };
  const deduced = forced();
  if (deduced) return deduced;

  // 3. Fallback: fill any empty solution cell / cross any empty non-solution cell.
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (marks[y][x] === 'empty') {
        return { x, y, mark: solution[y][x] ? 'filled' : 'crossed', reason: 'deduce' };
      }
    }
  }
  return null;
}
