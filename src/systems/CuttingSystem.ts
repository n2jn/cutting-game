import { SkPoint } from '@shopify/react-native-skia';
import Matter from 'matter-js';
import { Entity } from '../core/Entity.types';
import { EntityFactory } from '../core/EntityFactory';
import { EntityManager } from '../core/EntityManager';
import { cutBox } from '../utils/cutBox';

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
    const removedIds: string[] = [];
    const newEntities: Entity[] = [];
    let sourceEntity: Entity | undefined;

    // Use existing cutting logic - pass world
    const { newBodies, removedBodies } = cutBox(p1, p2, this.world);

    // Find and remove entities that were cut
    removedBodies.forEach((removedBody) => {
      const entity = this.manager.findByBodyId(removedBody.id);
      if (entity) {
        removedIds.push(entity.id);
        // Store reference to source entity before removing
        if (!sourceEntity) {
          sourceEntity = entity;
        }
        // Remove old entity (triggers state update)
        this.manager.remove(entity.id);
      }
    });

    // Create new entities from cut pieces
    newBodies.forEach((newBody) => {
      const newEntity = EntityFactory.createPathFromBody(
        newBody,
        sourceEntity?.id,
        sourceEntity?.metadata?.generation
      );
      newEntities.push(newEntity);
      // Register new entity (triggers state update)
      this.manager.register(newEntity);
    });

    return { removedIds, newEntities };
  }
}
