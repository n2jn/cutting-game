/**
 * Collision Detector Port
 * Interface for collision detection system
 */

import { CollisionCallback } from '../../domain/operations/CollisionEvent';

/**
 * Port for collision detection
 * Allows subscribing to collision events without knowing the implementation
 */
export interface ICollisionDetector {
  /**
   * Subscribe to collision start events
   */
  onCollisionStart(callback: CollisionCallback): void;

  /**
   * Subscribe to collision end events
   */
  onCollisionEnd?(callback: CollisionCallback): void;

  /**
   * Start listening for collisions
   */
  start(): void;

  /**
   * Stop listening for collisions
   */
  stop(): void;
}
