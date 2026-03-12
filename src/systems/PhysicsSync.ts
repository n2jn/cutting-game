import { vec } from '@shopify/react-native-skia';
import {
  Entity,
  BallRenderData,
  BoxRenderData,
  PathRenderData,
} from '../core/Entity.types';

/**
 * Synchronize physics body positions to render data
 * Called every frame (60fps) in the update loop
 */
export class PhysicsSync {
  /**
   * Update a single entity's render data from its physics body
   */
  static updateEntity(entity: Entity): void {
    if (!entity.body) return; // Skip walls and entities without bodies

    const { body, renderData } = entity;

    switch (renderData.type) {
      case 'ball':
        this.updateBall(body, renderData);
        break;
      case 'box':
        this.updateBox(body, renderData);
        break;
      case 'path':
        this.updatePath(body, renderData);
        break;
      // Walls are static, no update needed
    }
  }

  /**
   * Update all entities in batch
   */
  static updateAll(entities: Entity[]): void {
    entities.forEach((entity) => this.updateEntity(entity));
  }

  private static updateBall(
    body: Matter.Body,
    renderData: BallRenderData
  ): void {
    renderData.x.value = body.position.x;
    renderData.y.value = body.position.y;
  }

  private static updateBox(
    body: Matter.Body,
    renderData: BoxRenderData
  ): void {
    renderData.x.value = body.position.x;
    renderData.y.value = body.position.y;
    renderData.angle.value = [{ rotateZ: body.angle }];
    renderData.origin.value = {
      x: renderData.x.value + renderData.width / 2,
      y: renderData.y.value + renderData.height / 2,
    };
  }

  private static updatePath(
    body: Matter.Body,
    renderData: PathRenderData
  ): void {
    const { centroid } = renderData;

    // If centroid is (0, 0), path is already centered (from cut operation)
    // Otherwise, path uses offset positioning (from initial creation)
    if (centroid.x === 0 && centroid.y === 0) {
      renderData.x.value = body.position.x;
      renderData.y.value = body.position.y;
    } else {
      renderData.x.value = body.position.x - centroid.x;
      renderData.y.value = body.position.y - centroid.y;
    }

    renderData.angle.value = [{ rotateZ: body.angle }];
    renderData.origin.value = vec(
      body.position.x + centroid.x, 
      body.position.y + centroid.y,
    );
  }
}
