/**
 * Decomp.ts - Polygon decomposition and geometry utilities
 * Adapted from https://github.com/schteppe/decomp.js
 */

export interface Point {
  x: number;
  y: number;
}

export type Line = [Point, Point];

/**
 * Check if two scalar values are approximately equal
 */
function scalarEq(a: number, b: number, precision: number = 0): boolean {
  return Math.abs(a - b) <= precision;
}

/**
 * Check if two line segments intersect
 * @param p1 - Start point of first line segment
 * @param p2 - End point of first line segment
 * @param q1 - Start point of second line segment
 * @param q2 - End point of second line segment
 * @returns true if the two line segments intersect
 */
export function lineSegmentsIntersect(
  p1: Point,
  p2: Point,
  q1: Point,
  q2: Point
): boolean {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const da = q2.x - q1.x;
  const db = q2.y - q1.y;

  // segments are parallel
  if (da * dy - db * dx === 0) {
    return false;
  }

  const s = (dx * (q1.y - p1.y) + dy * (p1.x - q1.x)) / (da * dy - db * dx);
  const t = (da * (p1.y - q1.y) + db * (q1.x - p1.x)) / (db * dx - da * dy);

  return s >= 0 && s <= 1 && t >= 0 && t <= 1;
}

/**
 * Compute the intersection between two lines (not segments)
 * @param l1 - First line [startPoint, endPoint]
 * @param l2 - Second line [startPoint, endPoint]
 * @param precision - Precision to use when checking if the lines are parallel
 * @returns The intersection point
 */
export function lineIntersection(
  l1: Line,
  l2: Line,
  precision: number = 0
): Point {
  const i: Point = { x: 0, y: 0 };

  const a1 = l1[1].y - l1[0].y;
  const b1 = l1[0].x - l1[1].x;
  const c1 = a1 * l1[0].x + b1 * l1[0].y;

  const a2 = l2[1].y - l2[0].y;
  const b2 = l2[0].x - l2[1].x;
  const c2 = a2 * l2[0].x + b2 * l2[0].y;

  const det = a1 * b2 - a2 * b1;

  if (!scalarEq(det, 0, precision)) {
    // lines are not parallel
    i.x = (b2 * c1 - b1 * c2) / det;
    i.y = (a1 * c2 - a2 * c1) / det;
  }

  return i;
}
