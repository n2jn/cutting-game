/**
 * Matter.js Collision Detector
 * Implements ICollisionDetector using Matter.js events
 */

import Matter from 'matter-js';
import { ICollisionDetector } from '../../application/ports/ICollisionDetector';
import { CollisionCallback, CollisionEvent } from '../../domain/operations/CollisionEvent';
import { MatterBodyAdapter } from './MatterBodyWrapper';

/**
 * Adapter that implements collision detection using Matter.js events
 */
export class MatterCollisionDetector implements ICollisionDetector {
  private startCallbacks: CollisionCallback[] = [];
  private endCallbacks: CollisionCallback[] = [];
  private isActive = false;

  private handleCollisionStart: (event: Matter.IEventCollision<Matter.Engine>) => void;
  private handleCollisionEnd: (event: Matter.IEventCollision<Matter.Engine>) => void;

  constructor(private engine: Matter.Engine) {
    // Create bound event handlers
    this.handleCollisionStart = this.createCollisionHandler('start');
    this.handleCollisionEnd = this.createCollisionHandler('end');
  }

  onCollisionStart(callback: CollisionCallback): void {
    this.startCallbacks.push(callback);
  }

  onCollisionEnd(callback: CollisionCallback): void {
    this.endCallbacks.push(callback);
  }

  start(): void {
    if (this.isActive) return;

    Matter.Events.on(this.engine, 'collisionStart', this.handleCollisionStart);
    Matter.Events.on(this.engine, 'collisionEnd', this.handleCollisionEnd);
    this.isActive = true;
  }

  stop(): void {
    if (!this.isActive) return;

    Matter.Events.off(this.engine, 'collisionStart', this.handleCollisionStart);
    Matter.Events.off(this.engine, 'collisionEnd', this.handleCollisionEnd);
    this.isActive = false;
  }

  /**
   * Create a collision event handler
   */
  private createCollisionHandler(
    type: 'start' | 'end'
  ): (event: Matter.IEventCollision<Matter.Engine>) => void {
    return (event: Matter.IEventCollision<Matter.Engine>) => {
      const callbacks = type === 'start' ? this.startCallbacks : this.endCallbacks;

      event.pairs.forEach((pair) => {
        const collisionEvent: CollisionEvent = {
          bodyA: MatterBodyAdapter.wrap(pair.bodyA),
          bodyB: MatterBodyAdapter.wrap(pair.bodyB),
          timestamp: Date.now(),
        };

        callbacks.forEach((cb) => cb(collisionEvent));
      });
    };
  }

  /**
   * Clear all callbacks
   */
  clearCallbacks(): void {
    this.startCallbacks = [];
    this.endCallbacks = [];
  }
}
