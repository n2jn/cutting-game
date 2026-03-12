import { SkPoint, Skia, SkPath, vec } from '@shopify/react-native-skia';
import Matter from 'matter-js';

/**
 * Convert Matter.js body vertices to Skia Path
 * Uses the body's vertices to create a closed path for rendering
 * @param body - Matter.js body
 * @returns SkPath ready for Skia rendering
 */
export function bodyToSkiaPath(body: Matter.Body): SkPath {
  if (!body.vertices || body.vertices.length === 0) {
    return Skia.Path.Make();
  }

  const path = Skia.Path.Make();
  const vertices = body.vertices;

  // Move to the first vertex
  path.moveTo(vertices[0].x, vertices[0].y);

  // Draw lines to each subsequent vertex
  for (let i = 1; i < vertices.length; i++) {
    path.lineTo(vertices[i].x, vertices[i].y);
  }

  // Close the path to complete the polygon
  path.close();

  return path;
}

/**
 * Convert Matter.js body to Skia vertices (SkPoint array format)
 * @param body - Matter.js body
 * @returns Array of SkPoint coordinates
 */
export function bodyToSkiaVertices(body: Matter.Body): SkPoint[] {
  if (!body.vertices || body.vertices.length === 0) {
    return [];
  }

  const vertices: SkPoint[] = [];
  for (const v of body.vertices) {
    vertices.push(vec(v.x, v.y));
  }
  return vertices;
}

/**
 * Convert Matter.js vertices array to Skia Path
 * @param vertices - Array of Matter.Vector vertices
 * @returns SkPath ready for Skia rendering
 */
export function verticesToSkiaPath(vertices: Matter.Vector[]): SkPath {
  if (!vertices || vertices.length === 0) {
    return Skia.Path.Make();
  }

  const path = Skia.Path.Make();

  // Move to the first vertex
  path.moveTo(vertices[0].x, vertices[0].y);

  // Draw lines to each subsequent vertex
  for (let i = 1; i < vertices.length; i++) {
    path.lineTo(vertices[i].x, vertices[i].y);
  }

  // Close the path to complete the polygon
  path.close();

  return path;
}

/**
 * Get the bounding box of vertices
 * @param vertices - Array of Matter.Vector vertices
 * @returns Object with minX, minY, maxX, maxY
 */
export function getVerticesBounds(
  vertices: Matter.Vector[]
): { minX: number; minY: number; maxX: number; maxY: number } {
  if (!vertices || vertices.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  }

  let minX = vertices[0].x;
  let minY = vertices[0].y;
  let maxX = vertices[0].x;
  let maxY = vertices[0].y;

  for (let i = 1; i < vertices.length; i++) {
    if (vertices[i].x < minX) minX = vertices[i].x;
    if (vertices[i].y < minY) minY = vertices[i].y;
    if (vertices[i].x > maxX) maxX = vertices[i].x;
    if (vertices[i].y > maxY) maxY = vertices[i].y;
  }

  return { minX, minY, maxX, maxY };
}

/**
 * Get the centroid (center) of vertices
 * @param vertices - Array of Matter.Vector vertices
 * @returns SkPoint at the centroid
 */
export function getVerticesCentroid(vertices: Matter.Vector[]): SkPoint {
  if (!vertices || vertices.length === 0) {
    return vec(0, 0);
  }

  let sumX = 0;
  let sumY = 0;

  for (const v of vertices) {
    sumX += v.x;
    sumY += v.y;
  }

  return vec(sumX / vertices.length, sumY / vertices.length);
}
