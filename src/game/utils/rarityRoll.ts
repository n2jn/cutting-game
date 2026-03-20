import { DuckVariant, RARITY_CHANCES } from '../types/game';

/**
 * Weighted random rarity roll
 * Returns a duck variant based on probability weights
 */
export function rollRarity(): DuckVariant {
  const random = Math.random();
  let cumulativeProbability = 0;

  // Check probabilities in reverse order (legendary → common)
  // This ensures rarer variants are checked first
  const variants: DuckVariant[] = ['legendary', 'epic', 'rare', 'uncommon', 'common'];

  for (const variant of variants) {
    cumulativeProbability += RARITY_CHANCES[variant];
    if (random < cumulativeProbability) {
      return variant;
    }
  }

  // Fallback (should never reach here if probabilities sum to 1)
  return 'common';
}

/**
 * Generate a unique ID with optional prefix
 */
export function generateId(prefix: string = 'item'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
