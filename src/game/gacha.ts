import { ALL_COSMETICS, Cosmetic } from '../data/cosmetics';
import type { Progress } from '../state/progress';

export const GACHA_COST = 30;
/** A cosmetic is guaranteed within this many pulls. */
export const GACHA_PITY = 5;

export type GachaResult =
  | { kind: 'bamboo'; amount: number }
  | { kind: 'jackpot'; amount: number }
  | { kind: 'cosmetic'; cosmetic: Cosmetic };

/** Buyable cosmetics the player doesn't own yet (exclusives never drop). */
export function gachaPool(p: Progress): Cosmetic[] {
  return ALL_COSMETICS.filter(
    (c) => !c.exclusive && c.cost > 0 && !p.ownedCosmetics.includes(c.id),
  );
}

/**
 * Pull one capsule. Costs GACHA_COST bamboo (caller must check affordability).
 * Odds: 20% cosmetic (guaranteed when the pity counter fills), 10% jackpot
 * bamboo, 30% medium bamboo, 40% small bamboo. When every cosmetic is owned,
 * the cosmetic slot pays 50 bamboo instead.
 */
export function pullCapsule(
  p: Progress,
  rng: () => number = Math.random,
): { progress: Progress; result: GachaResult } {
  const paid = { ...p, bamboo: p.bamboo - GACHA_COST };
  const pool = gachaPool(p);
  const roll = rng();
  const cosmeticHit = (p.gachaPity ?? 0) >= GACHA_PITY - 1 || roll < 0.2;

  if (cosmeticHit) {
    if (pool.length > 0) {
      const win = pool[Math.floor(rng() * pool.length)];
      return {
        progress: {
          ...paid,
          ownedCosmetics: [...paid.ownedCosmetics, win.id],
          gachaPity: 0,
        },
        result: { kind: 'cosmetic', cosmetic: win },
      };
    }
    // Everything owned — the capsule pays out generously instead.
    return {
      progress: { ...paid, bamboo: paid.bamboo + 50, gachaPity: 0 },
      result: { kind: 'jackpot', amount: 50 },
    };
  }

  const pity = (p.gachaPity ?? 0) + 1;
  if (roll < 0.3) {
    const amount = 60 + Math.floor(rng() * 41); // 60-100
    return {
      progress: { ...paid, bamboo: paid.bamboo + amount, gachaPity: pity },
      result: { kind: 'jackpot', amount },
    };
  }
  if (roll < 0.6) {
    const amount = 25 + Math.floor(rng() * 16); // 25-40
    return {
      progress: { ...paid, bamboo: paid.bamboo + amount, gachaPity: pity },
      result: { kind: 'bamboo', amount },
    };
  }
  const amount = 10 + Math.floor(rng() * 11); // 10-20
  return {
    progress: { ...paid, bamboo: paid.bamboo + amount, gachaPity: pity },
    result: { kind: 'bamboo', amount },
  };
}
