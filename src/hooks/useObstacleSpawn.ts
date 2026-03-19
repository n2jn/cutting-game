import { useState, useCallback, useRef } from 'react';
import Matter from 'matter-js';
import { EntityManager } from '../systems/EntityManager';
import { ObstacleSpawnSystem } from '../systems/ObstacleSpawnSystem';

/**
 * useObstacleSpawn Hook
 *
 * React hook wrapper for ObstacleSpawnSystem
 * Manages spawning and moving obstacles for runner games
 */
export const useObstacleSpawn = (
  entityManager: EntityManager,
  world: Matter.World,
  spawnX: number,
  groundY: number,
  speed: number = -3,
  minHeight: number = 40,
  maxHeight: number = 80
) => {
  const systemRef = useRef<ObstacleSpawnSystem | null>(null);
  const [, forceUpdate] = useState({});

  // Initialize system once
  if (!systemRef.current) {
    systemRef.current = new ObstacleSpawnSystem(
      entityManager,
      world,
      spawnX,
      groundY,
      speed,
      minHeight,
      maxHeight
    );
  }

  const system = systemRef.current;

  /**
   * Spawn a new obstacle
   */
  const spawnObstacle = useCallback(() => {
    const id = system.spawnObstacle();
    forceUpdate({});
    return id;
  }, [system]);

  /**
   * Update obstacles (remove off-screen ones)
   */
  const update = useCallback(
    (leftBoundary: number = -100) => {
      system.update(leftBoundary);
      forceUpdate({});
    },
    [system]
  );

  /**
   * Clear all obstacles
   */
  const clearAll = useCallback(() => {
    system.clearAll();
    forceUpdate({});
  }, [system]);

  /**
   * Set obstacle speed
   */
  const setSpeed = useCallback(
    (speed: number) => {
      system.setSpeed(speed);
      forceUpdate({});
    },
    [system]
  );

  return {
    obstacleCount: system.getObstacleCount(),
    obstacles: system.getObstacles(),
    speed: system.getSpeed(),
    spawnObstacle,
    update,
    clearAll,
    setSpeed,
  };
};
