/**
 * Infrastructure Layer Barrel Export
 * Adapters and implementations
 */

// Factory
export { EngineFactory } from './EngineFactory';

// Config
export { SCREEN_DIMENSIONS, PHYSICS_CONFIG, ENGINE_CONSTANTS } from './config/EngineConfig';

// Matter.js adapters (export for advanced use cases)
export { MatterPhysicsEngine } from './matter/MatterPhysicsEngine';
export { MatterWorldAdapter } from './matter/MatterWorldAdapter';
export { MatterBodyWrapper, MatterBodyAdapter } from './matter/MatterBodyWrapper';
export { MatterCollisionDetector } from './matter/MatterCollisionDetector';
export { MatterCuttingOperation } from './matter/MatterCuttingOperation';

// Reanimated adapters
export { ReanimatedFactory } from './reanimated/ReanimatedValueWrapper';

// Skia adapters
export { SkiaPathFactory } from './skia/SkiaPathWrapper';
export { SkiaPointAdapter } from './skia/SkiaPointAdapter';
