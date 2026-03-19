import { useState, useCallback, useRef } from 'react';
import { HeartSystem } from '../systems/HeartSystem';

/**
 * useHeartSystem Hook
 *
 * React hook wrapper for HeartSystem
 * Manages heart count and game over logic
 */
export const useHeartSystem = (maxHearts: number = 3) => {
  const systemRef = useRef<HeartSystem | null>(null);
  const [, forceUpdate] = useState({});

  // Initialize system once
  if (!systemRef.current) {
    systemRef.current = new HeartSystem(maxHearts);
  }

  const system = systemRef.current;

  /**
   * Lose a heart
   * Returns true if game is over after losing this heart
   */
  const loseHeart = useCallback(() => {
    const gameOver = system.loseHeart();
    forceUpdate({});
    return gameOver;
  }, [system]);

  /**
   * Gain a heart (optional power-up mechanic)
   * Cannot exceed maxHearts
   */
  const gainHeart = useCallback(() => {
    system.gainHeart();
    forceUpdate({});
  }, [system]);

  /**
   * Reset the heart system
   * Used when restarting the game
   */
  const reset = useCallback(() => {
    system.reset();
    forceUpdate({});
  }, [system]);

  /**
   * Manually trigger game over
   * Useful for other game over conditions
   */
  const triggerGameOver = useCallback(() => {
    system.triggerGameOver();
    forceUpdate({});
  }, [system]);

  return {
    hearts: system.getHearts(),
    maxHearts: system.getMaxHearts(),
    isGameOver: system.getIsGameOver(),
    loseHeart,
    gainHeart,
    reset,
    triggerGameOver,
  };
};
