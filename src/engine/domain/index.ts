/**
 * Domain Layer Barrel Export
 * Pure TypeScript - ZERO external dependencies
 */

// Geometry
export type { Vector2D } from './geometry/Vector2D';
export { Vector2DOperations } from './geometry/Vector2D';
export type { Line } from './geometry/Line';
export { LineOperations } from './geometry/Line';
export type { Polygon } from './geometry/Polygon';
export { PolygonOperations } from './geometry/Polygon';

// Physics
export type {
  PhysicsBody,
  BodyDefinition,
  BodyShape,
} from './physics/PhysicsBody';
export type { PhysicsWorld } from './physics/PhysicsWorld';
export type { PhysicsEngine, CollisionPair } from './physics/PhysicsEngine';

// Renderer
export type { ReactiveValue, ReactiveValueFactory } from './renderer/ReactiveValue';
export type { RenderPath, Bounds, PathFactory } from './renderer/Path';
export type { RenderPoint } from './renderer/Point';
export { toVector2D, fromVector2D } from './renderer/Point';

// Entities
export type { Entity, EntityType } from './entities/Entity';
export type {
  RenderData,
  BallRenderData,
  BoxRenderData,
  PolygonRenderData,
  WallRenderData,
  DuckRenderData,
} from './entities/RenderData';
export type { EntityMetadata } from './entities/EntityMetadata';

// Operations
export type { CollisionEvent, CollisionCallback } from './operations/CollisionEvent';
export type { CutResult, CuttingOperation } from './operations/CuttingOperation';
