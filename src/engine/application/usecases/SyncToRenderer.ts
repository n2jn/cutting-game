/**
 * Sync To Renderer Use Case
 * Synchronizes physics body positions to reactive render data
 * Replaces the old PhysicsSync class
 */

import { Entity } from '../../domain/entities/Entity';
import {
  BallRenderData,
  BoxRenderData,
  PolygonRenderData,
  DuckRenderData,
} from '../../domain/entities/RenderData';
import { PhysicsBody } from '../../domain/physics/PhysicsBody';

/**
 * Use case for syncing physics to render data
 * Called every frame (60fps) in the update loop
 */
export class SyncToRendererUseCase {
  /**
   * Update a single entity's render data from its physics body
   */
  syncEntity(entity: Entity): void {
    if (!entity.physicsBody) return; // Skip walls and entities without bodies

    const { physicsBody, renderData } = entity;

    switch (renderData.type) {
      case 'ball':
        this.syncBall(physicsBody, renderData);
        break;
      case 'box':
        this.syncBox(physicsBody, renderData);
        break;
      case 'polygon':
        this.syncPolygon(physicsBody, renderData);
        break;
      case 'duck':
        this.syncDuck(physicsBody, renderData);
        break;
      // Walls are static, no update needed
    }
  }

  /**
   * Update all entities in batch
   */
  syncAll(entities: Entity[]): void {
    entities.forEach((entity) => this.syncEntity(entity));
  }

  /**
   * Sync ball render data
   * Ball position is at the center
   */
  private syncBall(body: PhysicsBody, renderData: BallRenderData): void {
    renderData.position.value = body.position;
  }

  /**
   * Sync box render data
   * Box renders from top-left, so offset by half width/height
   */
  private syncBox(body: PhysicsBody, renderData: BoxRenderData): void {
    // body.position is at the centroid
    // Boxes render from top-left, so offset by half width/height
    renderData.position.value = {
      x: body.position.x - renderData.width / 2,
      y: body.position.y - renderData.height / 2,
    };
    renderData.angle.value = body.angle;
    // Rotation origin should be at the centroid (center of the box)
    renderData.rotationOrigin.value = body.position;
  }

  /**
   * Sync polygon render data
   * Handles centroid offset for proper rotation
   */
  private syncPolygon(body: PhysicsBody, renderData: PolygonRenderData): void {
    const { centroid } = renderData;

    // If centroid is (0, 0), path is already centered (from cut operation)
    // Otherwise, path uses offset positioning (from initial creation)
    renderData.position.value = {
      x: body.position.x - centroid.x,
      y: body.position.y - centroid.y,
    };

    renderData.angle.value = body.angle;
    renderData.rotationOrigin.value = {
      x: body.position.x,
      y: body.position.y,
    };
  }

  /**
   * Sync duck render data
   * Duck position is at the center
   */
  private syncDuck(body: PhysicsBody, renderData: DuckRenderData): void {
    renderData.position.value = body.position;
  }
}
