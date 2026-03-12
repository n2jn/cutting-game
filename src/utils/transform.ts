import { Skia, SkPath } from '@shopify/react-native-skia';
import Matter from 'matter-js';

/**
 * Calculate centroid of vertices
 * Single source of truth for centroid calculations
 */
export function calculateCentroid(
  vertices: Matter.Vector[]
): { x: number; y: number } {
  return Matter.Vertices.centre(vertices);
}

/**
 * Create Skia path with vertices centered at origin
 * The path's centroid will be at (0, 0) in path's local coordinate system
 */
export function createRelativePath(
  vertices: Matter.Vector[],
  centroid: { x: number; y: number }
): { path: SkPath; bounds: { width: number; height: number } } {
  const path = Skia.Path.Make();

  if (vertices.length === 0) {
    return { path, bounds: { width: 0, height: 0 } };
  }

  // Make vertices relative to centroid so centroid is at (0, 0) in path space
  const relativeVertices = vertices.map((v) => ({
    x: v.x - centroid.x,
    y: v.y - centroid.y,
  }));

  // Build path
  path.moveTo(relativeVertices[0].x, relativeVertices[0].y);
  for (let i = 1; i < relativeVertices.length; i++) {
    path.lineTo(relativeVertices[i].x, relativeVertices[i].y);
  }
  path.close();

  const bounds = path.getBounds();
  return {
    path,
    bounds: { width: bounds.width, height: bounds.height },
  };
}

/**
 * Create Skia path from body vertices (used for cut operations)
 * Transforms body vertices (in world space) to be relative to body center
 */
export function createPathFromBody(
  body: Matter.Body
): { path: SkPath; bounds: { width: number; height: number } } {
  const vertices = body.vertices;

  // Matter.js body.position is at the centroid
  // Vertices are in world space, make them relative to body.position (centroid)
  const relativeVertices = vertices.map((v) => ({
    x: v.x - body.position.x,
    y: v.y - body.position.y,
  }));

  const path = Skia.Path.Make();
  if (relativeVertices.length > 0) {
    path.moveTo(relativeVertices[0].x, relativeVertices[0].y);
    for (let i = 1; i < relativeVertices.length; i++) {
      path.lineTo(relativeVertices[i].x, relativeVertices[i].y);
    }
    path.close();
  }

  const bounds = path.getBounds();
  return {
    path,
    bounds: { width: bounds.width, height: bounds.height },
  };
}
