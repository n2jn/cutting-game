/**
 * Perform Cut Use Case
 * Orchestrates the cutting operation
 * Replaces the old performCut function
 */

import { Line } from '../../domain/geometry/Line';
import { CuttingOperation, CutResult } from '../../domain/operations/CuttingOperation';
import { Entity } from '../../domain/entities/Entity';
import { EntityService } from '../services/EntityService';
import { IPhysicsEngine } from '../ports/IPhysicsEngine';
import { IReactiveSystem } from '../ports/IReactiveSystem';
import { PolygonOperations } from '../../domain/geometry/Polygon';

export interface CutResultWithEntities {
  removedIds: string[];
  newEntities: Entity[];
}

/**
 * Use case for performing cutting operations
 * Handles both physics cutting and entity management
 */
export class PerformCutUseCase {
  constructor(
    private cuttingOperation: CuttingOperation,
    private entityService: EntityService,
    private physicsEngine: IPhysicsEngine,
    private reactiveSystem: IReactiveSystem
  ) {}

  /**
   * Execute a cutting operation along a line
   * @param line The cutting line (domain type, not SkPoint!)
   * @returns Removed entity IDs and newly created entities
   */
  execute(line: Line): CutResultWithEntities {
    const removedIds: string[] = [];
    const newEntities: Entity[] = [];

    // Get bodies that intersect the cut line
    const bodiesToCut = this.physicsEngine.raycastLine(line);

    // Filter to only cuttable entities
    const cuttableEntities = bodiesToCut
      .map((body) => this.entityService.findByBodyId(body.id))
      .filter(
        (entity): entity is Entity =>
          entity !== undefined && entity.metadata?.isCuttable === true
      );

    if (cuttableEntities.length === 0) {
      return { removedIds, newEntities };
    }

    // Perform cutting operation (physics layer)
    const cutResults = this.cuttingOperation.cut(
      line,
      cuttableEntities.map((e) => e.physicsBody!).filter((b) => b !== null)
    );

    // Process cut results
    cutResults.forEach((result) => {
      // Find the original entity
      const oldEntity = this.entityService.findByBodyId(result.originalBody.id);
      if (!oldEntity) return;

      // Remove old entity
      removedIds.push(oldEntity.id);
      this.entityService.remove(oldEntity.id);

      // Create new entities from cut pieces
      result.newBodies.forEach((newBody) => {
        const newEntity = this.createEntityFromCutBody(newBody, oldEntity);
        newEntities.push(newEntity);
        this.entityService.register(newEntity);
      });
    });

    return { removedIds, newEntities };
  }

  /**
   * Create an entity from a cut physics body
   * Inherits metadata from parent entity
   */
  private createEntityFromCutBody(
    body: Entity['physicsBody'],
    parent: Entity
  ): Entity {
    if (!body) {
      throw new Error('Cannot create entity from null body');
    }

    // Calculate bounds for the polygon
    const bounds = PolygonOperations.getBounds(body.vertices);

    // Create path centered at body position (body.position is already the centroid from Matter.js)
    // Make vertices relative to body position for rendering
    const centeredVertices = PolygonOperations.makeRelativeToPoint(
      body.vertices,
      body.position
    );
    const path = this.reactiveSystem.pathFactory.createFromVertices(
      centeredVertices
    );

    return {
      id: `polygon-cut-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'polygon',
      physicsBody: body,
      renderData: {
        type: 'polygon',
        position: this.reactiveSystem.reactiveValueFactory.create(body.position),
        angle: this.reactiveSystem.reactiveValueFactory.create(body.angle),
        rotationOrigin: this.reactiveSystem.reactiveValueFactory.create(
          body.position
        ),
        path,
        centroid: { x: 0, y: 0 }, // Centered path has centroid at origin
        width: bounds.width,
        height: bounds.height,
      },
      metadata: {
        ...parent.metadata,
        parentId: parent.id,
        generation: (parent.metadata?.generation ?? 0) + 1,
        createdAt: Date.now(),
      },
    };
  }
}
