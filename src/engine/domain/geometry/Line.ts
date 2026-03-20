/**
 * Line geometry utilities
 * Pure math - no external dependencies
 */

import { Vector2D } from './Vector2D';

export interface Line {
  start: Vector2D;
  end: Vector2D;
}

/**
 * Pure line geometry operations
 * Extracted from utils/decomp.ts
 */
export class LineOperations {
  /**
   * Find intersection point between two lines
   * Returns null if lines don't intersect
   */
  static intersect(line1: Line, line2: Line): Vector2D | null {
    const { start: p1, end: p2 } = line1;
    const { start: p3, end: p4 } = line2;

    const d =
      (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);

    if (d === 0) {
      return null; // Lines are parallel
    }

    const u =
      ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / d;
    const v =
      ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / d;

    if (u < 0 || u > 1 || v < 0 || v > 1) {
      return null; // Intersection outside line segments
    }

    return {
      x: p1.x + u * (p2.x - p1.x),
      y: p1.y + u * (p2.y - p1.y),
    };
  }

  /**
   * Check if two line segments intersect
   * Fast check without computing intersection point
   */
  static doSegmentsIntersect(line1: Line, line2: Line): boolean {
    const { start: p1, end: p2 } = line1;
    const { start: p3, end: p4 } = line2;

    const ccw = (a: Vector2D, b: Vector2D, c: Vector2D): boolean => {
      return (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x);
    };

    return (
      ccw(p1, p3, p4) !== ccw(p2, p3, p4) &&
      ccw(p1, p2, p3) !== ccw(p1, p2, p4)
    );
  }

  /**
   * Calculate the length of a line segment
   */
  static length(line: Line): number {
    const dx = line.end.x - line.start.x;
    const dy = line.end.y - line.start.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Get the midpoint of a line segment
   */
  static midpoint(line: Line): Vector2D {
    return {
      x: (line.start.x + line.end.x) / 2,
      y: (line.start.y + line.end.y) / 2,
    };
  }

  /**
   * Get the direction vector of a line (normalized)
   */
  static direction(line: Line): Vector2D {
    const dx = line.end.x - line.start.x;
    const dy = line.end.y - line.start.y;
    const length = Math.sqrt(dx * dx + dy * dy);

    if (length === 0) {
      return { x: 0, y: 0 };
    }

    return {
      x: dx / length,
      y: dy / length,
    };
  }

  /**
   * Calculate the closest point on a line segment to a given point
   */
  static closestPointOnSegment(line: Line, point: Vector2D): Vector2D {
    const { start, end } = line;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const lengthSquared = dx * dx + dy * dy;

    if (lengthSquared === 0) {
      return { ...start };
    }

    const t = Math.max(
      0,
      Math.min(
        1,
        ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared
      )
    );

    return {
      x: start.x + t * dx,
      y: start.y + t * dy,
    };
  }

  /**
   * Calculate distance from a point to a line segment
   */
  static distanceToPoint(line: Line, point: Vector2D): number {
    const closest = this.closestPointOnSegment(line, point);
    const dx = point.x - closest.x;
    const dy = point.y - closest.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
