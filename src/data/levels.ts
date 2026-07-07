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
  /** Accent color used to tint the play background for this chapter. */
  tint: string;
  levels: Level[];
}

export const CHAPTERS: Chapter[] = [
  {
    id: 'bamboo-forest',
    name: 'Bamboo Forest',
    tint: '#7bc47f',
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
    tint: '#8ecae6',
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
    tint: '#ffb7c5',
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
    tint: '#ff9fb6',
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
    tint: '#f0913e',
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
    tint: '#a8d8ea',
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
    tint: '#ffd66b',
    icon: 'crown',
    levels: [
      { id: 'gs-1', puzzleId: 'compass', targetMs: 240000, rewardBamboo: 45 },
      { id: 'gs-2', puzzleId: 'grand-panda', targetMs: 240000, rewardBamboo: 50 },
      { id: 'gs-3', puzzleId: 'duck', targetMs: 240000, rewardBamboo: 50 },
      { id: 'gs-4', puzzleId: 'starfish', targetMs: 90000, rewardBamboo: 55 },
    ],
  },
  {
    id: 'crystal-cove',
    name: 'Crystal Cove',
    tint: '#a78bfa',
    icon: 'gem',
    levels: [
      { id: 'cc-1', puzzleId: 'water-drop', targetMs: 60000, rewardBamboo: 20 },
      { id: 'cc-2', puzzleId: 'tiny-sun', targetMs: 60000, rewardBamboo: 20 },
      { id: 'cc-3', puzzleId: 'red-gift', targetMs: 75000, rewardBamboo: 25 },
      { id: 'cc-4', puzzleId: 'green-heart', targetMs: 75000, rewardBamboo: 25 },
      { id: 'cc-5', puzzleId: 'amber-gem', targetMs: 75000, rewardBamboo: 25 },
    ],
  },
  {
    id: 'cloud-summit',
    name: 'Cloud Summit',
    tint: '#b8c6db',
    icon: 'cloud',
    levels: [
      { id: 'cs-1', puzzleId: 'moss-block', targetMs: 210000, rewardBamboo: 40 },
      { id: 'cs-2', puzzleId: 'rose-border', targetMs: 210000, rewardBamboo: 40 },
      { id: 'cs-3', puzzleId: 'silver-cross', targetMs: 240000, rewardBamboo: 45 },
      { id: 'cs-4', puzzleId: 'sky-fish', targetMs: 240000, rewardBamboo: 50 },
      { id: 'cs-5', puzzleId: 'aqua-diamond', targetMs: 240000, rewardBamboo: 50 },
    ],
  },
  {
    id: 'jewel-cavern',
    name: 'Jewel Cavern',
    tint: '#9b7ede',
    icon: 'gem',
    levels: [
      { id: 'jc-1', puzzleId: 'rose-crystal', targetMs: 60000, rewardBamboo: 20 },
      { id: 'jc-2', puzzleId: 'emerald', targetMs: 60000, rewardBamboo: 20 },
      { id: 'jc-3', puzzleId: 'grape-crystal', targetMs: 60000, rewardBamboo: 20 },
      { id: 'jc-4', puzzleId: 'big-emerald', targetMs: 200000, rewardBamboo: 40 },
      { id: 'jc-5', puzzleId: 'amethyst', targetMs: 200000, rewardBamboo: 40 },
      { id: 'jc-6', puzzleId: 'violet-heart', targetMs: 230000, rewardBamboo: 50 },
    ],
  },
  {
    id: 'sky-harbor',
    name: 'Sky Harbor',
    tint: '#6fb7e0',
    icon: 'cloud',
    levels: [
      { id: 'sh-1', puzzleId: 'sky-stone', targetMs: 60000, rewardBamboo: 20 },
      { id: 'sh-2', puzzleId: 'blue-plus', targetMs: 60000, rewardBamboo: 20 },
      { id: 'sh-3', puzzleId: 'blue-heart', targetMs: 75000, rewardBamboo: 25 },
      { id: 'sh-4', puzzleId: 'ice-frame', targetMs: 200000, rewardBamboo: 40 },
      { id: 'sh-5', puzzleId: 'blue-ghost', targetMs: 210000, rewardBamboo: 45 },
      { id: 'sh-6', puzzleId: 'ice-cube', targetMs: 230000, rewardBamboo: 50 },
    ],
  },
  {
    id: 'meadow-trail',
    name: 'Meadow Trail',
    tint: '#9ccc65',
    icon: 'tree',
    levels: [
      { id: 'mt-1', puzzleId: 'cocoa-egg', targetMs: 60000, rewardBamboo: 20 },
      { id: 'mt-2', puzzleId: 'gold-frame', targetMs: 75000, rewardBamboo: 25 },
      { id: 'mt-3', puzzleId: 'orange-sphere', targetMs: 200000, rewardBamboo: 40 },
      { id: 'mt-4', puzzleId: 'green-cross', targetMs: 220000, rewardBamboo: 45 },
      { id: 'mt-5', puzzleId: 'hedge', targetMs: 220000, rewardBamboo: 45 },
      { id: 'mt-6', puzzleId: 'topaz', targetMs: 230000, rewardBamboo: 50 },
    ],
  },
  {
    id: 'critter-cove',
    name: 'Critter Cove',
    tint: '#c98a5e',
    icon: 'cat',
    levels: [
      { id: 'cv-1', puzzleId: 'tabby', targetMs: 200000, rewardBamboo: 40 },
      { id: 'cv-2', puzzleId: 'white-duck', targetMs: 200000, rewardBamboo: 40 },
      { id: 'cv-3', puzzleId: 'green-fish', targetMs: 200000, rewardBamboo: 40 },
      { id: 'cv-4', puzzleId: 'pink-sphere', targetMs: 220000, rewardBamboo: 45 },
      { id: 'cv-5', puzzleId: 'sun-cross', targetMs: 230000, rewardBamboo: 50 },
      { id: 'cv-6', puzzleId: 'ruby-frame', targetMs: 230000, rewardBamboo: 50 },
    ],
  },
  {
    id: 'field-guide',
    name: 'Field Guide',
    tint: '#e8615a',
    icon: 'strawberry',
    levels: [
      { id: 'fg-1', puzzleId: 'mushroom', targetMs: 150000, rewardBamboo: 35 },
      { id: 'fg-2', puzzleId: 'strawberry', targetMs: 150000, rewardBamboo: 35 },
      { id: 'fg-3', puzzleId: 'ice-cream', targetMs: 130000, rewardBamboo: 35 },
      { id: 'fg-4', puzzleId: 'balloon', targetMs: 170000, rewardBamboo: 40 },
      { id: 'fg-5', puzzleId: 'sailboat', targetMs: 170000, rewardBamboo: 45 },
    ],
  },
  {
    id: 'toy-chest',
    name: 'Toy Chest',
    tint: '#ff9f43',
    icon: 'gift',
    levels: [
      { id: 'tc-1', puzzleId: 'bell', targetMs: 60000, rewardBamboo: 20 },
      { id: 'tc-2', puzzleId: 'flag', targetMs: 60000, rewardBamboo: 20 },
      { id: 'tc-3', puzzleId: 'arrow', targetMs: 60000, rewardBamboo: 20 },
      { id: 'tc-4', puzzleId: 'bone', targetMs: 75000, rewardBamboo: 25 },
      { id: 'tc-5', puzzleId: 'hourglass', targetMs: 75000, rewardBamboo: 25 },
      { id: 'tc-6', puzzleId: 'envelope', targetMs: 75000, rewardBamboo: 25 },
    ],
  },
  {
    id: 'storybook-trail',
    name: 'Storybook Trail',
    tint: '#5aa9e6',
    icon: 'wave',
    levels: [
      { id: 'sb-1', puzzleId: 'whale', targetMs: 200000, rewardBamboo: 40 },
      { id: 'sb-2', puzzleId: 'owl', targetMs: 210000, rewardBamboo: 45 },
      { id: 'sb-3', puzzleId: 'turtle', targetMs: 210000, rewardBamboo: 45 },
      { id: 'sb-4', puzzleId: 'snail', targetMs: 230000, rewardBamboo: 50 },
      { id: 'sb-5', puzzleId: 'crab', targetMs: 230000, rewardBamboo: 50 },
      { id: 'sb-6', puzzleId: 'castle', targetMs: 240000, rewardBamboo: 55 },
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

export function chapterOfLevel(levelId: string): Chapter | undefined {
  return CHAPTERS.find((c) => c.levels.some((l) => l.id === levelId));
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
