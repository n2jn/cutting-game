import { useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { CuttingLine } from '@components/physics/CuttingLine';
import { EngineFacade, Line as CutLine } from '@engine';
import { GameContainer } from '@components/game/GameContainer';
import { DuckDisplay } from '@components/game/DuckDisplay';
import {
  useHeartSystem,
  useScoreSystem,
  useGameSetup,
  useDuckCollision,
  usePhysicsLoop,
} from '@hooks';

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
  const { entityManager, entities, gameManager, selectedDuck, duckEntity, width, height } =
    useGameSetup();

  // Game systems
  const { hearts, maxHearts, isGameOver, loseHeart, reset: resetHearts } = useHeartSystem(MAX_HEARTS);
  const { score, xpGained, addScore, incrementTotalObjects, calculateAndAwardXP, reset: resetScore } =
    useScoreSystem();

  // Duck collision handling
  const handleDuckHit = () => {
    // const gameOver = loseHeart();
    // if (gameOver) {
    //   calculateAndAwardXP(gameManager, selectedDuck, 'fighting');
    // }
  };

  useDuckCollision(entityManager, handleDuckHit);

  // Physics loop
  usePhysicsLoop();

  // Spawn objects periodically
  useEffect(() => {
    if (isGameOver) return;

    const spawnObject = () => {
      const randomX = width * (0.2 + Math.random() * 0.6);
      const randomY = height * 0.2;

      // Random object type
      const objectType = Math.random();
      if (objectType < 0.5) {
        const ball = EngineFacade.creator.createBall(
          { x: randomX, y: randomY },
          20 + Math.random() * 20,
          { isCuttable: true }
        );
        entityManager.register(ball);
      } else {
        const size = 30 + Math.random() * 30;
        const box = EngineFacade.creator.createBox(
          { x: randomX, y: randomY },
          size,
          size,
          { isCuttable: true }
        );
        entityManager.register(box);
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
        const body = entity.physicsBody;

        // Check if object fell off bottom of screen
        if (body && body.position.y > height + 100) {
          // Remove entity
          entityManager.remove(entity.id);

          // Lose a heart
          // const gameOver = loseHeart();
          // if (gameOver) {
          //   calculateAndAwardXP(gameManager, selectedDuck, 'fighting');
          // }
        }
      });
    }, 100);

    return () => clearInterval(checkInterval);
  }, [entityManager, isGameOver, loseHeart, height, gameManager, selectedDuck, calculateAndAwardXP]);

  // Handle cutting (successful slice = score)
  const handleCut = (p1: any, p2: any) => {
    if (isGameOver) return;

    // Convert SkPoints to domain Line type
    const line: CutLine = {
      start: { x: p1.x, y: p1.y },
      end: { x: p2.x, y: p2.y },
    };

    const result = EngineFacade.cutting.execute(line);

    // If we successfully cut something, add to score
    if (result.newEntities.length > 0) {
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
