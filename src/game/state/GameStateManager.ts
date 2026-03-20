import {
  PlayerState,
  Duck,
  Egg,
  DuckVariant,
  DuckStats,
  RARITY_CLICK_REQUIREMENTS,
  RARITY_SELL_VALUES,
  STAT_MAX,
  StatType,
} from '../types/game';
import { rollRarity, generateId } from '../utils/rarityRoll';
import { saveGameState, debounce } from '../utils/persistence';

// Listener type for state changes
export type GameStateListener = (state: PlayerState) => void;

/**
 * GameStateManager
 *
 * Manages all game state following the EntityManager pattern from the codebase.
 * Uses pub/sub pattern for reactive updates.
 * Singleton pattern ensures all components share the same instance.
 */
export class GameStateManager {
  private static instance: GameStateManager | null = null;
  private state: PlayerState;
  private listeners = new Set<GameStateListener>();
  private debouncedSave: (state: PlayerState) => void;

  private constructor(initialState?: PlayerState) {
    this.state = initialState || this.getDefaultState();

    // Debounced auto-save (save 1 second after last change)
    this.debouncedSave = debounce((state: PlayerState) => {
      saveGameState(state);
    }, 1000);
  }

  /**
   * Get singleton instance
   */
  static getInstance(initialState?: PlayerState): GameStateManager {
    if (!GameStateManager.instance) {
      GameStateManager.instance = new GameStateManager(initialState);
    }
    return GameStateManager.instance;
  }

  /**
   * Reset singleton instance (for testing/debugging)
   */
  static resetInstance(): void {
    GameStateManager.instance = null;
  }

  /**
   * Get default initial state for new players
   */
  private getDefaultState(): PlayerState {
    // Generate first egg
    const variant = rollRarity();
    const firstEgg: Egg = {
      id: generateId('egg'),
      clicks: 0,
      clicksRequired: RARITY_CLICK_REQUIREMENTS[variant],
      variant,
    };

    return {
      clickPower: 1,      // 1 click per tap to start
      autoClickRate: 0,   // 0 auto-clicks per second (disabled initially)
      totalClicks: 0,
      eggs: [firstEgg],
      ducks: [],
      selectedDuckId: null,
      soldDucks: [],
      coins: 0,
    };
  }

  /**
   * Subscribe to state changes (pub/sub pattern)
   * Returns unsubscribe function
   */
  subscribe(listener: GameStateListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all listeners of state change
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener({ ...this.state }));
    // Auto-save on every change (debounced)
    this.debouncedSave(this.state);
  }

  /**
   * Get current state (read-only copy)
   */
  getState(): PlayerState {
    return { ...this.state };
  }

  /**
   * Click the egg (add clicks based on click power)
   */
  clickEgg(eggId: string): void {
    const egg = this.state.eggs.find((e) => e.id === eggId);
    if (!egg) return;

    egg.clicks = Math.min(egg.clicks + this.state.clickPower, egg.clicksRequired);
    this.state.totalClicks += this.state.clickPower;

    // Check if egg is ready to hatch
    if (egg.clicks >= egg.clicksRequired) {
      this.hatchEgg(eggId);
    }

    this.notifyListeners();
  }

  /**
   * Hatch an egg into a duck
   */
  private hatchEgg(eggId: string): void {
    const eggIndex = this.state.eggs.findIndex((e) => e.id === eggId);
    if (eggIndex === -1) return;

    const egg = this.state.eggs[eggIndex];

    // Create new duck
    const newDuck: Duck = {
      id: generateId('duck'),
      variant: egg.variant,
      stats: {
        fighting: 0,
        flying: 0,
        speed: 0,
        precision: 0,
      },
      isFullyLeveled: false,
      hatchedAt: Date.now(),
      position: { x: Math.random() * 300, y: 0 }, // Random starting position
    };

    // Add duck to collection
    this.state.ducks.push(newDuck);

    // Auto-select first duck
    if (!this.state.selectedDuckId) {
      this.state.selectedDuckId = newDuck.id;
    }

    // Remove hatched egg and spawn new one
    this.state.eggs.splice(eggIndex, 1);
    this.spawnNewEgg();

    this.notifyListeners();
  }

  /**
   * Spawn a new egg with random rarity
   */
  private spawnNewEgg(): void {
    const variant = rollRarity();
    const newEgg: Egg = {
      id: generateId('egg'),
      clicks: 0,
      clicksRequired: RARITY_CLICK_REQUIREMENTS[variant],
      variant,
    };

    this.state.eggs.push(newEgg);
  }

  /**
   * Select a duck for playing games
   */
  selectDuck(duckId: string | null): void {
    if (duckId === null || this.state.ducks.some((d) => d.id === duckId)) {
      this.state.selectedDuckId = duckId;
      this.notifyListeners();
    }
  }

  /**
   * Get currently selected duck
   */
  getSelectedDuck(): Duck | null {
    if (!this.state.selectedDuckId) return null;
    return this.state.ducks.find((d) => d.id === this.state.selectedDuckId) || null;
  }

  /**
   * Update duck stats after playing a game
   * @param duckId - Duck to update
   * @param stat - Which stat to increase
   * @param xpGain - Amount of XP to add (0-25)
   */
  updateDuckStat(duckId: string, stat: StatType, xpGain: number): void {
    const duck = this.state.ducks.find((d) => d.id === duckId);
    if (!duck) return;

    // Add XP, cap at STAT_MAX (100)
    duck.stats[stat] = Math.min(STAT_MAX, duck.stats[stat] + xpGain);

    // Check if duck is fully leveled
    duck.isFullyLeveled = Object.values(duck.stats).every((s) => s === STAT_MAX);

    this.notifyListeners();
  }

  /**
   * Sell a fully leveled duck for coins
   */
  sellDuck(duckId: string): boolean {
    const duckIndex = this.state.ducks.findIndex((d) => d.id === duckId);
    if (duckIndex === -1) return false;

    const duck = this.state.ducks[duckIndex];

    // Can only sell fully leveled ducks
    if (!duck.isFullyLeveled) return false;

    // Calculate sell value based on rarity
    const sellValue = RARITY_SELL_VALUES[duck.variant];
    this.state.coins += sellValue;

    // Move duck to sold collection
    this.state.soldDucks.push({ ...duck });

    // Remove from active ducks
    this.state.ducks.splice(duckIndex, 1);

    // Unselect if this was the selected duck
    if (this.state.selectedDuckId === duckId) {
      this.state.selectedDuckId = this.state.ducks.length > 0 ? this.state.ducks[0].id : null;
    }

    this.notifyListeners();
    return true;
  }

  /**
   * Purchase click power upgrade
   */
  purchaseClickPowerUpgrade(cost: number): boolean {
    if (this.state.coins < cost) return false;

    this.state.coins -= cost;
    this.state.clickPower += 1;

    this.notifyListeners();
    return true;
  }

  /**
   * Purchase auto-clicker upgrade
   */
  purchaseAutoClickerUpgrade(cost: number): boolean {
    if (this.state.coins < cost) return false;

    this.state.coins -= cost;
    this.state.autoClickRate += 1;

    this.notifyListeners();
    return true;
  }

  /**
   * Trigger auto-click (called by interval timer)
   */
  autoClick(): void {
    if (this.state.autoClickRate <= 0) return;
    if (this.state.eggs.length === 0) return;

    // Auto-click the first egg
    this.clickEgg(this.state.eggs[0].id);
  }

  /**
   * Update duck position (for walking animation)
   */
  updateDuckPosition(duckId: string, position: { x: number; y: number }): void {
    const duck = this.state.ducks.find((d) => d.id === duckId);
    if (!duck) return;

    duck.position = position;
    // Don't notify listeners for position updates (too frequent, handled by animation)
  }

  /**
   * Reset game state (for debugging)
   */
  reset(): void {
    this.state = this.getDefaultState();
    this.notifyListeners();
  }
}
