/**
 * Entity render data
 * Uses abstract interfaces - NO SharedValue, SkPath, or SkPoint dependencies!
 */

import { ReactiveValue } from '../renderer/ReactiveValue';
import { RenderPath } from '../renderer/Path';
import { Vector2D } from '../geometry/Vector2D';

/**
 * Discriminated union of all render data types
 */
export type RenderData =
  | BallRenderData
  | BoxRenderData
  | PolygonRenderData
  | WallRenderData
  | DuckRenderData;

/**
 * Ball (circle) render data
 */
export interface BallRenderData {
  type: 'ball';
  position: ReactiveValue<Vector2D>;
  radius: number;
}

/**
 * Box (rectangle) render data
 */
export interface BoxRenderData {
  type: 'box';
  position: ReactiveValue<Vector2D>; // Top-left corner
  angle: ReactiveValue<number>; // Rotation in radians
  rotationOrigin: ReactiveValue<Vector2D>; // Point to rotate around
  width: number;
  height: number;
}

/**
 * Polygon (arbitrary shape) render data
 */
export interface PolygonRenderData {
  type: 'polygon';
  position: ReactiveValue<Vector2D>; // Top-left of bounding box
  angle: ReactiveValue<number>; // Rotation in radians
  rotationOrigin: ReactiveValue<Vector2D>; // Point to rotate around
  path: RenderPath; // Shape path (abstract, not SkPath)
  centroid: Vector2D; // Geometric center (for rotation calculations)
  width: number; // Bounding box width
  height: number; // Bounding box height
}

/**
 * Wall (static rectangle) render data
 * Walls don't move, so no reactive values
 */
export interface WallRenderData {
  type: 'wall';
  position: Vector2D;
  width: number;
  height: number;
}

/**
 * Duck (player character) render data
 */
export interface DuckRenderData {
  type: 'duck';
  position: ReactiveValue<Vector2D>;
  radius: number;
  rarityColor: string;
}
