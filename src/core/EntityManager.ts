import Matter from 'matter-js';
import { Entity } from './Entity.types';

export type EntityChangeListener = (entities: Map<string, Entity>) => void;

/**
 * Central entity registry and lifecycle manager
 * Single source of truth for all game entities
 */
export class EntityManager {
  private entities = new Map<string, Entity>();
  private world: Matter.World;
  private listeners = new Set<EntityChangeListener>();

  constructor(world: Matter.World) {
    this.world = world;
  }

  /**
   * Register a new entity (adds body to world if present)
   */
  register(entity: Entity): void {
    if (this.entities.has(entity.id)) {
      console.warn(`Entity ${entity.id} already registered`);
      return;
    }

    this.entities.set(entity.id, entity);

    // Add physics body to world if it exists
    if (entity.body) {
      Matter.World.add(this.world, entity.body);
    }

    this.notifyListeners();
  }

  /**
   * Remove entity and its physics body
   */
  remove(id: string): void {
    const entity = this.entities.get(id);
    if (!entity) return;

    // Remove from physics world
    if (entity.body) {
      try {
        Matter.World.remove(this.world, entity.body, true);
      } catch (e) {
        // Body might already be removed, ignore
      }
    }

    this.entities.delete(id);
    this.notifyListeners();
  }

  /**
   * Get entity by ID (O(1) lookup)
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
   * Get only dynamic entities (those with physics bodies)
   */
  getDynamic(): Entity[] {
    return this.getAll().filter((e) => e.body !== null);
  }

  /**
   * Find entity by body ID
   */
  findByBodyId(bodyId: number): Entity | undefined {
    return this.getDynamic().find((e) => e.body?.id === bodyId);
  }

  /**
   * Subscribe to entity changes
   * Returns unsubscribe function
   */
  subscribe(listener: EntityChangeListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      listener(new Map(this.entities));
    });
  }

  /**
   * Batch operation for cutting (remove old, add new)
   */
  replaceEntity(oldId: string, newEntities: Entity[]): void {
    this.remove(oldId);
    newEntities.forEach((entity) => this.register(entity));
  }

  /**
   * Debug helper
   */
  inspect(): void {
    console.log('=== Entity Manager State ===');
    console.log('Total entities:', this.entities.size);
    console.log('By type:', {
      ball: this.getByType('ball').length,
      box: this.getByType('box').length,
      path: this.getByType('path').length,
      wall: this.getByType('wall').length,
    });
    console.log('Dynamic entities:', this.getDynamic().length);
  }
}
