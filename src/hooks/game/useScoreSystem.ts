import { useState, useCallback, useRef } from 'react';
import { ScoreSystem, GameStateManager, Duck, StatType } from '@game';

/**
 * useScoreSystem Hook
 *
 * React hook wrapper for ScoreSystem
 * Manages score tracking and XP calculation for games
 */
export const useScoreSystem = () => {
  const systemRef = useRef<ScoreSystem | null>(null);
  const [, forceUpdate] = useState({});

  // Initialize system once
  if (!systemRef.current) {
    systemRef.current = new ScoreSystem();
  }

  const system = systemRef.current;

  /**
   * Add points to score
   */
  const addScore = useCallback((points: number) => {
    system.addScore(points);
    forceUpdate({});
  }, [system]);

  /**
   * Increment total objects spawned
   */
  const incrementTotalObjects = useCallback(() => {
    system.incrementTotalObjects();
    forceUpdate({});
  }, [system]);

  /**
   * Calculate and award XP based on performance
   */
  const calculateAndAwardXP = useCallback(
    (
      gameManager: GameStateManager | null,
      duck: Duck | undefined,
      statType: StatType,
      maxXP: number = 25
    ) => {
      const xp = system.calculateAndAwardXP(gameManager, duck, statType, maxXP);
      forceUpdate({});
      return xp;
    },
    [system]
  );

  /**
   * Reset score system
   */
  const reset = useCallback(() => {
    system.reset();
    forceUpdate({});
  }, [system]);

  return {
    score: system.getScore(),
    totalObjects: system.getTotalObjects(),
    xpGained: system.getXpGained(),
    addScore,
    incrementTotalObjects,
    calculateAndAwardXP,
    reset,
  };
};
