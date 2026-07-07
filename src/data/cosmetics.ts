import type { IconName } from '../components/Icon';

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

export type ParticleShape = 'leaf' | 'petal' | 'confetti' | 'star' | 'snow' | 'heart';

export interface Cosmetic {
  id: string;
  kind: CosmeticKind;
  name: string;
  icon: IconName;
  /** Cost in bamboo; 0 means unlocked by default. */
  cost: number;
  /** For themes: the CSS variable overrides. */
  theme?: Theme;
  /** For effect packs: particle color palette + shape. */
  particleColors?: string[];
  particleShape?: ParticleShape;
  /** For skins: the mascot art (home + celebration) and the board fill token. */
  mascot?: IconName;
  token?: IconName;
  /** Exclusive cosmetics can only be earned from events (never bought). */
  exclusive?: boolean;
}

export const THEMES: Cosmetic[] = [
  {
    id: 'theme-bamboo',
    kind: 'theme',
    name: 'Bamboo Grove',
    icon: 'bamboo',
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
    icon: 'sakura',
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
    icon: 'moon',
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
  {
    id: 'theme-ocean',
    kind: 'theme',
    name: 'Ocean Breeze',
    icon: 'wave',
    cost: 55,
    theme: {
      '--bg': '#eaf6fb',
      '--surface': '#ffffff',
      '--ink': '#2b4a58',
      '--accent': '#3fa7d6',
      '--accent-soft': '#d5eef8',
      '--grid-line': '#bcdcea',
      '--cell-empty': '#f2fafd',
      '--cell-fill': '#2b6f8f',
    },
  },
  {
    id: 'theme-sunset',
    kind: 'theme',
    name: 'Sunset Glow',
    icon: 'sun',
    cost: 55,
    theme: {
      '--bg': '#fff2e6',
      '--surface': '#fffaf5',
      '--ink': '#6a3d33',
      '--accent': '#ff8c5a',
      '--accent-soft': '#ffe1cf',
      '--grid-line': '#f3ccae',
      '--cell-empty': '#fff6ef',
      '--cell-fill': '#8a4a34',
    },
  },
  {
    id: 'theme-matcha',
    kind: 'theme',
    name: 'Matcha Latte',
    icon: 'leaf',
    cost: 70,
    theme: {
      '--bg': '#eef3e2',
      '--surface': '#fbfdf6',
      '--ink': '#41502f',
      '--accent': '#8bb04f',
      '--accent-soft': '#e2edcd',
      '--grid-line': '#c9d6a9',
      '--cell-empty': '#f4f8ea',
      '--cell-fill': '#4d5f31',
    },
  },
  {
    id: 'theme-strawberry',
    kind: 'theme',
    name: 'Strawberry Milk',
    icon: 'strawberry',
    cost: 50,
    theme: {
      '--bg': '#fff1f4',
      '--surface': '#fffafb',
      '--ink': '#7a4a55',
      '--accent': '#ff6f91',
      '--accent-soft': '#ffe0e8',
      '--grid-line': '#f4c9d5',
      '--cell-empty': '#fff5f8',
      '--cell-fill': '#8a4a58',
    },
  },
  {
    id: 'theme-charcoal',
    kind: 'theme',
    name: 'Charcoal',
    icon: 'moon',
    cost: 55,
    theme: {
      '--bg': '#20232a',
      '--surface': '#2b2f38',
      '--ink': '#e8ebf0',
      '--accent': '#f0913e',
      '--accent-soft': '#3a3f4a',
      '--grid-line': '#3f4550',
      '--cell-empty': '#262a32',
      '--cell-fill': '#e8ebf0',
    },
  },
  {
    id: 'theme-galaxy',
    kind: 'theme',
    name: 'Galaxy',
    icon: 'planet',
    cost: 0,
    exclusive: true,
    theme: {
      '--bg': '#14122b',
      '--surface': '#221f45',
      '--ink': '#eae6ff',
      '--accent': '#a78bfa',
      '--accent-soft': '#2f2a5c',
      '--grid-line': '#3a3568',
      '--cell-empty': '#1b1838',
      '--cell-fill': '#eae6ff',
    },
  },
];

export const EFFECTS: Cosmetic[] = [
  {
    id: 'effect-leaves',
    kind: 'effect',
    name: 'Bamboo Leaves',
    icon: 'leaf',
    cost: 0,
    particleColors: ['#7bc47f', '#4f9d54', '#a8d8a0'],
    particleShape: 'leaf',
  },
  {
    id: 'effect-confetti',
    kind: 'effect',
    name: 'Party Confetti',
    icon: 'confetti',
    cost: 30,
    particleColors: ['#ff6b6b', '#ffd166', '#6bcb77', '#4d96ff', '#c780e8'],
    particleShape: 'confetti',
  },
  {
    id: 'effect-sakura',
    kind: 'effect',
    name: 'Petal Storm',
    icon: 'sakura',
    cost: 50,
    particleColors: ['#ff9fb6', '#ffc2d1', '#ffe0e8'],
    particleShape: 'petal',
  },
  {
    id: 'effect-stars',
    kind: 'effect',
    name: 'Starfall',
    icon: 'star',
    cost: 60,
    particleColors: ['#ffd66b', '#ffe9a8', '#fff3cf'],
    particleShape: 'star',
  },
  {
    id: 'effect-snow',
    kind: 'effect',
    name: 'Snow Flurry',
    icon: 'cloud',
    cost: 60,
    particleColors: ['#ffffff', '#e7f1f7', '#cfe4ef'],
    particleShape: 'snow',
  },
  {
    id: 'effect-hearts',
    kind: 'effect',
    name: 'Heart Shower',
    icon: 'heart',
    cost: 70,
    particleColors: ['#ff8fab', '#ffb3c6', '#ffd6e0'],
    particleShape: 'heart',
  },
  {
    id: 'effect-fireworks',
    kind: 'effect',
    name: 'Fireworks',
    icon: 'fireworks',
    cost: 0,
    exclusive: true,
    particleColors: ['#ff6b6b', '#ffd166', '#6bcb77', '#4d96ff', '#c780e8', '#ff9fb6'],
    particleShape: 'star',
  },
  {
    id: 'effect-bubbles',
    kind: 'effect',
    name: 'Bubbles',
    icon: 'wave',
    cost: 0,
    exclusive: true,
    particleColors: ['#8ecae6', '#bfe3f2', '#e6f4fb'],
    particleShape: 'snow',
  },
  {
    id: 'effect-fireflies',
    kind: 'effect',
    name: 'Fireflies',
    icon: 'sun',
    cost: 0,
    exclusive: true,
    particleColors: ['#ffe58a', '#fff3bf', '#d9f08a'],
    particleShape: 'star',
  },
];

export const SKINS: Cosmetic[] = [
  { id: 'skin-classic', kind: 'skin', name: 'Classic Panda', icon: 'panda', cost: 0, mascot: 'panda', token: 'panda-token' },
  { id: 'skin-red', kind: 'skin', name: 'Red Panda', icon: 'red-panda', cost: 45, mascot: 'red-panda', token: 'red-panda-token' },
  { id: 'skin-koala', kind: 'skin', name: 'Koala Buddy', icon: 'koala', cost: 45, mascot: 'koala', token: 'koala-token' },
  { id: 'skin-polar', kind: 'skin', name: 'Polar Bear', icon: 'polar-bear', cost: 65, mascot: 'polar-bear', token: 'polar-token' },
  { id: 'skin-brown', kind: 'skin', name: 'Brown Bear', icon: 'brown-bear', cost: 65, mascot: 'brown-bear', token: 'brown-token' },
  { id: 'skin-bunny', kind: 'skin', name: 'Bunny', icon: 'bunny', cost: 55, mascot: 'bunny', token: 'bunny-token' },
  { id: 'skin-tiger', kind: 'skin', name: 'Tiger', icon: 'tiger', cost: 0, exclusive: true, mascot: 'tiger', token: 'tiger-token' },
  { id: 'skin-ninja', kind: 'skin', name: 'Ninja Panda', icon: 'ninja', cost: 0, exclusive: true, mascot: 'ninja', token: 'ninja-token' },
  { id: 'skin-golden', kind: 'skin', name: 'Golden Panda', icon: 'golden-panda', cost: 0, exclusive: true, mascot: 'golden-panda', token: 'golden-token' },
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
  return ALL_COSMETICS.filter((c) => c.cost === 0 && !c.exclusive).map((c) => c.id);
}

/** The board fill token for an equipped skin id. */
export function tokenFor(skinId: string): IconName {
  return cosmeticById(skinId)?.token ?? 'panda-token';
}

/** Colors + particle shape for an equipped effect id. */
export function particleStyle(effectId: string): { colors: string[]; shape: ParticleShape } {
  const c = cosmeticById(effectId);
  return {
    colors: c?.particleColors ?? ['#7bc47f', '#4f9d54'],
    shape: c?.particleShape ?? 'leaf',
  };
}
