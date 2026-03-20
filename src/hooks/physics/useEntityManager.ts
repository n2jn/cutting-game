import { useEffect, useState } from 'react';
import { EngineFacade, Entity } from '@engine';

/**
 * React hook for entity manager
 * Provides entities state that updates when entities change
 *
 * MIGRATED: Now uses EngineFacade from clean architecture
 */
export function useEntityManager() {
  const [entities, setEntities] = useState<Entity[]>([]);

  // Subscribe to changes
  useEffect(() => {
    const unsubscribe = EngineFacade.entities.subscribe((entityMap) => {
      console.log(Array.from(entityMap.values()));
      setEntities(Array.from(entityMap.values()));
    });

    return unsubscribe;
  }, []);

  return {
    manager: EngineFacade.entities,
    entities,
  };
}
