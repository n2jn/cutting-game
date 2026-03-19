import Matter from 'matter-js';
import { EntityManager } from './EntityManager';

/**
 * DuckCollisionSystem
 *
 * Handles collision detection between objects and the duck
 */
export class DuckCollisionSystem {
  private engine: Matter.Engine;
  private entityManager: EntityManager;
  private onDuckHit: () => void;
  private handleCollision: (event: Matter.IEventCollision<Matter.Engine>) => void;

  constructor(engine: Matter.Engine, entityManager: EntityManager, onDuckHit: () => void) {
    this.engine = engine;
    this.entityManager = entityManager;
    this.onDuckHit = onDuckHit;

    // Bind the collision handler
    this.handleCollision = this.createCollisionHandler();
  }

  /**
   * Create the collision handler function
   */
  private createCollisionHandler() {
    return (event: Matter.IEventCollision<Matter.Engine>) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;

        // Check if one of the bodies is the duck (sensor body)
        const duckBody = [bodyA, bodyB].find((body) => body.label === 'Circle Body' && body.isSensor);
        const otherBody = bodyA === duckBody ? bodyB : bodyA;

        if (duckBody && otherBody && !otherBody.isStatic) {
          // Object hit the duck!
          const entity = this.entityManager.getAll().find((e) => e.body === otherBody);
          if (entity) {
            // Remove the object
            this.entityManager.remove(entity.id);

            // Trigger callback
            this.onDuckHit();
          }
        }
      });
    };
  }

  /**
   * Start listening for collisions
   */
  start(): void {
    Matter.Events.on(this.engine, 'collisionStart', this.handleCollision);
  }

  /**
   * Stop listening for collisions
   */
  stop(): void {
    Matter.Events.off(this.engine, 'collisionStart', this.handleCollision);
  }
}
