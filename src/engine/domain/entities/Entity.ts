/**
 * Core entity domain model
 * No third-party dependencies - uses abstract interfaces
 */

import { PhysicsBody } from '../physics/PhysicsBody';
import { RenderData } from './RenderData';
import { EntityMetadata } from './EntityMetadata';

export type EntityType = 'ball' | 'box' | 'polygon' | 'wall' | 'duck';

/**
 * Core entity interface
 * Binds a physics body to its render data
 */
export interface Entity {
  /**
   * Unique entity identifier
   */
  id: string;

  /**
   * Entity type (discriminator)
   */
  type: EntityType;

  /**
   * Physics body (null for static walls without physics)
   */
  physicsBody: PhysicsBody | null;

  /**
   * Render data (reactive values for animated properties)
   */
  renderData: RenderData;

  /**
   * Optional metadata for gameplay behavior
   */
  metadata?: EntityMetadata;
}
