/**
 * Cutting operation interface
 * Abstract cutting logic - no Matter.js dependency
 */

import { PhysicsBody } from '../physics/PhysicsBody';
import { Line } from '../geometry/Line';

/**
 * Result of a cutting operation
 */
export interface CutResult {
  /**
   * The original body that was cut
   */
  originalBody: PhysicsBody;

  /**
   * The new bodies created from the cut
   */
  newBodies: PhysicsBody[];
}

/**
 * Abstract cutting operation interface
 * Implementations will handle the actual physics engine integration
 */
export interface CuttingOperation {
  /**
   * Cut bodies along a line
   * @param line The cutting line
   * @param bodies Bodies to attempt to cut
   * @returns Array of cut results
   */
  cut(line: Line, bodies: PhysicsBody[]): CutResult[];
}
