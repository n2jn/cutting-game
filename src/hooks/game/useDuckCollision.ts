import { useEffect, useRef } from 'react';
import { EntityService } from '@engine';
import { DuckProtection } from '@game';

/**
 * useDuckCollision Hook
 *
 * React hook wrapper for DuckProtection system
 * Handles collision detection between objects and the duck
 *
 * MIGRATED: Now uses EntityService from clean architecture
 */
export const useDuckCollision = (
  entityManager: EntityService,
  onDuckHit: () => void
) => {
  const systemRef = useRef<DuckProtection | null>(null);

  useEffect(() => {
    // Create duck protection system
    const system = new DuckProtection(entityManager, onDuckHit);
    systemRef.current = system;

    // Start listening for collisions
    system.start();

    return () => {
      // Stop listening when unmounting
      system.stop();
    };
  }, [entityManager, onDuckHit]);
};
