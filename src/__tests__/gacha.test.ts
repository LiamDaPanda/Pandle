import { describe, it, expect } from 'vitest';
import { GACHA_COST, GACHA_PITY, gachaPool, pullCapsule } from '../game/gacha';
import { defaultProgress } from '../state/progress';
import { ALL_COSMETICS } from '../data/cosmetics';

/** rng stub returning a fixed sequence (repeats the last value). */
const seq = (...vals: number[]) => {
  let i = 0;
  return () => vals[Math.min(i++, vals.length - 1)];
};

describe('lucky capsules', () => {
  it('always charges the pull cost', () => {
    const p = { ...defaultProgress(), bamboo: 100 };
    const { progress, result } = pullCapsule(p, seq(0.99, 0.5));
    expect(result.kind).toBe('bamboo');
    if (result.kind === 'bamboo') {
      expect(progress.bamboo).toBe(100 - GACHA_COST + result.amount);
    }
  });

  it('a low roll drops an unowned, non-exclusive cosmetic and resets pity', () => {
    const p = { ...defaultProgress(), bamboo: 100, gachaPity: 2 };
    const { progress, result } = pullCapsule(p, seq(0.1, 0));
    expect(result.kind).toBe('cosmetic');
    if (result.kind === 'cosmetic') {
      expect(result.cosmetic.exclusive).toBeFalsy();
      expect(p.ownedCosmetics).not.toContain(result.cosmetic.id);
      expect(progress.ownedCosmetics).toContain(result.cosmetic.id);
    }
    expect(progress.gachaPity).toBe(0);
  });

  it('pity guarantees a cosmetic within GACHA_PITY pulls', () => {
    const p = { ...defaultProgress(), bamboo: 1000, gachaPity: GACHA_PITY - 1 };
    // Roll high enough that it would otherwise be small bamboo.
    const { result } = pullCapsule(p, seq(0.95, 0.5));
    expect(result.kind).toBe('cosmetic');
  });

  it('non-cosmetic pulls advance the pity counter', () => {
    const p = { ...defaultProgress(), bamboo: 100, gachaPity: 0 };
    const { progress } = pullCapsule(p, seq(0.95, 0.5));
    expect(progress.gachaPity).toBe(1);
  });

  it('jackpot pays 60-100 bamboo', () => {
    const p = { ...defaultProgress(), bamboo: 100 };
    const { result } = pullCapsule(p, seq(0.25, 0)); // 0.2 <= r < 0.3
    expect(result.kind).toBe('jackpot');
    if (result.kind === 'jackpot') {
      expect(result.amount).toBeGreaterThanOrEqual(60);
      expect(result.amount).toBeLessThanOrEqual(100);
    }
  });

  it('when every cosmetic is owned, the cosmetic slot pays 50 bamboo', () => {
    const p = {
      ...defaultProgress(),
      bamboo: 100,
      ownedCosmetics: ALL_COSMETICS.map((c) => c.id),
    };
    expect(gachaPool(p)).toHaveLength(0);
    const { progress, result } = pullCapsule(p, seq(0.05, 0));
    expect(result).toEqual({ kind: 'jackpot', amount: 50 });
    expect(progress.bamboo).toBe(100 - GACHA_COST + 50);
  });

  it('exclusives never appear in the pool', () => {
    const pool = gachaPool(defaultProgress());
    expect(pool.length).toBeGreaterThan(0);
    expect(pool.every((c) => !c.exclusive && c.cost > 0)).toBe(true);
  });
});
