import { vec } from '@shopify/react-native-skia';
import {
  Entity,
  BallRenderData,
  BoxRenderData,
  PathRenderData,
  DuckRenderData,
} from './Entity.types';

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
      case 'duck':
        this.updateDuck(body, renderData);
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
    // body.position is at the centroid
    // Boxes render from top-left, so offset by half width/height
    renderData.x.value = body.position.x - renderData.width / 2;
    renderData.y.value = body.position.y - renderData.height / 2;
    renderData.angle.value = [{ rotateZ: body.angle }];
    // Rotation origin should be at the centroid (center of the box)
    renderData.origin.value = vec(body.position.x, body.position.y);
  }

  private static updatePath(
    body: Matter.Body,
    renderData: PathRenderData
  ): void {
    const { centroid } = renderData;

    // If centroid is (0, 0), path is already centered (from cut operation)
    // Otherwise, path uses offset positioning (from initial creation)
    renderData.x.value = body.position.x - centroid.x;
    renderData.y.value = body.position.y - centroid.y;

    renderData.angle.value = [{ rotateZ: body.angle }];
    renderData.origin.value = vec(
      body.position.x + centroid.x,
      body.position.y + centroid.y,
    );
  }

  private static updateDuck(
    body: Matter.Body,
    renderData: DuckRenderData
  ): void {
    renderData.x.value = body.position.x;
    renderData.y.value = body.position.y;
  }
}
