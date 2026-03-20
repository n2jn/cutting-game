/**
 * Create Entity Use Case
 * Replaces EntityFactory with dependency injection
 */

import { Entity, EntityType } from '../../domain/entities/Entity';
import { BodyDefinition } from '../../domain/physics/PhysicsBody';
import { Vector2D } from '../../domain/geometry/Vector2D';
import { PolygonOperations } from '../../domain/geometry/Polygon';
import { IPhysicsEngine } from '../ports/IPhysicsEngine';
import { IReactiveSystem } from '../ports/IReactiveSystem';
import { EntityMetadata } from '../../domain/entities/EntityMetadata';

/**
 * Use case for creating game entities
 * Uses abstract factories instead of direct dependencies
 */
export class CreateEntityUseCase {
  constructor(
    private physicsEngine: IPhysicsEngine,
    private reactiveSystem: IReactiveSystem
  ) {}

  /**
   * Create a ball entity
   */
  createBall(
    position: Vector2D,
    radius: number,
    metadata?: EntityMetadata
  ): Entity {
    const bodyDef: BodyDefinition = {
      shape: 'circle',
      position,
      radius,
      density: 0.004,
      restitution: 0.9,
      friction: 0.1,
      frictionAir: 0.01,
    };

    const physicsBody = this.physicsEngine.createBody(bodyDef);

    return {
      id: this.generateId('ball'),
      type: 'ball',
      physicsBody,
      renderData: {
        type: 'ball',
        position: this.reactiveSystem.reactiveValueFactory.create(position),
        radius,
      },
      metadata,
    };
  }

  /**
   * Create a box entity
   */
  createBox(
    position: Vector2D,
    width: number,
    height: number,
    metadata?: EntityMetadata
  ): Entity {
    const bodyDef: BodyDefinition = {
      shape: 'rectangle',
      position,
      width,
      height,
      density: 0.004,
      restitution: 0.6,
      friction: 0.8,
      frictionAir: 0.01,
    };

    const physicsBody = this.physicsEngine.createBody(bodyDef);

    return {
      id: this.generateId('box'),
      type: 'box',
      physicsBody,
      renderData: {
        type: 'box',
        position: this.reactiveSystem.reactiveValueFactory.create({
          x: position.x - width / 2,
          y: position.y - height / 2,
        }),
        angle: this.reactiveSystem.reactiveValueFactory.create(0),
        rotationOrigin: this.reactiveSystem.reactiveValueFactory.create(position),
        width,
        height,
      },
      metadata,
    };
  }

  /**
   * Create a polygon entity from vertices
   */
  createPolygon(
    vertices: Vector2D[],
    position: Vector2D,
    metadata?: EntityMetadata
  ): Entity {
    const bodyDef: BodyDefinition = {
      shape: 'polygon',
      position,
      vertices,
      density: 0.004,
      restitution: 0.6,
      friction: 0.8,
      frictionAir: 0.01,
    };

    const physicsBody = this.physicsEngine.createBody(bodyDef);

    // Calculate centroid and bounds
    const centroid = PolygonOperations.calculateCentroid(vertices);
    const bounds = PolygonOperations.getBounds(vertices);

    // Create path from vertices (relative to position)
    const relativeVertices = PolygonOperations.makeRelativeToPoint(
      vertices,
      position
    );
    const path = this.reactiveSystem.pathFactory.createFromVertices(
      relativeVertices
    );

    return {
      id: this.generateId('polygon'),
      type: 'polygon',
      physicsBody,
      renderData: {
        type: 'polygon',
        position: this.reactiveSystem.reactiveValueFactory.create({
          x: position.x - centroid.x,
          y: position.y - centroid.y,
        }),
        angle: this.reactiveSystem.reactiveValueFactory.create(0),
        rotationOrigin: this.reactiveSystem.reactiveValueFactory.create(position),
        path,
        centroid,
        width: bounds.width,
        height: bounds.height,
      },
      metadata,
    };
  }

  /**
   * Create a wall entity (static, no physics body)
   */
  createWall(
    position: Vector2D,
    width: number,
    height: number,
    metadata?: EntityMetadata
  ): Entity {
    const bodyDef: BodyDefinition = {
      shape: 'rectangle',
      position,
      width,
      height,
      isStatic: true,
    };

    const physicsBody = this.physicsEngine.createBody(bodyDef);

    return {
      id: this.generateId('wall'),
      type: 'wall',
      physicsBody,
      renderData: {
        type: 'wall',
        position,
        width,
        height,
      },
      metadata,
    };
  }

  /**
   * Create a duck entity (player character)
   */
  createDuck(
    position: Vector2D,
    radius: number,
    rarityColor: string,
    metadata?: EntityMetadata
  ): Entity {
    const bodyDef: BodyDefinition = {
      shape: 'circle',
      position,
      radius,
      isSensor: true, // Duck is a sensor for collision detection
      isStatic: false,
    };

    const physicsBody = this.physicsEngine.createBody(bodyDef);

    return {
      id: this.generateId('duck'),
      type: 'duck',
      physicsBody,
      renderData: {
        type: 'duck',
        position: this.reactiveSystem.reactiveValueFactory.create(position),
        radius,
        rarityColor,
      },
      metadata: {
        ...metadata,
        isDuck: true,
      },
    };
  }

  /**
   * Generate unique entity ID
   */
  private generateId(prefix: EntityType): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
