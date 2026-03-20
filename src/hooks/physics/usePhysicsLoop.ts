import { useEffect } from 'react';
import { EngineFacade } from '@engine';

/**
 * usePhysicsLoop Hook
 *
 * Runs the physics update loop at 60fps
 * Syncs physics bodies with entity render data
 *
 * MIGRATED: Now uses EngineFacade from clean architecture
 */
export const usePhysicsLoop = () => {
  useEffect(() => {
    let animationFrame: number;
    const DELTA_TIME = 1000 / 60;

    const update = () => {
      // Get current entities
      const entities = EngineFacade.entities.getAll();

      // Update physics
      EngineFacade.updater.execute(DELTA_TIME, entities);

      // Sync to renderer
      EngineFacade.sync.syncAll(entities);

      animationFrame = requestAnimationFrame(update);
    };

    update();

    return () => cancelAnimationFrame(animationFrame);
  }, []); // No dependencies needed - EngineFacade is singleton
};
