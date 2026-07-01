import { Clues, Puzzle } from './types';
import { deriveClues, toBoolGrid } from './clues';

/** Tri-state cell used during logical solving: true=filled, false=empty, null=unknown. */
export type Tri = boolean | null;

/**
 * Solve a single line as far as pure logic allows.
 *
 * Enumerates every run placement consistent with the currently known cells,
 * then intersects them: a cell is forced only when every valid placement
 * agrees on it. Returns the (possibly still-partial) line, or `null` if the
 * clue cannot be satisfied given `known` (a contradiction).
 */
export function solveLine(clue: number[], known: Tri[]): Tri[] | null {
  const n = known.length;
  const runs = clue.length === 1 && clue[0] === 0 ? [] : clue;
  const placements: boolean[][] = [];
  const line = new Array<boolean>(n).fill(false);

  const consistent = (idx: number, val: boolean) => {
    const k = known[idx];
    return k === null || k === val;
  };

  const place = (runIdx: number, start: number): void => {
    if (runIdx === runs.length) {
      for (let i = start; i < n; i++) {
        if (!consistent(i, false)) return;
        line[i] = false;
      }
      placements.push(line.slice());
      return;
    }
    const len = runs[runIdx];
    const remaining = runs.slice(runIdx + 1);
    const minTail = remaining.reduce((a, b) => a + b + 1, 0);
    const lastStart = n - minTail - len;
    for (let s = start; s <= lastStart; s++) {
      let ok = true;
      for (let i = start; i < s; i++) {
        if (!consistent(i, false)) { ok = false; break; }
        line[i] = false;
      }
      if (!ok) continue;
      for (let i = s; i < s + len; i++) {
        if (!consistent(i, true)) { ok = false; break; }
        line[i] = true;
      }
      if (!ok) continue;
      let nextStart = s + len;
      if (runIdx < runs.length - 1) {
        if (!consistent(nextStart, false)) continue;
        line[nextStart] = false;
        nextStart += 1;
      }
      place(runIdx + 1, nextStart);
    }
  };

  place(0, 0);
  if (placements.length === 0) return null;

  const result: Tri[] = new Array<Tri>(n).fill(null);
  for (let i = 0; i < n; i++) {
    let allTrue = true;
    let allFalse = true;
    for (const p of placements) {
      if (p[i]) allFalse = false;
      else allTrue = false;
      if (!allTrue && !allFalse) break;
    }
    result[i] = allTrue ? true : allFalse ? false : null;
  }
  return result;
}

export interface SolveResult {
  grid: Tri[][];
  solved: boolean;        // fully determined by logic alone
  contradiction: boolean; // clues are inconsistent
}

/**
 * Solve a whole puzzle using only forced-move logic (line solving + constraint
 * propagation). Never guesses. If it stalls with unknown cells remaining, the
 * puzzle would require guessing and `solved` is false.
 */
export function solveLogically(clues: Clues): SolveResult {
  const height = clues.rows.length;
  const width = clues.cols.length;
  const grid: Tri[][] = Array.from({ length: height }, () =>
    new Array<Tri>(width).fill(null),
  );

  let changed = true;
  while (changed) {
    changed = false;

    for (let y = 0; y < height; y++) {
      const known = grid[y];
      const solved = solveLine(clues.rows[y], known);
      if (!solved) return { grid, solved: false, contradiction: true };
      for (let x = 0; x < width; x++) {
        if (solved[x] !== null && grid[y][x] !== solved[x]) {
          grid[y][x] = solved[x];
          changed = true;
        }
      }
    }

    for (let x = 0; x < width; x++) {
      const known = grid.map((row) => row[x]);
      const solved = solveLine(clues.cols[x], known);
      if (!solved) return { grid, solved: false, contradiction: true };
      for (let y = 0; y < height; y++) {
        if (solved[y] !== null && grid[y][x] !== solved[y]) {
          grid[y][x] = solved[y];
          changed = true;
        }
      }
    }
  }

  const solved = grid.every((row) => row.every((c) => c !== null));
  return { grid, solved, contradiction: false };
}

/**
 * A puzzle passes the no-guess gate when logic alone fully solves it AND the
 * unique logical solution matches the authored art. This is the guard every
 * shipped puzzle must satisfy.
 */
export function validateNoGuess(puzzle: Puzzle): boolean {
  const clues = deriveClues(puzzle);
  const result = solveLogically(clues);
  if (!result.solved || result.contradiction) return false;

  const solution = toBoolGrid(puzzle);
  for (let y = 0; y < puzzle.height; y++) {
    for (let x = 0; x < puzzle.width; x++) {
      if (result.grid[y][x] !== solution[y][x]) return false;
    }
  }
  return true;
}
