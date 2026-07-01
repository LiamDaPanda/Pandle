import { CellMark, Clues } from './types';
import { runLengths } from './clues';

/** True when a line of marks satisfies its clue (filled runs match exactly). */
export function isLineSatisfied(line: CellMark[], clue: number[]): boolean {
  const bools = line.map((m) => m === 'filled');
  const runs = runLengths(bools);
  if (runs.length !== clue.length) return false;
  return runs.every((r, i) => r === clue[i]);
}

/**
 * The board is solved when every row and column clue is satisfied — the true
 * nonogram win rule. Crossed/empty cells both count as "not filled".
 */
export function isSolved(marks: CellMark[][], clues: Clues): boolean {
  const height = clues.rows.length;
  const width = clues.cols.length;

  for (let y = 0; y < height; y++) {
    if (!isLineSatisfied(marks[y], clues.rows[y])) return false;
  }
  for (let x = 0; x < width; x++) {
    const col = marks.map((row) => row[x]);
    if (!isLineSatisfied(col, clues.cols[x])) return false;
  }
  return true;
}

/** Create a fresh board of the given size with every cell empty. */
export function emptyBoard(width: number, height: number): CellMark[][] {
  return Array.from({ length: height }, () =>
    new Array<CellMark>(width).fill('empty'),
  );
}
