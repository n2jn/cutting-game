import { useEffect, useRef } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { CuttingLine } from '../../../src/CuttingLine';
import { EntityFactory } from '../../../src/systems/EntityFactory';
import { CuttingSystem } from '../../../src/systems/CuttingSystem';
import { GameContainer } from '../../../src/components/GameContainer';
import { DuckDisplay } from '../../../src/components/DuckDisplay';
import {
  useHeartSystem,
  useScoreSystem,
  useGameSetup,
  useDuckCollision,
  usePhysicsLoop,
} from '../../../src/hooks';

/**
 * Physics Slicer Game - Dynamic Level Component
 *
 * Features:
 * - Heart system (3 hearts)
 * - Score based on objects sliced
 * - Fighting stat XP reward (0-25 based on performance)
 * - Level configurations with increasing difficulty
 */

const MAX_HEARTS = 3;
const SPAWN_INTERVAL = 3000; // Spawn new object every 3 seconds

export default function PhysicsSlicerLevel() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const levelId = parseInt(id || '1', 10);

  // Game setup (entities, duck, walls)
  const { entityManager, entities, gameManager, selectedDuck, duckEntity, width, height, world, engine } =
    useGameSetup();

  // Game systems
  const { hearts, maxHearts, isGameOver, loseHeart, reset: resetHearts } = useHeartSystem(MAX_HEARTS);
  const { score, xpGained, addScore, incrementTotalObjects, calculateAndAwardXP, reset: resetScore } =
    useScoreSystem();

  const cuttingSystemRef = useRef<CuttingSystem | null>(null);

  // Initialize cutting system
  if (!cuttingSystemRef.current) {
    cuttingSystemRef.current = new CuttingSystem(entityManager, world);
  }

  // Duck collision handling
  const handleDuckHit = () => {
    const gameOver = loseHeart();
    if (gameOver) {
      calculateAndAwardXP(gameManager, selectedDuck, 'fighting');
    }
  };

  useDuckCollision(engine, entityManager, handleDuckHit);

  // Physics loop
  usePhysicsLoop(engine, entityManager);

  // Spawn objects periodically
  useEffect(() => {
    if (isGameOver) return;

    const spawnObject = () => {
      const randomX = width * (0.2 + Math.random() * 0.6);
      const randomY = height * 0.2;

      // Random object type
      const objectType = Math.random();
      if (objectType < 0.5) {
        entityManager.register(EntityFactory.createBall(randomX, randomY, 20 + Math.random() * 20));
      } else {
        const size = 30 + Math.random() * 30;
        entityManager.register(EntityFactory.createBox(randomX, randomY, size, size));
      }

      incrementTotalObjects();
    };

    // Spawn initial object
    spawnObject();

    // Set up interval for spawning
    const interval = setInterval(spawnObject, SPAWN_INTERVAL);

    return () => clearInterval(interval);
  }, [entityManager, isGameOver, incrementTotalObjects, width, height]);

  // Check for objects falling off screen (lose heart)
  useEffect(() => {
    if (isGameOver) return;

    const checkInterval = setInterval(() => {
      const dynamicEntities = entityManager.getDynamic();

      dynamicEntities.forEach((entity) => {
        const body = entity.body;

        // Check if object fell off bottom of screen
        if (body.position.y > height + 100) {
          // Remove entity
          entityManager.remove(entity.id);

          // Lose a heart
          const gameOver = loseHeart();
          if (gameOver) {
            calculateAndAwardXP(gameManager, selectedDuck, 'fighting');
          }
        }
      });
    }, 100);

    return () => clearInterval(checkInterval);
  }, [entityManager, isGameOver, loseHeart, height, gameManager, selectedDuck, calculateAndAwardXP]);

  // Handle cutting (successful slice = score)
  const handleCut = (p1: any, p2: any) => {
    if (isGameOver) return;

    const result = cuttingSystemRef.current?.cut(p1, p2);

    // If we successfully cut something, add to score
    if (result && result.newEntities.length > 0) {
      addScore(result.newEntities.length);
    }
  };

  // Restart game
  const handleRestart = () => {
    // Clear all entities except walls and duck
    const allEntities = entityManager.getAll();
    allEntities.forEach((entity) => {
      if (entity.renderData.type !== 'wall' && entity.renderData.type !== 'duck') {
        entityManager.remove(entity.id);
      }
    });

    // Reset state
    resetHearts();
    resetScore();
  };

  return (
    <GameContainer
      hearts={hearts}
      maxHearts={maxHearts}
      score={score}
      level={levelId}
      isGameOver={isGameOver}
      xpGained={xpGained}
      selectedDuck={selectedDuck}
      statType="fighting"
      onRestart={handleRestart}
    >
      <CuttingLine entities={entities} onCut={handleCut} />
      <DuckDisplay duckEntity={duckEntity} />
    </GameContainer>
  );
}
