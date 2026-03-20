/**
 * Matter.js Physics Engine Adapter
 * Implements PhysicsEngine using Matter.Engine
 */

import Matter from 'matter-js';
import { PhysicsEngine } from '../../domain/physics/PhysicsEngine';
import { PhysicsBody, BodyDefinition } from '../../domain/physics/PhysicsBody';
import { PhysicsWorld } from '../../domain/physics/PhysicsWorld';
import { Vector2D } from '../../domain/geometry/Vector2D';
import { Line } from '../../domain/geometry/Line';
import { MatterWorldAdapter } from './MatterWorldAdapter';
import { MatterBodyAdapter } from './MatterBodyWrapper';

/**
 * Adapter that implements PhysicsEngine using Matter.Engine
 */
export class MatterPhysicsEngine implements PhysicsEngine {
  private matterEngine: Matter.Engine;
  public world: PhysicsWorld;

  constructor(gravity: Vector2D = { x: 0, y: 1 }) {
    this.matterEngine = Matter.Engine.create({
      gravity: { x: gravity.x, y: gravity.y },
    });

    this.world = new MatterWorldAdapter(this.matterEngine.world);
  }

  update(deltaTime: number): void {
    Matter.Engine.update(this.matterEngine, deltaTime);
  }

  createBody(definition: BodyDefinition): PhysicsBody {
    return MatterBodyAdapter.fromDefinition(definition);
  }

  removeBody(id: string): void {
    this.world.removeBody(id);
  }

  raycast(start: Vector2D, end: Vector2D): PhysicsBody[] {
    const bodies = Matter.Composite.allBodies(this.matterEngine.world);
    const collisions = Matter.Query.ray(bodies, start, end);
    return collisions.map((c) => MatterBodyAdapter.wrap(c.bodyA));
  }

  raycastLine(line: Line): PhysicsBody[] {
    return this.raycast(line.start, line.end);
  }

  setGravity(gravity: Vector2D): void {
    this.matterEngine.world.gravity.x = gravity.x;
    this.matterEngine.world.gravity.y = gravity.y;
  }

  /**
   * Get the underlying Matter.Engine
   * Only use for Matter.js-specific operations
   */
  getMatterEngine(): Matter.Engine {
    return this.matterEngine;
  }
}
