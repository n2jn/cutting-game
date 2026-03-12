import { SkPoint } from '@shopify/react-native-skia';
import Matter from 'matter-js';
import { Entity } from '../core/Entity.types';
import { EntityFactory } from '../core/EntityFactory';
import { EntityManager } from '../core/EntityManager';
import { cutBox } from '../lib/cutBox';

export interface CutResult {
  removedIds: string[];
  newEntities: Entity[];
}

/**
 * System for handling cutting operations
 * Integrates with EntityManager for entity lifecycle
 */
export class CuttingSystem {
  private manager: EntityManager;
  private world: Matter.World;

  constructor(manager: EntityManager, world: Matter.World) {
    this.manager = manager;
    this.world = world;
  }

  /**
   * Perform cut along a line from p1 to p2
   * Returns IDs of removed entities and newly created entities
   */
  cut(p1: SkPoint, p2: SkPoint): CutResult {
    // Use existing cutting logic
    const { newBodies, removedBodies } = cutBox(p1, p2);

    const removedIds: string[] = [];
    const newEntities: Entity[] = [];

    // Find entities that were cut by matching body IDs
    removedBodies.forEach((removedBody) => {
      const entity = this.manager.findByBodyId(removedBody.id);
      if (entity) {
        removedIds.push(entity.id);

        // Create new entities from cut pieces
        newBodies.forEach((newBody) => {
          const newEntity = EntityFactory.createPathFromBody(
            newBody,
            entity.id,
            entity.metadata?.generation
          );
          newEntities.push(newEntity);
        });

        // Remove old entity
        this.manager.remove(entity.id);
      }
    });

    // Register new entities
    newEntities.forEach((entity) => this.manager.register(entity));

    return { removedIds, newEntities };
  }
}
