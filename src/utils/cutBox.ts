import { SkPoint } from '@shopify/react-native-skia';
import Matter from 'matter-js';
import { Line, lineIntersection, lineSegmentsIntersect, Point } from './decomp';

/**
 * Cut bodies along a line from p1 to p2
 * Returns new bodies and removed bodies WITHOUT directly modifying the world
 */
export function cutBox(p1: SkPoint, p2: SkPoint, world: Matter.World) {
  const bodies = Matter.Composite.allBodies(world);

  const cutCollisions = Matter.Query.ray(bodies, p1, p2);

  const cutLine: Line = [
    { x: p1.x, y: p1.y },
    { x: p2.x, y: p2.y },
  ];

  return cutTheBodies(cutCollisions, cutLine);
}

/**
 * Cut bodies along a line
 * Does NOT modify the world - just returns new and removed bodies
 */
export function cutTheBodies(cutCollisions: Matter.Collision[], cutLine: Line) {
  const newBodies: Matter.Body[] = [];
  const removedBodies: Matter.Body[] = [];

  cutCollisions.forEach((collision) => {
    if (collision.bodyA.isStatic) {
      return;
    }

    const body = collision.bodyA;
    const vertices = body.vertices;

    const cutPoints: Point[] = [];
    const cutIndexes: number[] = [];

    vertices.forEach((v, j) => {
      const edge: Line = [
        { x: v.x, y: v.y },
        {
          x: vertices[j + 1 > vertices.length - 1 ? 0 : j + 1].x,
          y: vertices[j + 1 > vertices.length - 1 ? 0 : j + 1].y,
        },
      ];
      const isIntersect = lineSegmentsIntersect(
        cutLine[0],
        cutLine[1],
        edge[0],
        edge[1]
      );
      if (isIntersect) {
        cutIndexes.push(j);
        const intersection = lineIntersection(cutLine, edge);
        cutPoints.push(intersection);
      }
    });

    // Only cut if line intersects exactly 2 edges
    if (cutIndexes.length === 2) {
      removedBodies.push(collision.bodyA);

      const idx0 = cutIndexes[0];
      const idx1 = cutIndexes[1];

      // Build first body path: from cutPoint[0] -> vertices after idx0 until idx1 -> cutPoint[1]
      // This creates one "side" of the cut
      let body1Path = cutPoints[0].x + ' ' + cutPoints[0].y + ' ';
      for (let j = idx0 + 1; j <= idx1; j++) {
        body1Path += vertices[j].x + ' ' + vertices[j].y + ' ';
      }
      body1Path += cutPoints[1].x + ' ' + cutPoints[1].y + ' ';

      const body1Vertices = Matter.Vertices.fromPath(body1Path, collision.bodyA);
      const body1Pos = Matter.Vertices.centre(body1Vertices);
      const body1 = Matter.Bodies.fromVertices(
        body1Pos.x,
        body1Pos.y,
        [body1Vertices],
        {
          restitution: collision.bodyA.restitution,
          density: collision.bodyA.density,
        }
      );
      newBodies.push(body1);

      // Build second body path: from cutPoint[1] -> vertices after idx1 wrapping around to idx0 -> cutPoint[0]
      // This creates the other "side" of the cut
      let body2Path = cutPoints[1].x + ' ' + cutPoints[1].y + ' ';
      for (let j = idx1 + 1; j < vertices.length; j++) {
        body2Path += vertices[j].x + ' ' + vertices[j].y + ' ';
      }
      for (let j = 0; j <= idx0; j++) {
        body2Path += vertices[j].x + ' ' + vertices[j].y + ' ';
      }
      body2Path += cutPoints[0].x + ' ' + cutPoints[0].y + ' ';

      const body2Vertices = Matter.Vertices.fromPath(body2Path, collision.bodyA);
      const body2Pos = Matter.Vertices.centre(body2Vertices);
      const body2 = Matter.Bodies.fromVertices(
        body2Pos.x,
        body2Pos.y,
        [body2Vertices],
        {
          restitution: collision.bodyA.restitution,
          density: collision.bodyA.density,
        }
      );
      newBodies.push(body2);
    }
  });

  return { newBodies, removedBodies };
}
