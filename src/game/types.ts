import type { IconName } from '../components/Icon';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

/**
 * A puzzle is stored as a compact character grid.
 * '.' means an empty cell. Any other character means a filled cell, and that
 * character is a key into PALETTE used only for the colored reveal — the
 * picross logic itself only cares about filled vs. empty.
 */
export interface Puzzle {
  id: string;
  name: string;
  icon: IconName;
  difficulty: Difficulty;
  width: number;
  height: number;
  grid: string[];
  /** Event-exclusive puzzles are kept out of the daily & practice pools. */
  event?: boolean;
}

/** Maps a grid character to a CSS color used when revealing the finished art. */
export const PALETTE: Record<string, string> = {
  K: '#2b2b2b', // panda black
  W: '#f7f7f7', // panda white
  G: '#7bc47f', // bamboo green
  D: '#4f9d54', // dark bamboo
  P: '#ffb7c5', // blush pink
  Y: '#ffd66b', // sunny yellow
  B: '#8ecae6', // sky blue
  N: '#c98a5e', // nose / brown
  O: '#f0913e', // orange
  R: '#e8615a', // red
  S: '#b8bfc7', // slate / grey
  U: '#a78bfa', // purple
};

export const EMPTY = '.';

/** Runtime state of a single cell as the player marks the board. */
export type CellMark = 'empty' | 'filled' | 'crossed';

export interface Clues {
  rows: number[][];
  cols: number[][];
}

/** True when the character represents a filled solution cell. */
export function isFilledChar(ch: string): boolean {
  return ch !== EMPTY && ch.length > 0;
}
