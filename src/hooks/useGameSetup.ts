import { useEffect } from 'react';
import { useEntityManager } from './useEntityManager';
import { useGameState } from './useGameState';
import { EntityFactory } from '../systems/EntityFactory';
import { engine, world, width, height } from '../systems/physics';
import { RARITY_COLORS } from '../types/game';

/**
 * useGameSetup Hook
 *
 * Handles common game initialization:
 * - Entity manager
 * - Game state manager
 * - Wall creation
 * - Duck entity creation
 */
export const useGameSetup = () => {
  const { manager: entityManager, entities } = useEntityManager(world);
  const { manager: gameManager, state: gameState } = useGameState();
  const selectedDuck = gameState?.ducks.find((d) => d.id === gameState.selectedDuckId);
  const duckEntity = entities.find((e) => e.type === 'duck');

  // Initialize walls and duck (runs once)
  useEffect(() => {
    const statusBarHeight = 20;

    // Create boundary walls
    entityManager.register(EntityFactory.createWall(0, 0, 20, height)); // Left
    entityManager.register(EntityFactory.createWall(width - 20, 0, 20, height)); // Right
    entityManager.register(EntityFactory.createWall(0, 0, width, statusBarHeight)); // Top
    entityManager.register(EntityFactory.createWall(0, height - statusBarHeight, width, statusBarHeight)); // Bottom

    // Create duck entity if we have a selected duck
    if (selectedDuck) {
      const duckX = 50;
      const duckY = height - 80;
      const duckRadius = 30;
      const rarityColor = RARITY_COLORS[selectedDuck.variant];

      entityManager.register(EntityFactory.createDuck(duckX, duckY, duckRadius, rarityColor));
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
    engine,
    world,
    width,
    height,
  };
};
