import { ALL_COSMETICS, Cosmetic } from '../data/cosmetics';
import type { Progress } from '../state/progress';

export const GACHA_COST = 30;
/** A cosmetic is guaranteed within this many pulls. */
export const GACHA_PITY = 5;

/** Chance a capsule comes up shiny (doubled bamboo / bonus on cosmetics). */
export const SHINY_CHANCE = 0.06;
/** Extra bamboo paid alongside a shiny cosmetic drop. */
export const SHINY_COSMETIC_BONUS = 30;

export type GachaResult =
  | { kind: 'bamboo'; amount: number; shiny: boolean }
  | { kind: 'jackpot'; amount: number; shiny: boolean }
  | { kind: 'cosmetic'; cosmetic: Cosmetic; shiny: boolean };

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
      const shiny = rng() < SHINY_CHANCE;
      return {
        progress: {
          ...paid,
          bamboo: paid.bamboo + (shiny ? SHINY_COSMETIC_BONUS : 0),
          ownedCosmetics: [...paid.ownedCosmetics, win.id],
          gachaPity: 0,
        },
        result: { kind: 'cosmetic', cosmetic: win, shiny },
      };
    }
    // Everything owned — the capsule pays out generously instead.
    const shiny = rng() < SHINY_CHANCE;
    const amount = shiny ? 100 : 50;
    return {
      progress: { ...paid, bamboo: paid.bamboo + amount, gachaPity: 0 },
      result: { kind: 'jackpot', amount, shiny },
    };
  }

  const pity = (p.gachaPity ?? 0) + 1;
  const payout = (base: number, kind: 'bamboo' | 'jackpot'): { progress: Progress; result: GachaResult } => {
    const shiny = rng() < SHINY_CHANCE;
    const amount = shiny ? base * 2 : base;
    return {
      progress: { ...paid, bamboo: paid.bamboo + amount, gachaPity: pity },
      result: { kind, amount, shiny },
    };
  };
  if (roll < 0.3) return payout(60 + Math.floor(rng() * 41), 'jackpot'); // 60-100
  if (roll < 0.6) return payout(25 + Math.floor(rng() * 16), 'bamboo'); // 25-40
  return payout(10 + Math.floor(rng() * 11), 'bamboo'); // 10-20
}
