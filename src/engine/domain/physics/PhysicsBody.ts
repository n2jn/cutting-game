/**
 * Abstract physics body interface
 * No dependency on matter-js
 */

import { Vector2D } from '../geometry/Vector2D';

export type BodyShape = 'circle' | 'rectangle' | 'polygon';

/**
 * Definition for creating a physics body
 */
export interface BodyDefinition {
  shape: BodyShape;
  position: Vector2D;

  // Circle properties
  radius?: number;

  // Rectangle properties
  width?: number;
  height?: number;

  // Polygon properties
  vertices?: Vector2D[];

  // Physics properties
  isStatic?: boolean;
  isSensor?: boolean;
  density?: number;
  restitution?: number;
  friction?: number;
  frictionAir?: number;
}

/**
 * Abstract physics body interface
 * Implementations: Matter.Body, Rapier RigidBody, Box2D Body, etc.
 */
export interface PhysicsBody {
  id: string;
  shape: BodyShape;
  position: Vector2D;
  velocity: Vector2D;
  angle: number;
  angularVelocity: number;
  vertices: Vector2D[];
  isStatic: boolean;
  isSensor: boolean;
  mass: number;
}
