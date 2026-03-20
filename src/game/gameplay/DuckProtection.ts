import { EntityService, EngineFacade, CollisionEvent } from '@engine';

/**
 * Duck Protection System
 *
 * Game-specific logic: detects when objects hit the duck (sensor)
 * and triggers damage/heart loss
 *
 * MIGRATED: Now uses EngineFacade from clean architecture
 */
export class DuckProtection {
  private entityManager: EntityService;
  private onDuckHit: () => void;
  private unsubscribe: (() => void) | null = null;

  constructor(
    entityManager: EntityService,
    onDuckHit: () => void
  ) {
    this.entityManager = entityManager;
    this.onDuckHit = onDuckHit;
  }

  /**
   * Handle collision event
   * Check if one is the duck sensor
   */
  private handleCollision(event: CollisionEvent): void {
    const { bodyA, bodyB } = event;

    // Check if one of the bodies is the duck (sensor body)
    const duckBody = [bodyA, bodyB].find(
      (body) => body.isSensor && !body.isStatic
    );
    const otherBody = bodyA.id === duckBody?.id ? bodyB : bodyA;

    if (duckBody && otherBody && !otherBody.isStatic) {
      // Object hit the duck!
      const entity = this.entityManager.getAll().find(
        (e) => e.physicsBody?.id === otherBody.id
      );
      if (entity) {
        // Remove the object
        this.entityManager.remove(entity.id);

        // Trigger damage callback
        this.onDuckHit();
      }
    }
  }

  /**
   * Start listening for duck collisions
   */
  start(): void {
    this.unsubscribe = EngineFacade.collisions.start((event) => {
      this.handleCollision(event);
    });
  }

  /**
   * Stop listening for duck collisions
   */
  stop(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }
}
