export type CosmeticKind = 'theme' | 'effect' | 'skin';

export interface Theme {
  '--bg': string;
  '--surface': string;
  '--ink': string;
  '--accent': string;
  '--accent-soft': string;
  '--grid-line': string;
  '--cell-empty': string;
  '--cell-fill': string;
}

export interface Cosmetic {
  id: string;
  kind: CosmeticKind;
  name: string;
  emoji: string;
  /** Cost in bamboo; 0 means unlocked by default. */
  cost: number;
  /** For themes: the CSS variable overrides. */
  theme?: Theme;
  /** For effect packs: particle color palette. */
  particleColors?: string[];
  /** For skins: an emoji shown on the celebration mascot. */
  mascot?: string;
}

export const THEMES: Cosmetic[] = [
  {
    id: 'theme-bamboo',
    kind: 'theme',
    name: 'Bamboo Grove',
    emoji: '🎋',
    cost: 0,
    theme: {
      '--bg': '#fdf6ec',
      '--surface': '#ffffff',
      '--ink': '#3a3532',
      '--accent': '#7bc47f',
      '--accent-soft': '#e6f4e7',
      '--grid-line': '#d9cbb6',
      '--cell-empty': '#fbf3e6',
      '--cell-fill': '#2b2b2b',
    },
  },
  {
    id: 'theme-sakura',
    kind: 'theme',
    name: 'Sakura Blossom',
    emoji: '🌸',
    cost: 40,
    theme: {
      '--bg': '#fff0f4',
      '--surface': '#ffffff',
      '--ink': '#5a3a45',
      '--accent': '#ff9fb6',
      '--accent-soft': '#ffe0e8',
      '--grid-line': '#f0c4d0',
      '--cell-empty': '#fff5f8',
      '--cell-fill': '#6a4a55',
    },
  },
  {
    id: 'theme-midnight',
    kind: 'theme',
    name: 'Midnight Panda',
    emoji: '🌙',
    cost: 60,
    theme: {
      '--bg': '#1e2233',
      '--surface': '#2a2f45',
      '--ink': '#eef1ff',
      '--accent': '#8ecae6',
      '--accent-soft': '#33405e',
      '--grid-line': '#3d4560',
      '--cell-empty': '#242a3e',
      '--cell-fill': '#eef1ff',
    },
  },
];

export const EFFECTS: Cosmetic[] = [
  {
    id: 'effect-leaves',
    kind: 'effect',
    name: 'Bamboo Leaves',
    emoji: '🍃',
    cost: 0,
    particleColors: ['#7bc47f', '#4f9d54', '#a8d8a0'],
  },
  {
    id: 'effect-confetti',
    kind: 'effect',
    name: 'Party Confetti',
    emoji: '🎉',
    cost: 30,
    particleColors: ['#ff6b6b', '#ffd166', '#6bcB77', '#4d96ff', '#c780e8'],
  },
  {
    id: 'effect-sakura',
    kind: 'effect',
    name: 'Petal Storm',
    emoji: '🌸',
    cost: 50,
    particleColors: ['#ff9fb6', '#ffc2d1', '#ffe0e8'],
  },
];

export const SKINS: Cosmetic[] = [
  { id: 'skin-classic', kind: 'skin', name: 'Classic Panda', emoji: '🐼', cost: 0, mascot: '🐼' },
  { id: 'skin-red', kind: 'skin', name: 'Red Panda', emoji: '🦊', cost: 45, mascot: '🦊' },
  { id: 'skin-koala', kind: 'skin', name: 'Koala Buddy', emoji: '🐨', cost: 45, mascot: '🐨' },
];

export const ALL_COSMETICS: Cosmetic[] = [...THEMES, ...EFFECTS, ...SKINS];

export const DEFAULT_EQUIPPED = {
  theme: 'theme-bamboo',
  effect: 'effect-leaves',
  skin: 'skin-classic',
};

export function cosmeticById(id: string): Cosmetic | undefined {
  return ALL_COSMETICS.find((c) => c.id === id);
}

export function defaultOwned(): string[] {
  return ALL_COSMETICS.filter((c) => c.cost === 0).map((c) => c.id);
}
