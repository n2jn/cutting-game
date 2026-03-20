/**
 * Skia Path Wrapper
 * Wraps SkPath as RenderPath
 * PERFORMANCE: Holds reference, no conversion
 */

import { Skia, SkPath } from '@shopify/react-native-skia';
import { RenderPath, PathFactory, Bounds } from '../../domain/renderer/Path';
import { Vector2D } from '../../domain/geometry/Vector2D';

/**
 * Wrapper class that implements RenderPath using SkPath
 * Performance: Holds reference to underlying SkPath
 */
class SkiaPathWrapperImpl implements RenderPath {
  constructor(private skPath: SkPath) {}

  getBounds(): Bounds {
    const bounds = this.skPath.getBounds();
    return {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
    };
  }

  /**
   * Get the underlying SkPath for rendering
   * Only use when passing to Skia rendering components
   */
  getSkPath(): SkPath {
    return this.skPath;
  }
}

/**
 * Factory for creating Skia paths
 */
export class SkiaPathFactory implements PathFactory {
  createFromVertices(vertices: Vector2D[]): RenderPath {
    const path = Skia.Path.Make();

    if (vertices.length === 0) {
      return new SkiaPathWrapperImpl(path);
    }

    // Move to first vertex
    path.moveTo(vertices[0].x, vertices[0].y);

    // Draw lines to remaining vertices
    for (let i = 1; i < vertices.length; i++) {
      path.lineTo(vertices[i].x, vertices[i].y);
    }

    // Close the path
    path.close();

    return new SkiaPathWrapperImpl(path);
  }

  /**
   * Unwrap to get the underlying SkPath
   * Useful for rendering or Skia-specific operations
   */
  unwrap(renderPath: RenderPath): SkPath {
    if (renderPath instanceof SkiaPathWrapperImpl) {
      return (renderPath as SkiaPathWrapperImpl).getSkPath();
    }
    throw new Error('Cannot unwrap non-Skia path');
  }
}
