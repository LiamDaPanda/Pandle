import type { IconName } from '../components/Icon';

export interface GameEvent {
  id: string;
  name: string;
  icon: IconName;
  theme: string;
  /** Calendar months (1-12) the event is in season. Recurs every year. */
  months: number[];
  puzzleIds: string[];
  /** Cosmetics awarded for completing the event pack. */
  rewardCosmetics: string[];
}

/**
 * Events run on the real calendar and come back every year — whatever season it
 * is right now, its events are in season. Rewards are only earnable while an
 * event is live, so they stay special. No backend: it's all driven off the
 * player's clock.
 */
export const EVENTS: GameEvent[] = [
  {
    id: 'summer-splash',
    name: 'Summer Splash',
    icon: 'sun',
    theme: 'Long, sunny days by the water — earn the Tiger while it lasts.',
    months: [6, 7, 8],
    puzzleIds: ['sunny-day', 'green-fish', 'jack-o'],
    rewardCosmetics: ['skin-tiger'],
  },
  {
    id: 'spring-festival',
    name: 'Cherry Blossom Days',
    icon: 'sakura',
    theme: 'The trees are pink again. Petals everywhere.',
    months: [3, 4, 5],
    puzzleIds: ['spring-egg', 'sunny-day', 'panda-love'],
    rewardCosmetics: ['theme-sakura', 'effect-sakura'],
  },
  {
    id: 'autumn-harvest',
    name: 'Harvest Moon',
    icon: 'ninja',
    theme: 'Crisp nights and jack-o-lanterns. Move like a shadow.',
    months: [9, 10, 11],
    puzzleIds: ['jack-o', 'ghostie', 'holly'],
    rewardCosmetics: ['skin-ninja'],
  },
  {
    id: 'winter-wonderland',
    name: 'Starry Winter',
    icon: 'planet',
    theme: 'Cold, clear skies and a whole galaxy overhead.',
    months: [12, 1, 2],
    puzzleIds: ['snowflake', 'holly', 'ghostie'],
    rewardCosmetics: ['theme-galaxy'],
  },
  {
    id: 'new-year-bash',
    name: "New Year's Eve",
    icon: 'fireworks',
    theme: 'Count it down and light up the sky.',
    months: [12, 1],
    puzzleIds: ['firecracker', 'starburst', 'sunny-day'],
    rewardCosmetics: ['effect-fireworks'],
  },
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Events in season for the given date (defaults to today). */
export function activeEvents(date: Date = new Date()): GameEvent[] {
  const m = date.getMonth() + 1;
  return EVENTS.filter((e) => e.months.includes(m));
}

export function isEventLive(event: GameEvent, date: Date = new Date()): boolean {
  return event.months.includes(date.getMonth() + 1);
}

/** Name of the next month this event opens (for the "returns in" hint). */
export function nextOpenMonth(event: GameEvent, date: Date = new Date()): string {
  const now = date.getMonth() + 1;
  for (let step = 1; step <= 12; step++) {
    const m = ((now - 1 + step) % 12) + 1;
    if (event.months.includes(m)) return MONTH_NAMES[m - 1];
  }
  return MONTH_NAMES[event.months[0] - 1];
}

export function eventById(id: string): GameEvent | undefined {
  return EVENTS.find((e) => e.id === id);
}
