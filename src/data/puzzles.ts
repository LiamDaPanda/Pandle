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
    icon: 'panda',
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
    icon: 'bamboo',
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
    icon: 'heart',
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
    icon: 'rice',
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
    icon: 'cloud',
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
    icon: 'leaf',
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
    icon: 'panda',
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
    icon: 'panda-sleepy',
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
    icon: 'heart',
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
    icon: 'bamboo-tall',
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
  {
    id: 'panda-egg',
    name: 'Panda Egg',
    icon: 'egg',
    difficulty: 'easy',
    width: 5,
    height: 5,
    grid: [
      '.WWW.',
      'WWWWW',
      'WWWWW',
      'WWWWW',
      '.WWW.',
    ],
  },
  {
    id: 'plus-leaf',
    name: 'Lucky Clover',
    icon: 'clover',
    difficulty: 'easy',
    width: 5,
    height: 5,
    grid: [
      '..G..',
      '..G..',
      'GGGGG',
      '..G..',
      '..G..',
    ],
  },
  {
    id: 'gift-box',
    name: 'Gift Box',
    icon: 'gift',
    difficulty: 'easy',
    width: 5,
    height: 5,
    grid: [
      'PPPPP',
      'P...P',
      'P...P',
      'P...P',
      'PPPPP',
    ],
  },
  {
    id: 'bamboo-gem',
    name: 'Jade Gem',
    icon: 'gem',
    difficulty: 'easy',
    width: 5,
    height: 5,
    grid: [
      '..B..',
      '.BBB.',
      'BBBBB',
      '.BBB.',
      '..B..',
    ],
  },
  {
    id: 'panda-hug',
    name: 'Panda Hug',
    icon: 'panda-hug',
    difficulty: 'hard',
    width: 10,
    height: 10,
    grid: [
      'KK......KK',
      'KKK....KKK',
      'WWWWWWWWWW',
      'WWWWWWWWWW',
      'WKKWWWWKKW',
      'WKKWWWWKKW',
      'WWWWNNWWWW',
      'WWWWWWWWWW',
      'WWWWWWWWWW',
      'WWWWWWWWWW',
    ],
  },
  {
    id: 'crown',
    name: 'Panda Crown',
    icon: 'crown',
    difficulty: 'hard',
    width: 10,
    height: 10,
    grid: [
      'Y....Y....',
      'YY..YY...Y',
      'YY..YY..YY',
      'YYYYYYYYYY',
      'YYYYYYYYYY',
      'YYYYYYYYYY',
      'YYYYYYYYYY',
      'YPYYPYYPYY',
      'YYYYYYYYYY',
      'YYYYYYYYYY',
    ],
  },

  // ----- Sakura Garden (easy) -----
  {
    id: 'twinkle', name: 'Twinkle', icon: 'star', difficulty: 'easy',
    width: 5, height: 5,
    grid: ['..Y..', '.YYY.', 'YYYYY', '.YYY.', '..Y..'],
  },
  {
    id: 'window', name: 'Window', icon: 'house', difficulty: 'easy',
    width: 5, height: 5,
    grid: ['BBBBB', 'B...B', 'B...B', 'B...B', 'BBBBB'],
  },
  {
    id: 'sunflower', name: 'Sunflower', icon: 'flower', difficulty: 'easy',
    width: 5, height: 5,
    grid: ['.YYY.', 'YYYYY', 'YYYYY', 'YYYYY', '.YYY.'],
  },
  {
    id: 'ruby-heart', name: 'Ruby Heart', icon: 'heart', difficulty: 'easy',
    width: 5, height: 5,
    grid: ['.R.R.', 'RRRRR', 'RRRRR', '.RRR.', '..R..'],
  },
  {
    id: 'crescent', name: 'Crescent', icon: 'moon', difficulty: 'easy',
    width: 5, height: 5,
    grid: ['.YYY.', 'YY...', 'YY...', 'YY...', '.YYY.'],
  },
  {
    id: 'pine', name: 'Pine Tree', icon: 'tree', difficulty: 'easy',
    width: 5, height: 5,
    grid: ['.GGG.', 'GGGGG', '.GGG.', '..N..', '..N..'],
  },

  // ----- Panda Village (medium) -----
  {
    id: 'big-gem', name: 'Big Gem', icon: 'gem', difficulty: 'medium',
    width: 10, height: 10,
    grid: [
      '....BB....', '...BBBB...', '..BBBBBB..', '.BBBBBBBB.', 'BBBBBBBBBB',
      'BBBBBBBBBB', '.BBBBBBBB.', '..BBBBBB..', '...BBBB...', '....BB....',
    ],
  },
  {
    id: 'bush', name: 'Bamboo Bush', icon: 'tree', difficulty: 'medium',
    width: 10, height: 10,
    grid: [
      '..GGGGGG..', '.GGGGGGGG.', 'GGGGGGGGGG', 'GGGGGGGGGG', 'GGGGGGGGGG',
      'GGGGGGGGGG', 'GGGGGGGGGG', 'GGGGGGGGGG', '.GGGGGGGG.', '..GGGGGG..',
    ],
  },
  {
    id: 'big-gift', name: 'Big Gift', icon: 'gift', difficulty: 'medium',
    width: 10, height: 10,
    grid: [
      'PPPPPPPPPP', 'P........P', 'P........P', 'P........P', 'P........P',
      'P........P', 'P........P', 'P........P', 'P........P', 'PPPPPPPPPP',
    ],
  },
  {
    id: 'ghost', name: 'Little Ghost', icon: 'ghost', difficulty: 'medium',
    width: 10, height: 10,
    grid: [
      '...WWWW...', '..WWWWWW..', '.WWWWWWWW.', '.WWWWWWWW.', '.WKWWWWKW.',
      '.WKWWWWKW.', '.WWWWWWWW.', '.WWWWWWWW.', '.WWWWWWWW.', '.WWWWWWWW.',
    ],
  },
  {
    id: 'kitty', name: 'Kitty', icon: 'cat', difficulty: 'medium',
    width: 10, height: 10,
    grid: [
      'SS......SS', 'SSS....SSS', '.SSSSSSSS.', 'SSSSSSSSSS', 'SKSSSSSSKS',
      'SSSSSSSSSS', 'SSSSSSSSSS', 'SSSSKKSSSS', '.SSSSSSSS.', '..SSSSSS..',
    ],
  },

  // ----- Misty Lake (hard) -----
  {
    id: 'big-ruby', name: 'Big Ruby', icon: 'heart', difficulty: 'hard',
    width: 10, height: 10,
    grid: [
      '.RR..RR...', 'RRRRRRRR..', 'RRRRRRRR..', 'RRRRRRRR..', '.RRRRRRR..',
      '..RRRRR...', '...RRR....', '....R.....', '..........', '..........',
    ],
  },
  {
    id: 'blossom', name: 'Blossom', icon: 'flower', difficulty: 'hard',
    width: 10, height: 10,
    grid: [
      '....PP....', '...PPPP...', '..PPPPPP..', '.PPPPPPPP.', 'PPPPYYPPPP',
      'PPPPYYPPPP', '.PPPPPPPP.', '..PPPPPP..', '...PPPP...', '....PP....',
    ],
  },
  {
    id: 'snowball', name: 'Snowball', icon: 'cloud', difficulty: 'hard',
    width: 10, height: 10,
    grid: [
      '..WWWWWW..', '.WWWWWWWW.', 'WWWWWWWWWW', 'WWWWWWWWWW', 'WWWWWWWWWW',
      'WWWWWWWWWW', 'WWWWWWWWWW', 'WWWWWWWWWW', '.WWWWWWWW.', '..WWWWWW..',
    ],
  },
  {
    id: 'house', name: 'Cottage', icon: 'house', difficulty: 'hard',
    width: 10, height: 10,
    grid: [
      '....OO....', '...OOOO...', '..OOOOOO..', '.OOOOOOOO.', 'OOOOOOOOOO',
      '.YYYYYYYY.', '.YYYYYYYY.', '.YYYYYYYY.', '.YYYYYYYY.', '.YYYYYYYY.',
    ],
  },

  // ----- Golden Summit (hard/expert) -----
  {
    id: 'compass', name: 'Compass', icon: 'star', difficulty: 'hard',
    width: 10, height: 10,
    grid: [
      '....OO....', '....OO....', '....OO....', '....OO....', 'OOOOOOOOOO',
      'OOOOOOOOOO', '....OO....', '....OO....', '....OO....', '....OO....',
    ],
  },
  {
    id: 'grand-panda', name: 'Grand Panda', icon: 'panda', difficulty: 'hard',
    width: 10, height: 10,
    grid: [
      'KK......KK', 'KKK....KKK', '.WWWWWWWW.', 'WWWWWWWWWW', 'WKKWWWWKKW',
      'WKKWWWWKKW', 'WWWNNNWWWW', 'WWWWWWWWWW', '.WWWWWWWW.', '..WWWWWW..',
    ],
  },
  {
    id: 'duck', name: 'Ducky', icon: 'duck', difficulty: 'hard',
    width: 10, height: 10,
    grid: [
      '..........', '....YYY...', '...YYYYY..', '...YYYYY..', '.YYYYYYY..',
      'YYYYYYYY..', 'YYYYYYYYY.', 'YYYYYYYY..', '.YYYYYY...', '..........',
    ],
  },
  {
    id: 'starfish', name: 'Starfish', icon: 'star', difficulty: 'expert',
    width: 5, height: 5,
    grid: ['O.O.O', 'OOOOO', 'OOOOO', '.OOO.', 'O...O'],
  },

  // ----- Crystal Cove (easy) -----
  {
    id: 'water-drop', name: 'Water Drop', icon: 'wave', difficulty: 'easy',
    width: 5, height: 5,
    grid: ['..B..', '.BBB.', 'BBBBB', '.BBB.', '..B..'],
  },
  {
    id: 'tiny-sun', name: 'Little Sun', icon: 'sun', difficulty: 'easy',
    width: 5, height: 5,
    grid: ['.OOO.', 'OOOOO', 'OOOOO', 'OOOOO', '.OOO.'],
  },
  {
    id: 'red-gift', name: 'Red Parcel', icon: 'gift', difficulty: 'easy',
    width: 5, height: 5,
    grid: ['RRRRR', 'R...R', 'R...R', 'R...R', 'RRRRR'],
  },
  {
    id: 'green-heart', name: 'Green Heart', icon: 'heart', difficulty: 'easy',
    width: 5, height: 5,
    grid: ['.G.G.', 'GGGGG', 'GGGGG', '.GGG.', '..G..'],
  },
  {
    id: 'amber-gem', name: 'Amber Gem', icon: 'gem', difficulty: 'easy',
    width: 5, height: 5,
    grid: ['..O..', '.OOO.', 'OOOOO', '.OOO.', '..O..'],
  },

  // ----- Cloud Summit (medium/hard) -----
  {
    id: 'moss-block', name: 'Moss Cube', icon: 'tree', difficulty: 'medium',
    width: 10, height: 10,
    grid: [
      '..DDDDDD..', '.DDDDDDDD.', 'DDDDDDDDDD', 'DDDDDDDDDD', 'DDDDDDDDDD',
      'DDDDDDDDDD', 'DDDDDDDDDD', 'DDDDDDDDDD', '.DDDDDDDD.', '..DDDDDD..',
    ],
  },
  {
    id: 'rose-border', name: 'Rose Frame', icon: 'gift', difficulty: 'medium',
    width: 10, height: 10,
    grid: [
      'PPPPPPPPPP', 'P........P', 'P........P', 'P........P', 'P........P',
      'P........P', 'P........P', 'P........P', 'P........P', 'PPPPPPPPPP',
    ],
  },
  {
    id: 'silver-cross', name: 'Silver Cross', icon: 'star', difficulty: 'hard',
    width: 10, height: 10,
    grid: [
      '....SS....', '....SS....', '....SS....', '....SS....', 'SSSSSSSSSS',
      'SSSSSSSSSS', '....SS....', '....SS....', '....SS....', '....SS....',
    ],
  },
  {
    id: 'sky-fish', name: 'Sky Fish', icon: 'fish', difficulty: 'hard',
    width: 10, height: 10,
    grid: [
      '..........', '...BBBB...', '..BBBBBB.B', '.BBBBBBBBB', '.BBBBBBBBB',
      '.BBBBBBBBB', '..BBBBBB.B', '...BBBB...', '..........', '..........',
    ],
  },
  {
    id: 'aqua-diamond', name: 'Aqua Diamond', icon: 'wave', difficulty: 'hard',
    width: 10, height: 10,
    grid: [
      '....BB....', '...BBBB...', '..BBBBBB..', '.BBBBBBBB.', 'BBBBBBBBBB',
      'BBBBBBBBBB', '.BBBBBBBB.', '..BBBBBB..', '...BBBB...', '....BB....',
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
