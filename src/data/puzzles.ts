import { Puzzle } from '../game/types';

/**
 * Curated picross art. The *silhouette* (any non-'.' cell) is what must be
 * uniquely solvable by logic; the specific letters only pick reveal colors:
 *   K black · W white · G green · D dark-green · P pink · Y yellow · N brown
 *
 * Every puzzle here is checked by src/__tests__/puzzles.noGuess.test.ts, which
 * fails the build if any puzzle needs guessing.
 */
export const ALL_PUZZLES: Puzzle[] = [
  {
    id: 'baby-panda',
    name: 'Baby Panda',
    emoji: '🐼',
    difficulty: 'easy',
    width: 5,
    height: 5,
    grid: [
      'KK.KK',
      'WWWWW',
      'WKWKW',
      'WWNWW',
      '.WWW.',
    ],
  },
  {
    id: 'bamboo',
    name: 'Bamboo Shoot',
    emoji: '🎋',
    difficulty: 'easy',
    width: 5,
    height: 5,
    grid: [
      '..G..',
      '.GGG.',
      '..G..',
      '.GGG.',
      '..G..',
    ],
  },
  {
    id: 'panda-love',
    name: 'Panda Love',
    emoji: '💗',
    difficulty: 'easy',
    width: 5,
    height: 5,
    grid: [
      '.P.P.',
      'PPPPP',
      'PPPPP',
      '.PPP.',
      '..P..',
    ],
  },
  {
    id: 'rice-ball',
    name: 'Rice Ball',
    emoji: '🍙',
    difficulty: 'easy',
    width: 5,
    height: 5,
    grid: [
      '..W..',
      '.WWW.',
      'WWWWW',
      'KKKKK',
      'KKKKK',
    ],
  },
  {
    id: 'happy-cloud',
    name: 'Sky Cloud',
    emoji: '☁️',
    difficulty: 'easy',
    width: 5,
    height: 5,
    grid: [
      '.....',
      '.BB..',
      'BBBBB',
      'BBBBB',
      '.....',
    ],
  },
  {
    id: 'leaf',
    name: 'Bamboo Leaf',
    emoji: '🌿',
    difficulty: 'easy',
    width: 5,
    height: 5,
    grid: [
      '..D..',
      '.DDD.',
      'DDDDD',
      '.DGD.',
      '..D..',
    ],
  },
  {
    id: 'panda-face',
    name: 'Panda Face',
    emoji: '🐼',
    difficulty: 'medium',
    width: 10,
    height: 10,
    grid: [
      'KK......KK',
      'KKK....KKK',
      '.WWWWWWWW.',
      'WWWWWWWWWW',
      'WKKWWWWKKW',
      'WKKWWWWKKW',
      'WWWWNNWWWW',
      'WWWWWWWWWW',
      '.WWWWWWWW.',
      '..WWWWWW..',
    ],
  },
  {
    id: 'sleepy-panda',
    name: 'Sleepy Panda',
    emoji: '😴',
    difficulty: 'medium',
    width: 10,
    height: 10,
    grid: [
      '..KK..KK..',
      '.KKK..KKK.',
      '.WWWWWWWW.',
      'WWWWWWWWWW',
      'WWKKWWKKWW',
      'WWWWWWWWWW',
      'WWWWNNWWWW',
      'WWWWWWWWWW',
      '.WWWWWWWW.',
      '..WWWWWW..',
    ],
  },
  {
    id: 'panda-heart',
    name: 'Big Heart',
    emoji: '❤️',
    difficulty: 'medium',
    width: 10,
    height: 10,
    grid: [
      '.PP..PP...',
      'PPPPPPPP..',
      'PPPPPPPP..',
      'PPPPPPPP..',
      '.PPPPPPP..',
      '..PPPPP...',
      '...PPP....',
      '....P.....',
      '..........',
      '..........',
    ],
  },
  {
    id: 'bamboo-stalk',
    name: 'Tall Bamboo',
    emoji: '🎍',
    difficulty: 'medium',
    width: 10,
    height: 10,
    grid: [
      '...GG.....',
      '..GGGG....',
      '...GG.DD..',
      '...GGDDD..',
      '...GG.....',
      '.DD.GG....',
      'DDD.GG....',
      '...GGGG...',
      '....GG....',
      '....GG....',
    ],
  },
];

/** Puzzles used for the deterministic daily rotation. */
export const DAILY_PUZZLES: Puzzle[] = ALL_PUZZLES;

export function puzzleById(id: string): Puzzle | undefined {
  return ALL_PUZZLES.find((p) => p.id === id);
}

export function puzzlesByDifficulty(d: Puzzle['difficulty']): Puzzle[] {
  return ALL_PUZZLES.filter((p) => p.difficulty === d);
}
