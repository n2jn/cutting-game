import { useEffect } from 'react';
import Matter from 'matter-js';
import { PhysicsSync } from '../systems/PhysicsSync';
import { EntityManager } from '../systems/EntityManager';

/**
 * usePhysicsLoop Hook
 *
 * Runs the physics update loop at 60fps
 * Syncs Matter.js bodies with entity render data
 */
export const usePhysicsLoop = (engine: Matter.Engine, entityManager: EntityManager) => {
  useEffect(() => {
    let animationFrame: number;

    const update = () => {
      Matter.Engine.update(engine, 1000 / 60);
      PhysicsSync.updateAll(entityManager.getDynamic());
      animationFrame = requestAnimationFrame(update);
    };

    update();

    return () => cancelAnimationFrame(animationFrame);
  }, [engine, entityManager]);
};
