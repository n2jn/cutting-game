import { useEffect } from 'react';
import { useEntityManager } from '@hooks/physics/useEntityManager';
import { useGameState } from './useGameState';
import { EngineFacade, width, height } from '@engine';
import { RARITY_COLORS } from '@game';

/**
 * useGameSetup Hook
 *
 * Handles common game initialization:
 * - Entity manager
 * - Game state manager
 * - Wall creation
 * - Duck entity creation
 *
 * MIGRATED: Now uses EngineFacade from clean architecture
 */
export const useGameSetup = () => {
  const { manager: entityManager, entities } = useEntityManager();
  const { manager: gameManager, state: gameState } = useGameState();
  const selectedDuck = gameState?.ducks.find((d) => d.id === gameState.selectedDuckId);
  const duckEntity = entities.find((e) => e.type === 'duck');

  // Initialize walls and duck (runs once)
  useEffect(() => {
    const statusBarHeight = 20;

    // Create boundary walls using EngineFacade.creator
    // Note: position is the CENTER of the wall in Matter.js
    entityManager.register(
      EngineFacade.creator.createWall({ x: 10, y: height / 2 }, 20, height)
    ); // Left
    entityManager.register(
      EngineFacade.creator.createWall({ x: width - 10, y: height / 2 }, 20, height)
    ); // Right
    entityManager.register(
      EngineFacade.creator.createWall({ x: width / 2, y: statusBarHeight / 2 }, width, statusBarHeight)
    ); // Top
    entityManager.register(
      EngineFacade.creator.createWall({ x: width / 2, y: height - statusBarHeight / 2 }, width, statusBarHeight)
    ); // Bottom

    // Create duck entity if we have a selected duck
    if (selectedDuck) {
      const duckX = 50;
      const duckY = height - 80;
      const duckRadius = 30;
      const rarityColor = RARITY_COLORS[selectedDuck.variant];

      entityManager.register(
        EngineFacade.creator.createDuck({ x: duckX, y: duckY }, duckRadius, rarityColor)
      );
    }

    return () => {
      // Cleanup handled by EntityManager
    };
  }, [entityManager, selectedDuck]);

  return {
    entityManager,
    entities,
    gameManager,
    gameState,
    selectedDuck,
    duckEntity,
    width,
    height,
  };
};
