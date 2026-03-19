import { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { EntityManager } from '../systems/EntityManager';
import { DuckCollisionSystem } from '../systems/DuckCollisionSystem';

/**
 * useDuckCollision Hook
 *
 * React hook wrapper for DuckCollisionSystem
 * Handles collision detection between objects and the duck
 */
export const useDuckCollision = (
  engine: Matter.Engine,
  entityManager: EntityManager,
  onDuckHit: () => void
) => {
  const systemRef = useRef<DuckCollisionSystem | null>(null);

  useEffect(() => {
    // Create collision system
    const system = new DuckCollisionSystem(engine, entityManager, onDuckHit);
    systemRef.current = system;

    // Start listening for collisions
    system.start();

    return () => {
      // Stop listening when unmounting
      system.stop();
    };
  }, [engine, entityManager, onDuckHit]);
};
