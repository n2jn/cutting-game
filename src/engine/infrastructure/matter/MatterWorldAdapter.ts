/**
 * Matter.js World Adapter
 * Implements PhysicsWorld using Matter.World
 */

import Matter from 'matter-js';
import { PhysicsWorld } from '../../domain/physics/PhysicsWorld';
import { PhysicsBody } from '../../domain/physics/PhysicsBody';
import { Vector2D } from '../../domain/geometry/Vector2D';
import { MatterBodyWrapper, MatterBodyAdapter } from './MatterBodyWrapper';

/**
 * Adapter that implements PhysicsWorld using Matter.World
 */
export class MatterWorldAdapter implements PhysicsWorld {
  private bodyMap = new Map<string, Matter.Body>();

  constructor(private matterWorld: Matter.World) {}

  get gravity(): Vector2D {
    return {
      x: this.matterWorld.gravity.x,
      y: this.matterWorld.gravity.y,
    };
  }

  set gravity(value: Vector2D) {
    this.matterWorld.gravity.x = value.x;
    this.matterWorld.gravity.y = value.y;
  }

  addBody(body: PhysicsBody): void {
    const matterBody = MatterBodyAdapter.unwrap(body);
    Matter.World.add(this.matterWorld, matterBody);
    this.bodyMap.set(body.id, matterBody);
  }

  removeBody(id: string): void {
    const matterBody = this.bodyMap.get(id);
    if (matterBody) {
      Matter.World.remove(this.matterWorld, matterBody);
      this.bodyMap.delete(id);
    }
  }

  getBodies(): PhysicsBody[] {
    return Matter.Composite.allBodies(this.matterWorld).map((b) =>
      MatterBodyAdapter.wrap(b)
    );
  }

  getBody(id: string): PhysicsBody | undefined {
    const matterBody = this.bodyMap.get(id);
    if (!matterBody) {
      // Try to find in world if not in map
      const found = Matter.Composite.allBodies(this.matterWorld).find(
        (b) => b.id.toString() === id
      );
      if (found) {
        this.bodyMap.set(id, found);
        return MatterBodyAdapter.wrap(found);
      }
      return undefined;
    }
    return MatterBodyAdapter.wrap(matterBody);
  }

  clear(): void {
    Matter.World.clear(this.matterWorld, false);
    this.bodyMap.clear();
  }

  /**
   * Get the underlying Matter.World
   * Only use for Matter.js-specific operations
   */
  getMatterWorld(): Matter.World {
    return this.matterWorld;
  }
}
