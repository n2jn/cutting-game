/**
 * Game Engine - Clean Architecture
 * Main public API with zero third-party dependencies in domain layer
 *
 * Usage:
 * - Simple API: Use EngineFacade for convenience
 * - Advanced API: Import specific classes for tree-shaking
 */

// ============================================================================
// DOMAIN EXPORTS (Pure TypeScript - ZERO external dependencies)
// ============================================================================

// Geometry
export type { Vector2D } from './domain/geometry/Vector2D';
export { Vector2DOperations } from './domain/geometry/Vector2D';
export type { Line } from './domain/geometry/Line';
export { LineOperations } from './domain/geometry/Line';
export type { Polygon } from './domain/geometry/Polygon';
export { PolygonOperations } from './domain/geometry/Polygon';

// Physics
export type {
  PhysicsBody,
  BodyDefinition,
  BodyShape,
} from './domain/physics/PhysicsBody';
export type { PhysicsWorld } from './domain/physics/PhysicsWorld';
export type { PhysicsEngine, CollisionPair } from './domain/physics/PhysicsEngine';

// Renderer
export type { ReactiveValue, ReactiveValueFactory } from './domain/renderer/ReactiveValue';
export type { RenderPath, Bounds, PathFactory } from './domain/renderer/Path';
export type { RenderPoint } from './domain/renderer/Point';
export { toVector2D, fromVector2D } from './domain/renderer/Point';

// Entities
export type { Entity, EntityType } from './domain/entities/Entity';
export type {
  RenderData,
  BallRenderData,
  BoxRenderData,
  PolygonRenderData,
  WallRenderData,
  DuckRenderData,
} from './domain/entities/RenderData';
export type { EntityMetadata } from './domain/entities/EntityMetadata';

// Operations
export type { CollisionEvent, CollisionCallback } from './domain/operations/CollisionEvent';
export type { CutResult, CuttingOperation } from './domain/operations/CuttingOperation';

// ============================================================================
// APPLICATION EXPORTS (Use Cases & Services)
// ============================================================================

export { EntityService } from './application/services/EntityService';
export type { EntityChangeListener } from './application/services/EntityService';
export { PhysicsService } from './application/services/PhysicsService';

export { CreateEntityUseCase } from './application/usecases/CreateEntity';
export { SyncToRendererUseCase } from './application/usecases/SyncToRenderer';
export { UpdatePhysicsUseCase } from './application/usecases/UpdatePhysics';
export { PerformCutUseCase } from './application/usecases/PerformCut';
export type { CutResultWithEntities } from './application/usecases/PerformCut';
export { DetectCollisionsUseCase } from './application/usecases/DetectCollisions';

// ============================================================================
// INFRASTRUCTURE EXPORTS (Use sparingly - for advanced cases)
// ============================================================================

export { EngineFactory } from './infrastructure/EngineFactory';
export { SCREEN_DIMENSIONS, PHYSICS_CONFIG, ENGINE_CONSTANTS } from './infrastructure/config/EngineConfig';

// Convenient dimension exports (legacy compatibility)
export const { width, height } = SCREEN_DIMENSIONS;

// For legacy compatibility or advanced use
export { ReanimatedFactory } from './infrastructure/reanimated/ReanimatedValueWrapper';
export { SkiaPathFactory } from './infrastructure/skia/SkiaPathWrapper';
export { SkiaPointAdapter } from './infrastructure/skia/SkiaPointAdapter';

// ============================================================================
// CONVENIENCE FACADE (Recommended for most use cases)
// ============================================================================

import { EngineFactory } from './infrastructure/EngineFactory';
import { EntityService } from './application/services/EntityService';
import { PhysicsService } from './application/services/PhysicsService';
import { CreateEntityUseCase } from './application/usecases/CreateEntity';
import { SyncToRendererUseCase } from './application/usecases/SyncToRenderer';
import { UpdatePhysicsUseCase } from './application/usecases/UpdatePhysics';
import { PerformCutUseCase } from './application/usecases/PerformCut';
import { DetectCollisionsUseCase } from './application/usecases/DetectCollisions';
import { SCREEN_DIMENSIONS } from './infrastructure';

/**
 * EngineFacade - Simplified API for common operations
 * Hides complexity of dependency injection
 *
 * Example usage:
 * ```ts
 * import { EngineFacade, Vector2D } from '@engine';
 *
 * const position: Vector2D = { x: 100, y: 100 };
 * const ball = EngineFacade.creator.createBall(position, 20);
 * EngineFacade.entities.register(ball);
 * ```
 */
export class EngineFacade {
  private static factory = EngineFactory.getInstance();
  private static entityService: EntityService;
  private static physicsService: PhysicsService;
  private static createEntityUseCase: CreateEntityUseCase;
  private static syncToRendererUseCase: SyncToRendererUseCase;
  private static updatePhysicsUseCase: UpdatePhysicsUseCase;
  private static performCutUseCase: PerformCutUseCase;
  private static detectCollisionsUseCase: DetectCollisionsUseCase;

  /**
   * Get physics engine instance
   */
  static get physics() {
    return this.factory.getPhysicsEngine();
  }

  /**
   * Get reactive system (Reanimated + Skia factories)
   */
  static get reactive() {
    return this.factory.getReactiveSystem();
  }

  /**
   * Get entity service (register, remove, query entities)
   */
  static get entities() {
    if (!this.entityService) {
      this.entityService = new EntityService(this.factory.getPhysicsEngine());
    }
    return this.entityService;
  }

  /**
   * Get entity creator (create balls, boxes, polygons, etc.)
   */
  static get creator() {
    if (!this.createEntityUseCase) {
      this.createEntityUseCase = new CreateEntityUseCase(
        this.factory.getPhysicsEngine(),
        this.factory.getReactiveSystem()
      );
    }
    return this.createEntityUseCase;
  }

  /**
   * Get collision detection use case
   */
  static get collisions() {
    if (!this.detectCollisionsUseCase) {
      this.detectCollisionsUseCase = new DetectCollisionsUseCase(
        this.factory.getCollisionDetector()
      );
    }
    return this.detectCollisionsUseCase;
  }

  /**
   * Get cutting use case
   */
  static get cutting() {
    if (!this.performCutUseCase) {
      this.performCutUseCase = new PerformCutUseCase(
        this.factory.getCuttingOperation(),
        this.entities, // Reuse entity service
        this.factory.getPhysicsEngine(),
        this.factory.getReactiveSystem()
      );
    }
    return this.performCutUseCase;
  }

  /**
   * Get physics sync use case
   */
  static get sync() {
    if (!this.syncToRendererUseCase) {
      this.syncToRendererUseCase = new SyncToRendererUseCase();
    }
    return this.syncToRendererUseCase;
  }

  /**
   * Get update physics use case (combines physics step + sync)
   */
  static get updater() {
    if (!this.updatePhysicsUseCase) {
      if (!this.physicsService) {
        this.physicsService = new PhysicsService(this.factory.getPhysicsEngine());
      }
      this.updatePhysicsUseCase = new UpdatePhysicsUseCase(
        this.physicsService,
        this.sync
      );
    }
    return this.updatePhysicsUseCase;
  }

  /**
   * Reset all singletons (useful for testing or reinitialization)
   */
  static reset() {
    EngineFactory.reset();
    this.factory = EngineFactory.getInstance();
    this.entityService = null as any;
    this.physicsService = null as any;
    this.createEntityUseCase = null as any;
    this.syncToRendererUseCase = null as any;
    this.updatePhysicsUseCase = null as any;
    this.performCutUseCase = null as any;
    this.detectCollisionsUseCase = null as any;
  }
}
