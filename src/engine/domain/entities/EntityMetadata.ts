/**
 * Entity metadata
 * Optional behavioral flags and tracking data
 */

export interface EntityMetadata {
  /**
   * Can this entity be cut by the cutting tool?
   */
  isCuttable?: boolean;

  /**
   * Timestamp when entity was created
   */
  createdAt?: number;

  /**
   * ID of the parent entity (for tracking cut pieces)
   */
  parentId?: string;

  /**
   * How many times this entity has been cut from the original
   * Generation 0 = original, 1 = first cut, 2 = second cut, etc.
   */
  generation?: number;

  /**
   * Is this the player's duck?
   */
  isDuck?: boolean;

  /**
   * Is this an obstacle in a runner game?
   */
  isObstacle?: boolean;

  /**
   * Has this obstacle been scored already?
   */
  scored?: boolean;

  /**
   * Custom metadata (extensible)
   */
  [key: string]: unknown;
}
