/**
 * Abstract physics world interface
 * No dependency on matter-js
 */

import { PhysicsBody } from './PhysicsBody';
import { Vector2D } from '../geometry/Vector2D';

/**
 * Abstract physics world
 * Container for all physics bodies and simulation state
 */
export interface PhysicsWorld {
  gravity: Vector2D;

  /**
   * Add a body to the world
   */
  addBody(body: PhysicsBody): void;

  /**
   * Remove a body from the world
   */
  removeBody(id: string): void;

  /**
   * Get all bodies in the world
   */
  getBodies(): PhysicsBody[];

  /**
   * Get a body by ID
   */
  getBody(id: string): PhysicsBody | undefined;

  /**
   * Clear all bodies from the world
   */
  clear(): void;
}
