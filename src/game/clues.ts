import { Clues, Puzzle, isFilledChar } from './types';

/** Lengths of consecutive filled runs in a boolean line. Empty line -> [0]. */
export function runLengths(line: boolean[]): number[] {
  const runs: number[] = [];
  let count = 0;
  for (const filled of line) {
    if (filled) {
      count++;
    } else if (count > 0) {
      runs.push(count);
      count = 0;
    }
  }
  if (count > 0) runs.push(count);
  return runs.length ? runs : [0];
}

/** Convert a puzzle's character grid into a boolean solution grid. */
export function toBoolGrid(puzzle: Puzzle): boolean[][] {
  return puzzle.grid.map((row) => {
    const cells: boolean[] = [];
    for (let x = 0; x < puzzle.width; x++) {
      cells.push(isFilledChar(row[x] ?? '.'));
    }
    return cells;
  });
}

/** Derive row and column clues from a puzzle's solution. */
export function deriveClues(puzzle: Puzzle): Clues {
  const solution = toBoolGrid(puzzle);
  const rows = solution.map((row) => runLengths(row));
  const cols: number[][] = [];
  for (let x = 0; x < puzzle.width; x++) {
    const col = solution.map((row) => row[x]);
    cols.push(runLengths(col));
  }
  return { rows, cols };
}
