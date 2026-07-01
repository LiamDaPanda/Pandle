import { puzzleById } from './puzzles';

export interface Level {
  id: string;
  puzzleId: string;
  /** Target time (ms) for 3 stars; 2 stars at 2x, 1 star for finishing. */
  targetMs: number;
  rewardBamboo: number;
}

export interface Chapter {
  id: string;
  name: string;
  emoji: string;
  levels: Level[];
}

export const CHAPTERS: Chapter[] = [
  {
    id: 'bamboo-forest',
    name: 'Bamboo Forest',
    emoji: '🎋',
    levels: [
      { id: 'bf-1', puzzleId: 'bamboo', targetMs: 60000, rewardBamboo: 10 },
      { id: 'bf-2', puzzleId: 'leaf', targetMs: 60000, rewardBamboo: 10 },
      { id: 'bf-3', puzzleId: 'baby-panda', targetMs: 75000, rewardBamboo: 15 },
      { id: 'bf-4', puzzleId: 'rice-ball', targetMs: 75000, rewardBamboo: 15 },
      { id: 'bf-5', puzzleId: 'panda-love', targetMs: 90000, rewardBamboo: 20 },
    ],
  },
  {
    id: 'snowy-peaks',
    name: 'Snowy Peaks',
    emoji: '🏔️',
    levels: [
      { id: 'sp-1', puzzleId: 'happy-cloud', targetMs: 90000, rewardBamboo: 20 },
      { id: 'sp-2', puzzleId: 'panda-face', targetMs: 180000, rewardBamboo: 30 },
      { id: 'sp-3', puzzleId: 'sleepy-panda', targetMs: 180000, rewardBamboo: 30 },
      { id: 'sp-4', puzzleId: 'panda-heart', targetMs: 210000, rewardBamboo: 35 },
      { id: 'sp-5', puzzleId: 'bamboo-stalk', targetMs: 240000, rewardBamboo: 40 },
    ],
  },
];

/** Flat ordered list of levels across all chapters. */
export const ALL_LEVELS: Level[] = CHAPTERS.flatMap((c) => c.levels);

export function levelIndex(levelId: string): number {
  return ALL_LEVELS.findIndex((l) => l.id === levelId);
}

export function levelById(levelId: string): Level | undefined {
  return ALL_LEVELS.find((l) => l.id === levelId);
}

/** Star rating (1-3) for finishing a level in the given time. */
export function starsForTime(level: Level, timeMs: number): number {
  if (timeMs <= level.targetMs) return 3;
  if (timeMs <= level.targetMs * 2) return 2;
  return 1;
}

/** Convenience: does the level's puzzle exist? (guards typos in content) */
export function levelPuzzleExists(level: Level): boolean {
  return puzzleById(level.puzzleId) !== undefined;
}
