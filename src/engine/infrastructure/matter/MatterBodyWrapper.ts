/**
 * Matter.js Body Wrapper
 * Wraps Matter.Body as PhysicsBody
 * PERFORMANCE: Holds reference, lazy property access
 */

import Matter from 'matter-js';
import { PhysicsBody, BodyDefinition, BodyShape } from '../../domain/physics/PhysicsBody';
import { Vector2D } from '../../domain/geometry/Vector2D';

/**
 * Wrapper that implements PhysicsBody using Matter.Body
 * Performance: Holds reference to underlying Matter.Body, converts on property access
 */
export class MatterBodyWrapper implements PhysicsBody {
  constructor(private body: Matter.Body) {}

  get id(): string {
    return this.body.id.toString();
  }

  get shape(): BodyShape {
    // Heuristic to detect shape
    if (this.body.circleRadius !== undefined) return 'circle';
    if (this.body.vertices.length === 4) return 'rectangle';
    return 'polygon';
  }

  get position(): Vector2D {
    return { x: this.body.position.x, y: this.body.position.y };
  }

  get velocity(): Vector2D {
    return { x: this.body.velocity.x, y: this.body.velocity.y };
  }

  get angle(): number {
    return this.body.angle;
  }

  get angularVelocity(): number {
    return this.body.angularVelocity;
  }

  get vertices(): Vector2D[] {
    return this.body.vertices.map((v) => ({ x: v.x, y: v.y }));
  }

  get isStatic(): boolean {
    return this.body.isStatic;
  }

  get isSensor(): boolean {
    return this.body.isSensor;
  }

  get mass(): number {
    return this.body.mass;
  }

  /**
   * Get the underlying Matter.Body for direct manipulation
   * Only use when you need to interact with Matter.js directly
   */
  getMatterBody(): Matter.Body {
    return this.body;
  }
}

/**
 * Adapter for creating Matter.js bodies from domain definitions
 */
export class MatterBodyAdapter {
  /**
   * Create a Matter.Body from a domain BodyDefinition
   */
  static fromDefinition(definition: BodyDefinition): MatterBodyWrapper {
    let matterBody: Matter.Body;

    switch (definition.shape) {
      case 'circle':
        if (definition.radius === undefined) {
          throw new Error('Circle requires radius');
        }
        matterBody = Matter.Bodies.circle(
          definition.position.x,
          definition.position.y,
          definition.radius,
          this.toMatterOptions(definition)
        );
        break;

      case 'rectangle':
        if (definition.width === undefined || definition.height === undefined) {
          throw new Error('Rectangle requires width and height');
        }
        matterBody = Matter.Bodies.rectangle(
          definition.position.x,
          definition.position.y,
          definition.width,
          definition.height,
          this.toMatterOptions(definition)
        );
        break;

      case 'polygon':
        if (definition.vertices === undefined) {
          throw new Error('Polygon requires vertices');
        }
        // Convert Vector2D[] to Matter.js vertices format
        matterBody = Matter.Bodies.fromVertices(
          definition.position.x,
          definition.position.y,
          [definition.vertices.map((v) => ({ x: v.x, y: v.y }))],
          this.toMatterOptions(definition)
        );
        break;

      default:
        throw new Error(`Unknown body shape: ${definition.shape}`);
    }

    return new MatterBodyWrapper(matterBody);
  }

  /**
   * Wrap an existing Matter.Body
   */
  static wrap(body: Matter.Body): MatterBodyWrapper {
    return new MatterBodyWrapper(body);
  }

  /**
   * Unwrap to get the underlying Matter.Body
   */
  static unwrap(wrapper: PhysicsBody): Matter.Body {
    if (wrapper instanceof MatterBodyWrapper) {
      return (wrapper as MatterBodyWrapper).getMatterBody();
    }
    throw new Error('Cannot unwrap non-Matter body');
  }

  /**
   * Convert domain BodyDefinition options to Matter.js options
   */
  private static toMatterOptions(
    definition: BodyDefinition
  ): Matter.IBodyDefinition {
    return {
      isStatic: definition.isStatic ?? false,
      isSensor: definition.isSensor ?? false,
      density: definition.density,
      restitution: definition.restitution,
      friction: definition.friction,
      frictionAir: definition.frictionAir,
    };
  }
}
