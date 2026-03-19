import { GameStateManager } from './GameStateManager';
import { Duck, StatType } from '../types/game';

/**
 * ScoreSystem
 *
 * Core class for managing score and XP calculation
 */
export class ScoreSystem {
  private score: number = 0;
  private totalObjects: number = 0;
  private xpGained: number = 0;

  /**
   * Get current score
   */
  getScore(): number {
    return this.score;
  }

  /**
   * Get total objects spawned
   */
  getTotalObjects(): number {
    return this.totalObjects;
  }

  /**
   * Get XP gained
   */
  getXpGained(): number {
    return this.xpGained;
  }

  /**
   * Add points to score
   */
  addScore(points: number): void {
    this.score += points;
  }

  /**
   * Increment total objects spawned
   */
  incrementTotalObjects(): void {
    this.totalObjects++;
  }

  /**
   * Calculate and award XP based on performance
   * Performance = score / totalObjects (0-1 scale)
   * XP = performance * maxXP (default 25)
   */
  calculateAndAwardXP(
    gameManager: GameStateManager | null,
    duck: Duck | undefined,
    statType: StatType,
    maxXP: number = 25
  ): number {
    if (!gameManager || !duck) return 0;

    const performance = Math.min(this.score / Math.max(this.totalObjects, 1), 1);
    const xp = Math.floor(performance * maxXP);
    this.xpGained = xp;

    // Award XP to duck
    gameManager.updateDuckStat(duck.id, statType, xp);

    return xp;
  }

  /**
   * Reset score system
   */
  reset(): void {
    this.score = 0;
    this.totalObjects = 0;
    this.xpGained = 0;
  }
}
