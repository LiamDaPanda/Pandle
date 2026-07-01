import type { IconName } from '../components/Icon';
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
  icon: IconName;
  levels: Level[];
}

export const CHAPTERS: Chapter[] = [
  {
    id: 'bamboo-forest',
    name: 'Bamboo Forest',
    icon: 'bamboo',
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
    icon: 'mountain',
    levels: [
      { id: 'sp-1', puzzleId: 'happy-cloud', targetMs: 90000, rewardBamboo: 20 },
      { id: 'sp-2', puzzleId: 'panda-face', targetMs: 180000, rewardBamboo: 30 },
      { id: 'sp-3', puzzleId: 'sleepy-panda', targetMs: 180000, rewardBamboo: 30 },
      { id: 'sp-4', puzzleId: 'panda-heart', targetMs: 210000, rewardBamboo: 35 },
      { id: 'sp-5', puzzleId: 'bamboo-stalk', targetMs: 240000, rewardBamboo: 40 },
    ],
  },
  {
    id: 'panda-party',
    name: 'Panda Party',
    icon: 'party',
    levels: [
      { id: 'pp-1', puzzleId: 'panda-egg', targetMs: 60000, rewardBamboo: 20 },
      { id: 'pp-2', puzzleId: 'plus-leaf', targetMs: 60000, rewardBamboo: 20 },
      { id: 'pp-3', puzzleId: 'gift-box', targetMs: 75000, rewardBamboo: 25 },
      { id: 'pp-4', puzzleId: 'bamboo-gem', targetMs: 75000, rewardBamboo: 25 },
      { id: 'pp-5', puzzleId: 'panda-hug', targetMs: 210000, rewardBamboo: 45 },
      { id: 'pp-6', puzzleId: 'crown', targetMs: 240000, rewardBamboo: 50 },
    ],
  },
  {
    id: 'sakura-garden',
    name: 'Sakura Garden',
    icon: 'sakura',
    levels: [
      { id: 'sg-1', puzzleId: 'twinkle', targetMs: 60000, rewardBamboo: 15 },
      { id: 'sg-2', puzzleId: 'window', targetMs: 60000, rewardBamboo: 15 },
      { id: 'sg-3', puzzleId: 'sunflower', targetMs: 60000, rewardBamboo: 15 },
      { id: 'sg-4', puzzleId: 'ruby-heart', targetMs: 75000, rewardBamboo: 20 },
      { id: 'sg-5', puzzleId: 'crescent', targetMs: 75000, rewardBamboo: 20 },
      { id: 'sg-6', puzzleId: 'pine', targetMs: 75000, rewardBamboo: 20 },
    ],
  },
  {
    id: 'panda-village',
    name: 'Panda Village',
    icon: 'house',
    levels: [
      { id: 'pv-1', puzzleId: 'big-gem', targetMs: 180000, rewardBamboo: 30 },
      { id: 'pv-2', puzzleId: 'bush', targetMs: 180000, rewardBamboo: 30 },
      { id: 'pv-3', puzzleId: 'big-gift', targetMs: 180000, rewardBamboo: 30 },
      { id: 'pv-4', puzzleId: 'ghost', targetMs: 210000, rewardBamboo: 35 },
      { id: 'pv-5', puzzleId: 'kitty', targetMs: 210000, rewardBamboo: 35 },
    ],
  },
  {
    id: 'misty-lake',
    name: 'Misty Lake',
    icon: 'cloud',
    levels: [
      { id: 'ml-1', puzzleId: 'big-ruby', targetMs: 210000, rewardBamboo: 40 },
      { id: 'ml-2', puzzleId: 'blossom', targetMs: 240000, rewardBamboo: 40 },
      { id: 'ml-3', puzzleId: 'snowball', targetMs: 240000, rewardBamboo: 40 },
      { id: 'ml-4', puzzleId: 'house', targetMs: 240000, rewardBamboo: 45 },
    ],
  },
  {
    id: 'golden-summit',
    name: 'Golden Summit',
    icon: 'crown',
    levels: [
      { id: 'gs-1', puzzleId: 'compass', targetMs: 240000, rewardBamboo: 45 },
      { id: 'gs-2', puzzleId: 'grand-panda', targetMs: 240000, rewardBamboo: 50 },
      { id: 'gs-3', puzzleId: 'duck', targetMs: 240000, rewardBamboo: 50 },
      { id: 'gs-4', puzzleId: 'starfish', targetMs: 90000, rewardBamboo: 55 },
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
