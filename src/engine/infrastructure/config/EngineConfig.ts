/**
 * Engine Configuration
 * Infrastructure-level configuration for the game engine
 */

import { Dimensions } from 'react-native';
import decomp from 'poly-decomp';
import Matter from 'matter-js';

// Set up concave polygon decomposition for Matter.js
Matter.Common.setDecomp(decomp);

/**
 * Screen dimensions
 */
export const SCREEN_DIMENSIONS = Dimensions.get('window');

/**
 * Physics configuration
 */
export const PHYSICS_CONFIG = {
  gravity: { x: 0, y: 1 },
  deltaTime: 1000 / 60, // 60 FPS
  enableSleeping: false,
} as const;

/**
 * Engine constants
 */
export const ENGINE_CONSTANTS = {
  DEFAULT_DENSITY: 0.004,
  DEFAULT_RESTITUTION: 0.6,
  DEFAULT_FRICTION: 0.8,
  DEFAULT_FRICTION_AIR: 0.01,
} as const;
