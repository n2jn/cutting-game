import { useEffect, useState, useRef } from 'react';
import Matter from 'matter-js';
import { EntityManager } from './EntityManager';
import { Entity } from './Entity.types';

/**
 * React hook for entity manager
 * Provides entities state that updates when entities change
 */
export function useEntityManager(world: Matter.World) {
  const managerRef = useRef<EntityManager | null>(null);
  const [entities, setEntities] = useState<Entity[]>([]);

  // Initialize manager once
  if (!managerRef.current) {
    managerRef.current = new EntityManager(world);
  }

  // Subscribe to changes
  useEffect(() => {
    const manager = managerRef.current!;

    const unsubscribe = manager.subscribe((entityMap) => {
      setEntities(Array.from(entityMap.values()));
    });

    // Set initial state
    setEntities(manager.getAll());

    return unsubscribe;
  }, []);

  return {
    manager: managerRef.current,
    entities,
  };
}
