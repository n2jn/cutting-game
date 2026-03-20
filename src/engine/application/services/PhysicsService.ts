/**
 * Physics Service
 * Handles physics simulation updates
 */

import { IPhysicsEngine } from '../ports/IPhysicsEngine';
import { Vector2D } from '../../domain/geometry/Vector2D';

/**
 * Service for managing physics simulation
 */
export class PhysicsService {
  constructor(private physicsEngine: IPhysicsEngine) {}

  /**
   * Update physics simulation
   * @param deltaTime Time step in milliseconds (typically 1000/60 for 60fps)
   */
  update(deltaTime: number): void {
    this.physicsEngine.update(deltaTime);
  }

  /**
   * Set gravity for the physics world
   */
  setGravity(gravity: Vector2D): void {
    this.physicsEngine.setGravity(gravity);
  }

  /**
   * Get current gravity
   */
  getGravity(): Vector2D {
    return this.physicsEngine.world.gravity;
  }
}
