/**
 * Matter.js Cutting Operation
 * Implements CuttingOperation using Matter.js
 * Extracted from utils/cutting.ts
 */

import Matter from 'matter-js';
import { CuttingOperation, CutResult } from '../../domain/operations/CuttingOperation';
import { PhysicsBody } from '../../domain/physics/PhysicsBody';
import { Line } from '../../domain/geometry/Line';
import { LineOperations } from '../../domain/geometry/Line';
import { Vector2D } from '../../domain/geometry/Vector2D';
import { MatterBodyAdapter } from './MatterBodyWrapper';

/**
 * Adapter that implements cutting using Matter.js
 */
export class MatterCuttingOperation implements CuttingOperation {
  cut(line: Line, bodies: PhysicsBody[]): CutResult[] {
    const results: CutResult[] = [];

    bodies.forEach((body) => {
      if (body.isStatic) return; // Don't cut static bodies

      const cutBodies = this.cutBody(line, body);
      if (cutBodies.length > 0) {
        results.push({
          originalBody: body,
          newBodies: cutBodies,
        });
      }
    });

    return results;
  }

  /**
   * Cut a single body along a line
   */
  private cutBody(line: Line, body: PhysicsBody): PhysicsBody[] {
    const vertices = body.vertices;
    const cutPoints: Vector2D[] = [];
    const cutIndexes: number[] = [];

    // Find intersections with polygon edges
    vertices.forEach((v, i) => {
      const nextIdx = (i + 1) % vertices.length;
      const edge: Line = {
        start: vertices[i],
        end: vertices[nextIdx],
      };

      if (LineOperations.doSegmentsIntersect(line, edge)) {
        cutIndexes.push(i);
        const intersection = LineOperations.intersect(line, edge);
        if (intersection) {
          cutPoints.push(intersection);
        }
      }
    });

    // Only cut if line intersects exactly 2 edges
    if (cutIndexes.length !== 2 || cutPoints.length !== 2) {
      return [];
    }

    const idx0 = cutIndexes[0];
    const idx1 = cutIndexes[1];

    // Get the underlying Matter.Body for cutting
    const matterBody = MatterBodyAdapter.unwrap(body);

    // Build first body path: from cutPoint[0] -> vertices after idx0 until idx1 -> cutPoint[1]
    let body1Path = `${cutPoints[0].x} ${cutPoints[0].y} `;
    for (let j = idx0 + 1; j <= idx1; j++) {
      body1Path += `${vertices[j].x} ${vertices[j].y} `;
    }
    body1Path += `${cutPoints[1].x} ${cutPoints[1].y} `;

    const body1Vertices = Matter.Vertices.fromPath(body1Path, matterBody);
    const body1Pos = Matter.Vertices.centre(body1Vertices);
    const body1 = Matter.Bodies.fromVertices(
      body1Pos.x,
      body1Pos.y,
      [body1Vertices],
      {
        restitution: matterBody.restitution,
        density: matterBody.density,
        friction: matterBody.friction,
        frictionAir: matterBody.frictionAir,
      }
    );

    // Build second body path: from cutPoint[1] -> vertices after idx1 wrapping to idx0 -> cutPoint[0]
    let body2Path = `${cutPoints[1].x} ${cutPoints[1].y} `;
    for (let j = idx1 + 1; j < vertices.length; j++) {
      body2Path += `${vertices[j].x} ${vertices[j].y} `;
    }
    for (let j = 0; j <= idx0; j++) {
      body2Path += `${vertices[j].x} ${vertices[j].y} `;
    }
    body2Path += `${cutPoints[0].x} ${cutPoints[0].y} `;

    const body2Vertices = Matter.Vertices.fromPath(body2Path, matterBody);
    const body2Pos = Matter.Vertices.centre(body2Vertices);
    const body2 = Matter.Bodies.fromVertices(
      body2Pos.x,
      body2Pos.y,
      [body2Vertices],
      {
        restitution: matterBody.restitution,
        density: matterBody.density,
        friction: matterBody.friction,
        frictionAir: matterBody.frictionAir,
      }
    );

    // Wrap the new Matter bodies
    return [MatterBodyAdapter.wrap(body1), MatterBodyAdapter.wrap(body2)];
  }
}
