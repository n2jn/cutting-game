/**
 * Polygon geometry utilities
 * Pure math - no external dependencies
 */

import { Vector2D, Vector2DOperations } from './Vector2D';

export interface Polygon {
  vertices: Vector2D[];
}

/**
 * Pure polygon operations
 * Extracted centroid and transform logic from utils/transform.ts
 */
export class PolygonOperations {
  /**
   * Calculate the centroid (geometric center) of a polygon
   */
  static calculateCentroid(vertices: Vector2D[]): Vector2D {
    if (vertices.length === 0) {
      return { x: 0, y: 0 };
    }

    let sumX = 0;
    let sumY = 0;

    for (const vertex of vertices) {
      sumX += vertex.x;
      sumY += vertex.y;
    }

    return {
      x: sumX / vertices.length,
      y: sumY / vertices.length,
    };
  }

  /**
   * Transform vertices to be relative to a given origin point
   * Useful for creating paths centered on a specific point
   */
  static makeRelativeToPoint(
    vertices: Vector2D[],
    origin: Vector2D
  ): Vector2D[] {
    return vertices.map((v) => ({
      x: v.x - origin.x,
      y: v.y - origin.y,
    }));
  }

  /**
   * Transform vertices from relative coordinates back to absolute
   */
  static makeAbsolute(vertices: Vector2D[], origin: Vector2D): Vector2D[] {
    return vertices.map((v) => ({
      x: v.x + origin.x,
      y: v.y + origin.y,
    }));
  }

  /**
   * Calculate the area of a polygon using the shoelace formula
   * Returns positive for counter-clockwise, negative for clockwise
   */
  static area(vertices: Vector2D[]): number {
    if (vertices.length < 3) {
      return 0;
    }

    let area = 0;
    for (let i = 0; i < vertices.length; i++) {
      const j = (i + 1) % vertices.length;
      area += vertices[i].x * vertices[j].y;
      area -= vertices[j].x * vertices[i].y;
    }

    return area / 2;
  }

  /**
   * Calculate the perimeter of a polygon
   */
  static perimeter(vertices: Vector2D[]): number {
    if (vertices.length < 2) {
      return 0;
    }

    let perimeter = 0;
    for (let i = 0; i < vertices.length; i++) {
      const j = (i + 1) % vertices.length;
      perimeter += Vector2DOperations.distance(vertices[i], vertices[j]);
    }

    return perimeter;
  }

  /**
   * Get bounding box of a polygon
   */
  static getBounds(vertices: Vector2D[]): {
    x: number;
    y: number;
    width: number;
    height: number;
  } {
    if (vertices.length === 0) {
      return { x: 0, y: 0, width: 0, height: 0 };
    }

    let minX = vertices[0].x;
    let maxX = vertices[0].x;
    let minY = vertices[0].y;
    let maxY = vertices[0].y;

    for (const vertex of vertices) {
      minX = Math.min(minX, vertex.x);
      maxX = Math.max(maxX, vertex.x);
      minY = Math.min(minY, vertex.y);
      maxY = Math.max(maxY, vertex.y);
    }

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  /**
   * Check if a point is inside a polygon using ray casting algorithm
   */
  static containsPoint(vertices: Vector2D[], point: Vector2D): boolean {
    let inside = false;
    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
      const xi = vertices[i].x;
      const yi = vertices[i].y;
      const xj = vertices[j].x;
      const yj = vertices[j].y;

      const intersect =
        yi > point.y !== yj > point.y &&
        point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;

      if (intersect) {
        inside = !inside;
      }
    }

    return inside;
  }

  /**
   * Reverse the winding order of polygon vertices
   */
  static reverse(vertices: Vector2D[]): Vector2D[] {
    return [...vertices].reverse();
  }

  /**
   * Check if polygon vertices are in counter-clockwise order
   */
  static isCounterClockwise(vertices: Vector2D[]): boolean {
    return this.area(vertices) > 0;
  }
}
