/**
 * Abstract point type for rendering
 * Compatible with Vector2D but separate for clarity
 */

import { Vector2D } from '../geometry/Vector2D';

/**
 * Generic render point interface
 * Can be implemented by Skia SkPoint, Canvas Point, etc.
 */
export interface RenderPoint {
  x: number;
  y: number;
}

/**
 * Convert RenderPoint to domain Vector2D
 */
export function toVector2D(point: RenderPoint): Vector2D {
  return { x: point.x, y: point.y };
}

/**
 * Convert domain Vector2D to RenderPoint
 */
export function fromVector2D(vector: Vector2D): RenderPoint {
  return { x: vector.x, y: vector.y };
}
