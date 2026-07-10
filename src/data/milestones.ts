import type { IconName } from '../components/Icon';
import type { Progress } from '../state/progress';
import type { Stats } from '../state/stats';
import { CHAPTERS } from './levels';

export interface Milestone {
  id: string;
  name: string;
  desc: string;
  icon: IconName;
  /** Bamboo granted when the milestone is reached. */
  reward: number;
  target: number;
  measure: (p: Progress, s: Stats) => number;
}

const solves = (p: Progress) => p.solvedPuzzles.length;
const stars = (p: Progress) => Object.values(p.stars).reduce((a, b) => a + b, 0);
const bestStreak = (_p: Progress, s: Stats) => s.maxStreak;
const cosmetics = (p: Progress) => p.ownedCosmetics.length;
const chaptersCleared = (p: Progress) =>
  CHAPTERS.filter((c) => c.levels.every((l) => (p.stars[l.id] ?? 0) > 0)).length;

export const MILESTONES: Milestone[] = [
  { id: 'solve-1', name: 'First Picture', desc: 'Solve your first puzzle', icon: 'star', reward: 10, target: 1, measure: solves },
  { id: 'solve-10', name: 'Ten Little Pictures', desc: 'Solve 10 puzzles', icon: 'leaf', reward: 20, target: 10, measure: solves },
  { id: 'solve-25', name: 'Gallery Keeper', desc: 'Solve 25 puzzles', icon: 'gift', reward: 35, target: 25, measure: solves },
  { id: 'solve-50', name: 'Picture Hunter', desc: 'Solve 50 puzzles', icon: 'crown', reward: 60, target: 50, measure: solves },
  { id: 'streak-3', name: 'Three in a Row', desc: 'Reach a 3-day daily streak', icon: 'flame', reward: 15, target: 3, measure: bestStreak },
  { id: 'streak-7', name: 'One Whole Week', desc: 'Reach a 7-day daily streak', icon: 'flame', reward: 40, target: 7, measure: bestStreak },
  { id: 'streak-14', name: 'Two Weeks Strong', desc: 'Reach a 14-day daily streak', icon: 'sun', reward: 70, target: 14, measure: bestStreak },
  { id: 'stars-15', name: 'Star Collector', desc: 'Earn 15 stars in Adventure', icon: 'star', reward: 25, target: 15, measure: stars },
  { id: 'stars-45', name: 'Star Gazer', desc: 'Earn 45 stars in Adventure', icon: 'star', reward: 45, target: 45, measure: stars },
  { id: 'stars-90', name: 'Little Constellation', desc: 'Earn 90 stars in Adventure', icon: 'planet', reward: 80, target: 90, measure: stars },
  { id: 'chapter-1', name: 'Chapter One, Done', desc: 'Clear your first chapter', icon: 'map', reward: 20, target: 1, measure: chaptersCleared },
  { id: 'chapter-4', name: 'Seasoned Explorer', desc: 'Clear 4 chapters', icon: 'mountain', reward: 45, target: 4, measure: chaptersCleared },
  { id: 'chapter-8', name: 'Halfway Through the Grove', desc: 'Clear 8 chapters', icon: 'bamboo', reward: 75, target: 8, measure: chaptersCleared },
  { id: 'cosmetics-6', name: 'Dressing Up', desc: 'Own 6 cosmetics', icon: 'palette', reward: 25, target: 6, measure: cosmetics },
  { id: 'cosmetics-12', name: 'A Full Wardrobe', desc: 'Own 12 cosmetics', icon: 'crown', reward: 50, target: 12, measure: cosmetics },
];

export function milestoneById(id: string): Milestone | undefined {
  return MILESTONES.find((m) => m.id === id);
}

/** Current value toward a milestone, capped at its target. */
export function milestoneValue(m: Milestone, p: Progress, s: Stats): number {
  return Math.min(m.measure(p, s), m.target);
}
