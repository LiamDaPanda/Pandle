import type { IconName } from '../components/Icon';

export interface GameEvent {
  id: string;
  name: string;
  icon: IconName;
  theme: string;
  /** ISO date (inclusive) the event opens. */
  startsAt: string;
  /** ISO date (inclusive) the event closes. */
  endsAt: string;
  puzzleIds: string[];
  /** Cosmetics awarded for completing the event pack. */
  rewardCosmetics: string[];
}

/**
 * Events are fully client-side: each has a date window and simply surfaces a
 * themed pack of existing puzzles plus a cosmetic reward. Widen the windows or
 * add new events over time — no backend required.
 */
export const EVENTS: GameEvent[] = [
  {
    id: 'ninja-trials',
    name: 'Ninja Trials',
    icon: 'ninja',
    theme: 'Master the shadows to unlock the Ninja Panda skin',
    startsAt: '2025-01-01',
    endsAt: '2030-12-31',
    puzzleIds: ['firecracker', 'ghostie', 'jack-o'],
    rewardCosmetics: ['skin-ninja'],
  },
  {
    id: 'starfall-festival',
    name: 'Starfall Festival',
    icon: 'planet',
    theme: 'Chase the comets for the exclusive Galaxy theme',
    startsAt: '2025-01-01',
    endsAt: '2030-12-31',
    puzzleIds: ['starburst', 'snowflake', 'amethyst'],
    rewardCosmetics: ['theme-galaxy'],
  },
  {
    id: 'new-year-bash',
    name: 'New Year Bash',
    icon: 'fireworks',
    theme: 'Light up the sky to earn the Fireworks effect',
    startsAt: '2025-01-01',
    endsAt: '2030-12-31',
    puzzleIds: ['firecracker', 'starburst', 'sunny-day'],
    rewardCosmetics: ['effect-fireworks'],
  },
  {
    id: 'jungle-safari',
    name: 'Jungle Safari',
    icon: 'tiger',
    theme: 'Track the wild ones to tame the Tiger skin',
    startsAt: '2025-01-01',
    endsAt: '2030-12-31',
    puzzleIds: ['holly', 'spring-egg', 'green-fish'],
    rewardCosmetics: ['skin-tiger'],
  },
  {
    id: 'spring-festival',
    name: 'Spring Festival',
    icon: 'sakura',
    theme: 'Cherry blossoms & baby pandas (seasonal)',
    startsAt: '2026-03-01',
    endsAt: '2026-05-31',
    puzzleIds: ['spring-egg', 'sunny-day', 'panda-love'],
    rewardCosmetics: ['theme-sakura', 'effect-sakura'],
  },
];

/** Events whose date window contains `date` (defaults to today). */
export function activeEvents(date: Date = new Date()): GameEvent[] {
  const t = date.getTime();
  return EVENTS.filter((e) => {
    const start = new Date(`${e.startsAt}T00:00:00`).getTime();
    const end = new Date(`${e.endsAt}T23:59:59`).getTime();
    return t >= start && t <= end;
  });
}

export function eventById(id: string): GameEvent | undefined {
  return EVENTS.find((e) => e.id === id);
}
