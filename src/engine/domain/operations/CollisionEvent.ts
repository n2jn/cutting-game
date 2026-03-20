/**
 * Collision event types
 * Abstract collision detection - no Matter.js dependency
 */

import { PhysicsBody } from '../physics/PhysicsBody';

/**
 * Collision event between two bodies
 */
export interface CollisionEvent {
  bodyA: PhysicsBody;
  bodyB: PhysicsBody;
  timestamp: number;
}

/**
 * Callback function for collision events
 */
export type CollisionCallback = (event: CollisionEvent) => void;
