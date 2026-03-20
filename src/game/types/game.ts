/**
 * Game State Types for Duck Clicker Game
 */

// Duck variant/rarity types
export type DuckVariant = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

// Duck stats - each maxes at 100 XP
export interface DuckStats {
  fighting: number;   // Physics Slicer game (0-100)
  flying: number;     // Gravity Runner game (0-100)
  speed: number;      // Rhythm Master game (0-100)
  precision: number;  // Slingshot game (0-100)
}

// Individual duck instance
export interface Duck {
  id: string;
  variant: DuckVariant;
  stats: DuckStats;
  isFullyLeveled: boolean;  // true when all stats = 100
  hatchedAt: number;        // timestamp
  position: { x: number; y: number };  // for walking animation
}

// Egg state
export interface Egg {
  id: string;
  clicks: number;
  clicksRequired: number;  // varies by rarity
  variant: DuckVariant;    // predetermined on spawn
}

// Player progression state
export interface PlayerState {
  clickPower: number;           // clicks added per tap
  autoClickRate: number;        // auto-clicks per second (0 = disabled)
  totalClicks: number;          // lifetime clicks
  eggs: Egg[];                  // current eggs (start with 1)
  ducks: Duck[];                // hatched ducks
  selectedDuckId: string | null; // which duck is selected for games
  soldDucks: Duck[];            // museum collection
  coins: number;                // currency from selling ducks
}

// Rarity configuration
export const RARITY_CHANCES: Record<DuckVariant, number> = {
  common: 0.50,      // 50%
  uncommon: 0.30,    // 30%
  rare: 0.15,        // 15%
  epic: 0.04,        // 4%
  legendary: 0.01,   // 1%
};

export const RARITY_CLICK_REQUIREMENTS: Record<DuckVariant, number> = {
  common: 50,
  uncommon: 75,
  rare: 100,
  epic: 150,
  legendary: 200,
};

export const RARITY_SELL_VALUES: Record<DuckVariant, number> = {
  common: 10,
  uncommon: 20,
  rare: 50,
  epic: 100,
  legendary: 200,
};

// Rarity colors for UI
export const RARITY_COLORS: Record<DuckVariant, string> = {
  common: '#9e9e9e',      // Gray
  uncommon: '#4caf50',    // Green
  rare: '#2196f3',        // Blue
  epic: '#9c27b0',        // Purple
  legendary: '#ff9800',   // Orange/Gold
};

// Game stat configuration
export const STAT_MAX = 100;
export const STAT_XP_PER_GAME = 25;

// Game stat type
export type StatType = 'fighting' | 'flying' | 'speed' | 'precision';

// Game-to-stat mapping
export const GAME_STAT_MAP: Record<string, StatType> = {
  'physics-slicer': 'fighting',
  'gravity-runner': 'flying',
  'rhythm-master': 'speed',
  'slingshot': 'precision',
};
