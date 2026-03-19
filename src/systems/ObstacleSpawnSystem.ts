import Matter from 'matter-js';
import { EntityManager } from './EntityManager';
import { EntityFactory } from './EntityFactory';

/**
 * ObstacleSpawnSystem
 *
 * Manages spawning and moving obstacles for runner-style games
 * Spawns obstacles that move horizontally across the screen
 */
export class ObstacleSpawnSystem {
  private entityManager: EntityManager;
  private world: Matter.World;
  private obstacles: Set<string> = new Set();
  private spawnX: number;
  private groundY: number;
  private speed: number;
  private minHeight: number;
  private maxHeight: number;

  constructor(
    entityManager: EntityManager,
    world: Matter.World,
    spawnX: number,
    groundY: number,
    speed: number = -3,
    minHeight: number = 40,
    maxHeight: number = 80
  ) {
    this.entityManager = entityManager;
    this.world = world;
    this.spawnX = spawnX;
    this.groundY = groundY;
    this.speed = speed;
    this.minHeight = minHeight;
    this.maxHeight = maxHeight;
  }

  /**
   * Spawn a new obstacle
   * Returns the obstacle ID
   */
  spawnObstacle(): string {
    const height = this.minHeight + Math.random() * (this.maxHeight - this.minHeight);
    const width = 30;

    // Create box obstacle at spawn position
    // Note: We make it static initially to prevent gravity, then make dynamic with velocity
    const obstacle = EntityFactory.createBox(
      this.spawnX,
      this.groundY - height / 2,
      width,
      height,
      {
        isStatic: true, // Start as static to prevent gravity
      }
    );

    // Now make it kinematic (moves but not affected by forces)
    Matter.Body.setStatic(obstacle.body, false);

    // Set velocity to move left
    Matter.Body.setVelocity(obstacle.body, { x: this.speed, y: 0 });

    // Prevent gravity by constantly resetting Y velocity in update loop
    // Or better: use very high inertia to resist gravity
    obstacle.body.inertia = Infinity;
    obstacle.body.inverseInertia = 0;

    // Make it not rotate and reduce physics interactions
    Matter.Body.setAngularVelocity(obstacle.body, 0);
    obstacle.body.frictionAir = 0; // No air resistance
    obstacle.body.friction = 0; // No friction

    // Add metadata to identify as obstacle
    obstacle.metadata = {
      ...obstacle.metadata,
      isObstacle: true,
    };

    this.entityManager.register(obstacle);
    this.obstacles.add(obstacle.id);

    return obstacle.id;
  }

  /**
   * Update all obstacles
   * Remove obstacles that are off-screen
   */
  update(leftBoundary: number = -100): void {
    const toRemove: string[] = [];

    this.obstacles.forEach((obstacleId) => {
      const entity = this.entityManager.getAll().find((e) => e.id === obstacleId);

      if (!entity) {
        toRemove.push(obstacleId);
        return;
      }

      // Maintain constant horizontal velocity and zero vertical velocity (no gravity)
      if (Math.abs(entity.body.velocity.x - this.speed) > 0.1 || Math.abs(entity.body.velocity.y) > 0.1) {
        Matter.Body.setVelocity(entity.body, {
          x: this.speed,
          y: 0, // Force Y velocity to 0 to counter gravity
        });
      }

      // Remove if off-screen
      if (entity.body.position.x < leftBoundary) {
        this.entityManager.remove(obstacleId);
        toRemove.push(obstacleId);
      }
    });

    // Clean up removed obstacles
    toRemove.forEach((id) => this.obstacles.delete(id));
  }

  /**
   * Get all active obstacle IDs
   */
  getObstacles(): string[] {
    return Array.from(this.obstacles);
  }

  /**
   * Get obstacle count
   */
  getObstacleCount(): number {
    return this.obstacles.size;
  }

  /**
   * Clear all obstacles
   */
  clearAll(): void {
    this.obstacles.forEach((obstacleId) => {
      this.entityManager.remove(obstacleId);
    });
    this.obstacles.clear();
  }

  /**
   * Set spawn speed
   */
  setSpeed(speed: number): void {
    this.speed = speed;
  }

  /**
   * Get current speed
   */
  getSpeed(): number {
    return this.speed;
  }
}
