/**
 * Engine Factory
 * Dependency Injection Container
 * Creates and wires up all infrastructure adapters
 */

import { IPhysicsEngine } from '../application/ports/IPhysicsEngine';
import { IReactiveSystem } from '../application/ports/IReactiveSystem';
import { ICollisionDetector } from '../application/ports/ICollisionDetector';
import { CuttingOperation } from '../domain/operations/CuttingOperation';

// Infrastructure implementations
import { MatterPhysicsEngine } from './matter/MatterPhysicsEngine';
import { MatterCollisionDetector } from './matter/MatterCollisionDetector';
import { MatterCuttingOperation } from './matter/MatterCuttingOperation';
import { ReanimatedFactory } from './reanimated/ReanimatedValueWrapper';
import { SkiaPathFactory } from './skia/SkiaPathWrapper';
import { PHYSICS_CONFIG } from './config/EngineConfig';

/**
 * Singleton factory for creating infrastructure dependencies
 * This is the root of the dependency injection container
 */
export class EngineFactory {
  private static instance: EngineFactory;

  private physicsEngine: IPhysicsEngine;
  private reactiveSystem: IReactiveSystem;
  private collisionDetector: ICollisionDetector;
  private cuttingOperation: CuttingOperation;

  private constructor() {
    // Create Matter.js physics engine
    const matterEngine = new MatterPhysicsEngine(PHYSICS_CONFIG.gravity);

    // Wire up dependencies
    this.physicsEngine = matterEngine;
    this.reactiveSystem = {
      reactiveValueFactory: new ReanimatedFactory(),
      pathFactory: new SkiaPathFactory(),
    };
    this.collisionDetector = new MatterCollisionDetector(
      matterEngine.getMatterEngine()
    );
    this.cuttingOperation = new MatterCuttingOperation();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): EngineFactory {
    if (!this.instance) {
      this.instance = new EngineFactory();
    }
    return this.instance;
  }

  /**
   * Reset singleton (useful for testing)
   */
  static reset(): void {
    this.instance = null as any;
  }

  /**
   * Get physics engine implementation
   */
  getPhysicsEngine(): IPhysicsEngine {
    return this.physicsEngine;
  }

  /**
   * Get reactive system (Reanimated + Skia)
   */
  getReactiveSystem(): IReactiveSystem {
    return this.reactiveSystem;
  }

  /**
   * Get collision detector
   */
  getCollisionDetector(): ICollisionDetector {
    return this.collisionDetector;
  }

  /**
   * Get cutting operation
   */
  getCuttingOperation(): CuttingOperation {
    return this.cuttingOperation;
  }
}
