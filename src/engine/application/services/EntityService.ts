/**
 * Entity Service
 * Manages entity lifecycle and registration
 * Replaces the old EntityManager
 */

import { Entity } from '../../domain/entities/Entity';
import { IPhysicsEngine } from '../ports/IPhysicsEngine';

export type EntityChangeListener = (entities: Map<string, Entity>) => void;

/**
 * Central entity management service
 * Handles registration, removal, and subscriptions
 */
export class EntityService {
  private entities = new Map<string, Entity>();
  private listeners = new Set<EntityChangeListener>();

  constructor(private physicsEngine: IPhysicsEngine) {}

  /**
   * Register a new entity
   * Adds its physics body to the world if present
   */
  register(entity: Entity): void {
    this.entities.set(entity.id, entity);

    // Add physics body to world if entity has one
    if (entity.physicsBody) {
      this.physicsEngine.world.addBody(entity.physicsBody);
    }

    this.notifyListeners();
  }

  /**
   * Remove an entity by ID
   * Removes its physics body from the world
   */
  remove(id: string): void {
    const entity = this.entities.get(id);
    if (!entity) return;

    // Remove physics body from world
    if (entity.physicsBody) {
      this.physicsEngine.world.removeBody(entity.physicsBody.id);
    }

    this.entities.delete(id);
    this.notifyListeners();
  }

  /**
   * Get an entity by ID
   */
  get(id: string): Entity | undefined {
    return this.entities.get(id);
  }

  /**
   * Get all entities
   */
  getAll(): Entity[] {
    return Array.from(this.entities.values());
  }

  /**
   * Get entities by type
   */
  getByType(type: Entity['type']): Entity[] {
    return this.getAll().filter((e) => e.type === type);
  }

  /**
   * Find entity by physics body ID
   */
  findByBodyId(bodyId: string): Entity | undefined {
    return this.getAll().find((e) => e.physicsBody?.id === bodyId);
  }

  /**
   * Get dynamic entities (those with physics bodies)
   */
  getDynamic(): Entity[] {
    return this.getAll().filter((e) => e.physicsBody !== null);
  }

  /**
   * Subscribe to entity changes
   * Returns unsubscribe function
   */
  subscribe(listener: EntityChangeListener): () => void {
    this.listeners.add(listener);
    // Immediately notify with current state
    listener(new Map(this.entities));

    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Clear all entities
   */
  clear(): void {
    // Remove all physics bodies
    this.getAll().forEach((entity) => {
      if (entity.physicsBody) {
        this.physicsEngine.world.removeBody(entity.physicsBody.id);
      }
    });

    this.entities.clear();
    this.notifyListeners();
  }

  /**
   * Get entity count
   */
  get count(): number {
    return this.entities.size;
  }

  /**
   * Notify all listeners of entity changes
   */
  private notifyListeners(): void {
    const entitiesSnapshot = new Map(this.entities);
    this.listeners.forEach((listener) => listener(entitiesSnapshot));
  }
}
