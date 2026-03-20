/**
 * Abstract path interface
 * No dependency on @shopify/react-native-skia
 */

import { Vector2D } from '../geometry/Vector2D';

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Abstract render path
 * Implementations: SkPath (Skia), Canvas2D Path, SVG Path, etc.
 */
export interface RenderPath {
  getBounds(): Bounds;
}

/**
 * Factory for creating render paths
 * Implementation will be provided by infrastructure layer
 */
export interface PathFactory {
  createFromVertices(vertices: Vector2D[]): RenderPath;
}
