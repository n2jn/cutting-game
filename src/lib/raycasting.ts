/**
 * Raycasting module for detecting and handling shape cutting
 * Adapted from https://github.com/monsterbrain/matter-js-cut-shapes-demo
 */

import Matter from 'matter-js';
import {
  findLinePolygonIntersections,
  slicePolygon,
  Point,
  bodyToPolygon,
} from './decomp';

export interface CutResult {
  originalBody: Matter.Body;
  newBodies: Matter.Body[];
}

/**
 * Check if a line segment intersects with a body
 */
export function lineIntersectsBody(
  lineStart: Point,
  lineEnd: Point,
  body: Matter.Body
): boolean {
  if (!body.vertices) return false;

  const polygon = bodyToPolygon(body);
  const intersections = findLinePolygonIntersections(
    lineStart,
    lineEnd,
    polygon
  );

  return intersections.length >= 2;
}

/**
 * Cut a body along a line
 */
export function cutBody(
  lineStart: Point,
  lineEnd: Point,
  body: Matter.Body,
  world: Matter.World,
  options?: any
): CutResult {
  const result: CutResult = {
    originalBody: body,
    newBodies: [],
  };

  if (!body.vertices) {
    return result;
  }

  const polygon = bodyToPolygon(body);
  const slices = slicePolygon(polygon, lineStart, lineEnd);

  // If only one slice, cutting didn't work
  if (slices.length <= 1) {
    return result;
  }

  // Create new bodies from slices
  for (let slice of slices) {
    try {
      const newBody = Matter.Bodies.fromVertices(
        body.position.x,
        body.position.y,
        [slice],
        {
          density: body.density,
          friction: body.friction,
          restitution: body.restitution,
          label: 'cut-piece',
        }
      );

      // Copy velocity and angular velocity
      Matter.Body.setVelocity(newBody, body.velocity);
      Matter.Body.setAngularVelocity(newBody, body.angularVelocity);

      result.newBodies.push(newBody);
    } catch (e) {
      console.warn('Failed to create body from vertices:', e);
    }
  }

  return result;
}

/**
 * Cut all bodies in the world that intersect with a line
 */
export function cutBodiesInWorld(
  lineStart: Point,
  lineEnd: Point,
  world: Matter.World,
  bodiesFilter?: (body: Matter.Body) => boolean
): { bodiesToRemove: Matter.Body[]; bodiesToAdd: Matter.Body[] } {
  const bodiesToRemove: Matter.Body[] = [];
  const bodiesToAdd: Matter.Body[] = [];

  // Get all bodies
  const bodies = world.bodies;

  for (let body of bodies) {
    // Skip static bodies and walls
    if (body.isStatic) continue;

    // Apply filter if provided
    if (bodiesFilter && !bodiesFilter(body)) continue;

    // Check intersection
    if (lineIntersectsBody(lineStart, lineEnd, body)) {
      const cutResult = cutBody(lineStart, lineEnd, body, world);

      if (cutResult.newBodies.length > 0) {
        bodiesToRemove.push(body);
        bodiesToAdd.push(...cutResult.newBodies);
      }
    }
  }

  return { bodiesToRemove, bodiesToAdd };
}

/**
 * Process a cutting line and update world
 */
export function processCutting(
  lineStart: Point,
  lineEnd: Point,
  world: Matter.World,
  bodiesFilter?: (body: Matter.Body) => boolean
): Matter.Body[] {
  const { bodiesToRemove, bodiesToAdd } = cutBodiesInWorld(
    lineStart,
    lineEnd,
    world,
    bodiesFilter
  );

  // Remove old bodies
  for (let body of bodiesToRemove) {
    Matter.World.remove(world, body);
  }

  // Add new bodies
  for (let body of bodiesToAdd) {
    Matter.World.add(world, body);
  }

  return bodiesToAdd;
}
