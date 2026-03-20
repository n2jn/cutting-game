/**
 * Update Physics Use Case
 * Orchestrates the physics update loop
 */

import { PhysicsService } from '../services/PhysicsService';
import { SyncToRendererUseCase } from './SyncToRenderer';
import { Entity } from '../../domain/entities/Entity';

/**
 * Use case for updating physics simulation
 * Handles the update cycle: physics step → sync to renderer
 */
export class UpdatePhysicsUseCase {
  constructor(
    private physicsService: PhysicsService,
    private syncToRenderer: SyncToRendererUseCase
  ) {}

  /**
   * Execute one physics update cycle
   * @param deltaTime Time step in milliseconds (typically 1000/60 for 60fps)
   * @param entities Entities to sync after physics update
   */
  execute(deltaTime: number, entities: Entity[]): void {
    // Step 1: Update physics simulation
    this.physicsService.update(deltaTime);

    // Step 2: Sync physics bodies to render data
    this.syncToRenderer.syncAll(entities);
  }
}
