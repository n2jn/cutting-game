/**
 * Abstract physics engine interface
 * No dependency on matter-js
 */

import { PhysicsBody, BodyDefinition } from './PhysicsBody';
import { PhysicsWorld } from './PhysicsWorld';
import { Vector2D } from '../geometry/Vector2D';
import { Line } from '../geometry/Line';

/**
 * Pair of bodies involved in a collision
 */
export interface CollisionPair {
  bodyA: PhysicsBody;
  bodyB: PhysicsBody;
}

/**
 * Abstract physics engine
 * Implementations: Matter.Engine, Rapier World, Box2D World, etc.
 */
export interface PhysicsEngine {
  world: PhysicsWorld;

  /**
   * Update the physics simulation
   * @param deltaTime Time step in milliseconds
   */
  update(deltaTime: number): void;

  /**
   * Create a new physics body
   */
  createBody(definition: BodyDefinition): PhysicsBody;

  /**
   * Remove a body from the simulation
   */
  removeBody(id: string): void;

  /**
   * Perform a raycast and return all bodies hit by the ray
   */
  raycast(start: Vector2D, end: Vector2D): PhysicsBody[];

  /**
   * Perform a raycast along a line
   */
  raycastLine(line: Line): PhysicsBody[];

  /**
   * Set gravity for the world
   */
  setGravity(gravity: Vector2D): void;
}
