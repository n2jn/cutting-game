import { useEffect, useState } from 'react';
import { GameStateManager } from '../systems/GameStateManager';
import { PlayerState } from '../types/game';
import { loadGameState } from '../utils/persistence';

/**
 * useGameState Hook
 *
 * React hook for accessing game state, following the useEntityManager pattern.
 * Returns the GameStateManager instance and current state.
 */
export const useGameState = () => {
  const [state, setState] = useState<PlayerState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [manager, setManager] = useState<GameStateManager | null>(null);

  // Initialize manager on mount (singleton pattern)
  useEffect(() => {
    const initializeGameState = async () => {
      // Load saved state from AsyncStorage (only on first initialization)
      const savedState = await loadGameState();

      // Get singleton instance (creates it if doesn't exist)
      const managerInstance = GameStateManager.getInstance(savedState || undefined);
      setManager(managerInstance);

      // Subscribe to state changes
      const unsubscribe = managerInstance.subscribe((newState) => {
        setState(newState);
      });

      // Set initial state
      setState(managerInstance.getState());
      setIsLoading(false);

      // Cleanup subscription on unmount
      return unsubscribe;
    };

    initializeGameState();
  }, []);

  return {
    manager,
    state,
    isLoading,
  };
};

/**
 * Auto-clicker hook
 *
 * Handles the auto-click interval timer
 */
export const useAutoClicker = (manager: GameStateManager | null, autoClickRate: number) => {
  useEffect(() => {
    if (!manager || autoClickRate <= 0) return;

    // Set up interval for auto-clicking (1 click per second per rate)
    const interval = setInterval(() => {
      manager.autoClick();
    }, 1000); // Run every second

    return () => clearInterval(interval);
  }, [manager, autoClickRate]);
};
