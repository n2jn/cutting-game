import { vec } from '@shopify/react-native-skia';
import Matter from 'matter-js';
import { makeMutable } from 'react-native-reanimated';
import {
  Entity,
  PathRenderData,
  BoxRenderData,
  BallRenderData,
  WallRenderData,
  DuckRenderData,
} from './Entity.types';
import {
  calculateCentroid,
  createRelativePath,
  createPathFromBody,
} from '../utils/transform';

/**
 * Factory for creating game entities
 * Centralizes entity creation with proper centroid handling
 */
export class EntityFactory {
  private static idCounter = 0;

  /**
   * Generate unique ID
   */
  private static generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${this.idCounter++}`;
  }

  /**
   * Create ball entity
   */
  static createBall(
    x: number,
    y: number,
    radius: number,
    options?: Partial<Matter.IBodyDefinition>
  ): Entity {
    const body = Matter.Bodies.circle(x, y, radius, {
      density: 0.004,
      restitution: 0.9,
      ...options,
    });

    const renderData: BallRenderData = {
      type: 'ball',
      x: makeMutable(x),
      y: makeMutable(y),
      radius,
    };

    return {
      id: this.generateId('ball'),
      type: 'ball',
      body,
      renderData,
      metadata: { isCuttable: false },
    };
  }

  /**
   * Create box entity
   */
  static createBox(
    x: number,
    y: number,
    width: number,
    height: number,
    options?: Partial<Matter.IBodyDefinition>
  ): Entity {
    // Matter.Bodies.rectangle expects center position (x, y)
    const body = Matter.Bodies.rectangle(x, y, width, height, {
      density: 0.004,
      restitution: 0.9,
      ...options,
    });

    // Render data: body.position is at center, render from top-left
    const renderData: BoxRenderData = {
      type: 'box',
      x: makeMutable(x - width / 2),
      y: makeMutable(y - height / 2),
      angle: makeMutable([{ rotateZ: 0 }]),
      origin: makeMutable(vec(x, y)), // Rotation origin at center
      width,
      height,
    };

    return {
      id: this.generateId('box'),
      type: 'box',
      body,
      renderData,
      metadata: { isCuttable: true },
    };
  }

  /**
   * Create path entity from vertices
   */
  static createPath(
    x: number,
    y: number,
    vertices: Matter.Vector[],
    options?: Partial<Matter.IBodyDefinition>
  ): Entity {
    // Calculate centroid for proper positioning
    const centroid = calculateCentroid(vertices);

    // Create body at desired world position + centroid offset
    // Matter.js will position the body so its centroid is at this point
    const body = Matter.Bodies.fromVertices(
      x + centroid.x,
      y + centroid.y,
      [vertices],
      {
        density: 0.004,
        restitution: 0.9,
        ...options,
      }
    );

    // Create Skia path with vertices relative to centroid (centroid at 0,0 in path space)
    const { path, bounds } = createRelativePath(vertices, centroid);

    // Position: body.position is at centroid, so we need to render at body.position
    // Origin: rotation happens around (0, 0) since path is centered
    const renderData: PathRenderData = {
      type: 'path',
      x: makeMutable(body.position.x),
      y: makeMutable(body.position.y),
      angle: makeMutable([{ rotateZ: body.angle }]),
      origin: makeMutable(vec(0, 0)),
      path,
      centroid: { x: 0, y: 0 }, // Path is centered, centroid at origin
      width: bounds.width,
      height: bounds.height,
    };

    return {
      id: this.generateId('path'),
      type: 'path',
      body,
      renderData,
      metadata: { isCuttable: true },
    };
  }

  /**
   * Create wall entity (static, has body for collisions)
   */
  static createWall(
    x: number,
    y: number,
    width: number,
    height: number
  ): Entity {
    const body = Matter.Bodies.rectangle(
      x + width / 2,
      y + height / 2,
      width,
      height,
      { isStatic: true }
    );

    const renderData: WallRenderData = {
      type: 'wall',
      x,
      y,
      width,
      height,
    };

    return {
      id: this.generateId('wall'),
      type: 'wall',
      body,
      renderData,
      metadata: { isCuttable: false },
    };
  }

  /**
   * Create duck entity (static sensor for collision detection)
   */
  static createDuck(
    x: number,
    y: number,
    radius: number,
    rarityColor: string
  ): Entity {
    const body = Matter.Bodies.circle(x, y, radius, {
      isStatic: true,
      isSensor: true, // Allows collisions but doesn't affect physics
    });

    const renderData: DuckRenderData = {
      type: 'duck',
      x: makeMutable(x),
      y: makeMutable(y),
      radius,
      rarityColor,
    };

    return {
      id: 'duck', // Fixed ID for easy lookup
      type: 'duck',
      body,
      renderData,
      metadata: { isCuttable: false, isDuck: true },
    };
  }

  /**
   * Create path from existing body (used after cutting)
   */
  static createPathFromBody(
    body: Matter.Body,
    parentId?: string,
    generation?: number
  ): Entity {
    const { path, bounds } = createPathFromBody(body);

    // body.position is the centroid in world space
    // Path vertices are relative to body.position, so centroid is at (0, 0) in path space
    // We position the path at body.position
    const renderData: PathRenderData = {
      type: 'path',
      x: makeMutable(body.position.x),
      y: makeMutable(body.position.y),
      angle: makeMutable([{ rotateZ: body.angle }]),
      origin: makeMutable(vec(0, 0)),
      path,
      centroid: { x: 0, y: 0 },
      width: bounds.width,
      height: bounds.height,
    };

    return {
      id: this.generateId('path-cut'),
      type: 'path',
      body,
      renderData,
      metadata: {
        isCuttable: true,
        parentId,
        generation: (generation ?? 0) + 1,
        createdAt: Date.now(),
      },
    };
  }
}
