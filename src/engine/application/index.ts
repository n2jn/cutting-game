/**
 * Application Layer Barrel Export
 * Use cases, services, and ports
 */

// Ports
export type { IPhysicsEngine, PhysicsBody, BodyDefinition, PhysicsWorld } from './ports/IPhysicsEngine';
export type { IReactiveSystem, ReactiveValue, RenderPath } from './ports/IReactiveSystem';
export type { ICollisionDetector } from './ports/ICollisionDetector';

// Services
export { EntityService } from './services/EntityService';
export type { EntityChangeListener } from './services/EntityService';
export { PhysicsService } from './services/PhysicsService';

// Use Cases
export { CreateEntityUseCase } from './usecases/CreateEntity';
export { SyncToRendererUseCase } from './usecases/SyncToRenderer';
export { UpdatePhysicsUseCase } from './usecases/UpdatePhysics';
export { PerformCutUseCase } from './usecases/PerformCut';
export type { CutResultWithEntities } from './usecases/PerformCut';
export { DetectCollisionsUseCase } from './usecases/DetectCollisions';
