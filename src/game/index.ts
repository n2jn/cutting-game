/**
 * Game layer exports
 * All duck breeding game-specific functionality
 */

// State
export { GameStateManager } from './state/GameStateManager';
export type { GameStateListener } from './state/GameStateManager';

// Gameplay Systems
export { HeartSystem } from './gameplay/HeartSystem';
export { ScoreSystem } from './gameplay/ScoreSystem';
export { DuckProtection } from './gameplay/DuckProtection';

// Types
export type {
  PlayerState,
  Duck,
  Egg,
  DuckVariant,
  DuckStats,
  StatType,
} from './types/game';
export {
  RARITY_CLICK_REQUIREMENTS,
  RARITY_SELL_VALUES,
  RARITY_COLORS,
  STAT_MAX,
} from './types/game';

// Utils
export { saveGameState, loadGameState, debounce } from './utils/persistence';
export { rollRarity, generateId } from './utils/rarityRoll';
