/**
 * Skia Point Adapter
 * Lightweight conversions between Vector2D and SkPoint
 */

import { vec, SkPoint } from '@shopify/react-native-skia';
import { Vector2D } from '../../domain/geometry/Vector2D';

/**
 * Adapter for converting between domain Vector2D and Skia SkPoint
 * These are lightweight conversions (both are just { x, y })
 */
export class SkiaPointAdapter {
  /**
   * Convert Vector2D to SkPoint
   */
  static toSkPoint(v: Vector2D): SkPoint {
    return vec(v.x, v.y);
  }

  /**
   * Convert SkPoint to Vector2D
   */
  static fromSkPoint(p: SkPoint): Vector2D {
    return { x: p.x, y: p.y };
  }

  /**
   * Convert array of Vector2D to array of SkPoint
   */
  static toSkPoints(vectors: Vector2D[]): SkPoint[] {
    return vectors.map((v) => vec(v.x, v.y));
  }

  /**
   * Convert array of SkPoint to array of Vector2D
   */
  static fromSkPoints(points: SkPoint[]): Vector2D[] {
    return points.map((p) => ({ x: p.x, y: p.y }));
  }
}
