import { describe, it, expect } from 'vitest';
import { defaultProgress, markSolved, eventProgress } from '../state/progress';
import { EVENTS, activeEvents, isEventLive, nextOpenMonth, daysLeftInSeason } from '../data/events';
import { cosmeticById } from '../data/cosmetics';

const event = EVENTS.find((e) => e.id === 'summer-splash')!;

describe('seasonal scheduling', () => {
  it('summer event is live in July, not in January', () => {
    expect(isEventLive(event, new Date(2026, 6, 15))).toBe(true); // July
    expect(isEventLive(event, new Date(2026, 0, 15))).toBe(false); // January
  });
  it('activeEvents reflects the month', () => {
    const july = activeEvents(new Date(2026, 6, 1)).map((e) => e.id);
    expect(july).toContain('summer-splash');
    expect(july).not.toContain('winter-wonderland');
  });
  it('nextOpenMonth names an upcoming month when out of season', () => {
    expect(nextOpenMonth(event, new Date(2026, 0, 1))).toBe('June');
  });
  it('daysLeftInSeason counts through the whole in-season stretch', () => {
    // summer-splash runs Jun-Aug; from Aug 30 there are 2 days left (30th, 31st).
    expect(daysLeftInSeason(event, new Date(2026, 7, 30))).toBe(2);
    // From July 1 the stretch runs through Aug 31: 31 + 31 = 62 days.
    expect(daysLeftInSeason(event, new Date(2026, 6, 1))).toBe(62);
    // Out of season → 0.
    expect(daysLeftInSeason(event, new Date(2026, 0, 1))).toBe(0);
  });
});

describe('event completion', () => {
  it('reward is exclusive and not owned by default', () => {
    const reward = event.rewardCosmetics[0];
    expect(cosmeticById(reward)?.exclusive).toBe(true);
    expect(defaultProgress().ownedCosmetics).not.toContain(reward);
  });

  it('grants the exclusive reward once all event puzzles are solved', () => {
    let p = defaultProgress();
    for (const id of event.puzzleIds) p = markSolved(p, id);
    expect(eventProgress(p, event).complete).toBe(true);
    expect(p.claimedEvents).toContain(event.id);
    expect(p.ownedCosmetics).toContain(event.rewardCosmetics[0]);
  });

  it('does not double-count a repeated solve', () => {
    let p = defaultProgress();
    p = markSolved(p, event.puzzleIds[0]);
    p = markSolved(p, event.puzzleIds[0]);
    expect(p.solvedPuzzles.filter((x) => x === event.puzzleIds[0])).toHaveLength(1);
  });
});
