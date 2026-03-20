/**
 * Centralized hooks exports
 */

// Physics hooks
export { useEntityManager } from './physics/useEntityManager';
export { usePhysicsLoop } from './physics/usePhysicsLoop';

// Renderer hooks
export { useReactiveVector } from './renderer/useReactiveVector';

// Game hooks
export { useGameState, useAutoClicker } from './game/useGameState';
export { useHeartSystem } from './game/useHeartSystem';
export { useScoreSystem } from './game/useScoreSystem';
export { useGameSetup } from './game/useGameSetup';
export { useDuckCollision } from './game/useDuckCollision';
