import { describe, it, expect } from 'vitest';
import {
  defaultProgress,
  isLevelUnlocked,
  claimChapterBonuses,
  claimMilestones,
  CHAPTER_CLEAR_BONUS,
  Progress,
} from '../state/progress';
import { DEFAULT_STATS, dailyReward, Stats } from '../state/stats';
import { CHAPTERS } from '../data/levels';
import { MILESTONES } from '../data/milestones';

const stats = (over: Partial<Stats> = {}): Stats => ({ ...DEFAULT_STATS, ...over });

function withStars(levelIds: string[], stars = 1): Progress {
  const p = defaultProgress();
  for (const id of levelIds) p.stars[id] = stars;
  return p;
}

describe('daily reward', () => {
  it('scales with streak and caps', () => {
    expect(dailyReward(0)).toBe(12);
    expect(dailyReward(1)).toBe(14);
    expect(dailyReward(12)).toBe(36);
    expect(dailyReward(100)).toBe(36); // capped
  });
});

describe('chapter clear bonus', () => {
  const ch1 = CHAPTERS[0];

  it('grants the bonus once when a chapter is fully cleared', () => {
    const p = withStars(ch1.levels.map((l) => l.id));
    const first = claimChapterBonuses(p);
    expect(first.cleared.map((c) => c.id)).toContain(ch1.id);
    expect(first.progress.bamboo).toBe(p.bamboo + CHAPTER_CLEAR_BONUS);

    const again = claimChapterBonuses(first.progress);
    expect(again.cleared).toHaveLength(0);
    expect(again.progress.bamboo).toBe(first.progress.bamboo);
  });

  it('does not grant for a partially cleared chapter', () => {
    const p = withStars(ch1.levels.slice(0, ch1.levels.length - 1).map((l) => l.id));
    expect(claimChapterBonuses(p).cleared).toHaveLength(0);
  });
});

describe('milestones', () => {
  it('grants a reached milestone exactly once', () => {
    const p = { ...defaultProgress(), solvedPuzzles: ['a'] };
    const first = claimMilestones(p, stats());
    const ids = first.earned.map((m) => m.id);
    expect(ids).toContain('solve-1');
    const reward = MILESTONES.filter((m) => ids.includes(m.id)).reduce((a, m) => a + m.reward, 0);
    expect(first.progress.bamboo).toBe(p.bamboo + reward);

    const again = claimMilestones(first.progress, stats());
    expect(again.earned).toHaveLength(0);
  });

  it('streak milestones use the best streak from stats', () => {
    const res = claimMilestones(defaultProgress(), stats({ maxStreak: 7 }));
    const ids = res.earned.map((m) => m.id);
    expect(ids).toContain('streak-3');
    expect(ids).toContain('streak-7');
    expect(ids).not.toContain('streak-14');
  });

  it('every milestone has a positive target and reward', () => {
    for (const m of MILESTONES) {
      expect(m.target).toBeGreaterThan(0);
      expect(m.reward).toBeGreaterThan(0);
    }
  });
});

describe('softened chapter gating', () => {
  const ch1 = CHAPTERS[0];
  const ch2 = CHAPTERS[1];

  it('next chapter opens once all but two of the previous are cleared', () => {
    const enough = Math.max(1, ch1.levels.length - 2);
    const p = withStars(ch1.levels.slice(0, enough).map((l) => l.id));
    expect(isLevelUnlocked(p, ch2.levels[0].id)).toBe(true);
    // But not deeper into the chapter — only the first level opens early.
    expect(isLevelUnlocked(p, ch2.levels[1].id)).toBe(false);
  });

  it('next chapter stays locked with too few clears', () => {
    const p = withStars([ch1.levels[0].id]);
    expect(isLevelUnlocked(p, ch2.levels[0].id)).toBe(false);
  });

  it('strict in-chapter chain still applies', () => {
    const p = defaultProgress();
    expect(isLevelUnlocked(p, ch1.levels[0].id)).toBe(true);
    expect(isLevelUnlocked(p, ch1.levels[1].id)).toBe(false);
    p.stars[ch1.levels[0].id] = 2;
    expect(isLevelUnlocked(p, ch1.levels[1].id)).toBe(true);
  });
});
