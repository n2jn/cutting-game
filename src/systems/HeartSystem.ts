/**
 * HeartSystem
 *
 * Core class for managing hearts/lives in games
 * Handles heart loss, gain, and game over detection
 */
export class HeartSystem {
  private hearts: number;
  private readonly maxHearts: number;
  private isGameOver: boolean = false;

  constructor(maxHearts: number = 3) {
    this.maxHearts = maxHearts;
    this.hearts = maxHearts;
  }

  /**
   * Get current hearts
   */
  getHearts(): number {
    return this.hearts;
  }

  /**
   * Get max hearts
   */
  getMaxHearts(): number {
    return this.maxHearts;
  }

  /**
   * Check if game is over
   */
  getIsGameOver(): boolean {
    return this.isGameOver;
  }

  /**
   * Lose a heart
   * Returns true if game is over after losing this heart
   */
  loseHeart(): boolean {
    if (this.isGameOver) return true;

    this.hearts = Math.max(0, this.hearts - 1);

    if (this.hearts <= 0) {
      this.isGameOver = true;
      return true;
    }

    return false;
  }

  /**
   * Gain a heart (optional power-up mechanic)
   * Cannot exceed maxHearts
   */
  gainHeart(): void {
    if (this.isGameOver) return;
    this.hearts = Math.min(this.hearts + 1, this.maxHearts);
  }

  /**
   * Reset the heart system
   * Used when restarting the game
   */
  reset(): void {
    this.hearts = this.maxHearts;
    this.isGameOver = false;
  }

  /**
   * Manually trigger game over
   * Useful for other game over conditions
   */
  triggerGameOver(): void {
    if (!this.isGameOver) {
      this.isGameOver = true;
      this.hearts = 0;
    }
  }
}
