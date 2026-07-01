import { describe, it, expect } from 'vitest';
import { defaultProgress, markSolved, eventProgress } from '../state/progress';
import { EVENTS } from '../data/events';
import { cosmeticById } from '../data/cosmetics';

const event = EVENTS.find((e) => e.id === 'ninja-trials')!;

describe('event completion', () => {
  it('reward is exclusive and not owned by default', () => {
    const reward = event.rewardCosmetics[0];
    expect(cosmeticById(reward)?.exclusive).toBe(true);
    expect(defaultProgress().ownedCosmetics).not.toContain(reward);
  });

  it('tracks partial progress', () => {
    let p = defaultProgress();
    p = markSolved(p, event.puzzleIds[0]);
    const prog = eventProgress(p, event);
    expect(prog.done).toBe(1);
    expect(prog.complete).toBe(false);
    expect(p.claimedEvents).not.toContain(event.id);
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
