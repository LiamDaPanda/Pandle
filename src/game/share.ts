import { Puzzle, isFilledChar } from './types';

export interface ShareResult {
  puzzle: Puzzle;
  puzzleNumber?: number;
  timeMs: number;
  streak?: number;
  mode: 'daily' | 'level' | 'event' | 'practice';
}

/** Format milliseconds as m:ss. */
export function formatTime(ms: number): string {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/**
 * Downscale the solved art into a small emoji mosaic (max 8 wide) so the share
 * text carries a recognizable peek of the panda without spoiling the grid.
 */
export function mosaic(puzzle: Puzzle, maxWidth = 10): string {
  const scale = Math.max(1, Math.ceil(puzzle.width / maxWidth));
  const lines: string[] = [];
  for (let y = 0; y < puzzle.height; y += scale) {
    let line = '';
    for (let x = 0; x < puzzle.width; x += scale) {
      let filled = 0;
      let total = 0;
      for (let dy = 0; dy < scale && y + dy < puzzle.height; dy++) {
        for (let dx = 0; dx < scale && x + dx < puzzle.width; dx++) {
          total++;
          if (isFilledChar(puzzle.grid[y + dy][x + dx] ?? '.')) filled++;
        }
      }
      line += filled * 2 >= total ? '█' : '·';
    }
    lines.push(line);
  }
  return lines.join('\n');
}

/** Wordle-style shareable summary text (no emojis). */
export function buildShareText(result: ShareResult): string {
  const { puzzle, puzzleNumber, timeMs, streak, mode } = result;
  const header =
    mode === 'daily' && puzzleNumber
      ? `Pandle #${puzzleNumber} — ${puzzle.name}`
      : `Pandle — ${puzzle.name}`;
  const bits = [formatTime(timeMs)];
  if (streak && streak > 0) bits.push(`Streak ${streak}`);
  return `${header}\n${bits.join('  ·  ')}\n${mosaic(puzzle)}\nplay Pandle`;
}

/** Copy text to clipboard; resolves false if unavailable. */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through */
  }
  return false;
}
