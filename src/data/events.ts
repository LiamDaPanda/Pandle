export interface GameEvent {
  id: string;
  name: string;
  emoji: string;
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
    id: 'spring-festival',
    name: 'Spring Festival',
    emoji: '🌸',
    theme: 'Cherry blossoms & baby pandas',
    startsAt: '2025-03-01',
    endsAt: '2025-05-31',
    puzzleIds: ['panda-love', 'baby-panda', 'panda-heart'],
    rewardCosmetics: ['theme-sakura', 'effect-sakura'],
  },
  {
    id: 'bamboo-harvest',
    name: 'Bamboo Harvest',
    emoji: '🎋',
    theme: 'Fill the forest with fresh bamboo',
    startsAt: '2025-06-01',
    endsAt: '2030-12-31',
    puzzleIds: ['bamboo', 'leaf', 'bamboo-stalk'],
    rewardCosmetics: ['skin-red'],
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
