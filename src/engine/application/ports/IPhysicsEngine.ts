/**
 * Physics Engine Port
 * Re-exports domain interface as a port for dependency injection
 */

export type { PhysicsEngine as IPhysicsEngine } from '../../domain/physics/PhysicsEngine';
export type { PhysicsBody, BodyDefinition } from '../../domain/physics/PhysicsBody';
export type { PhysicsWorld } from '../../domain/physics/PhysicsWorld';
