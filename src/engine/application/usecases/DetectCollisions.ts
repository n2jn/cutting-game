/**
 * Detect Collisions Use Case
 * Manages collision detection subscriptions
 */

import { CollisionCallback } from '../../domain/operations/CollisionEvent';
import { ICollisionDetector } from '../ports/ICollisionDetector';

/**
 * Use case for detecting and responding to collisions
 */
export class DetectCollisionsUseCase {
  constructor(private collisionDetector: ICollisionDetector) {}

  /**
   * Start listening for collisions with a callback
   * @returns Function to stop listening
   */
  start(onCollisionStart: CollisionCallback): () => void {
    this.collisionDetector.onCollisionStart(onCollisionStart);
    this.collisionDetector.start();

    return () => {
      this.collisionDetector.stop();
    };
  }

  /**
   * Start collision detection without callback
   * Useful when callbacks are already registered
   */
  startDetection(): void {
    this.collisionDetector.start();
  }

  /**
   * Stop collision detection
   */
  stopDetection(): void {
    this.collisionDetector.stop();
  }

  /**
   * Subscribe to collision start events
   */
  onCollisionStart(callback: CollisionCallback): void {
    this.collisionDetector.onCollisionStart(callback);
  }

  /**
   * Subscribe to collision end events (if supported)
   */
  onCollisionEnd(callback: CollisionCallback): void {
    if (this.collisionDetector.onCollisionEnd) {
      this.collisionDetector.onCollisionEnd(callback);
    }
  }
}
