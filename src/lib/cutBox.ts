import { SkPoint, vec } from '@shopify/react-native-skia';
import Matter from 'matter-js';
import { makeMutable } from 'react-native-reanimated';
import { world } from '../GameObjects';
import { BoxCoords } from '../GameObjects/Box.object';
import { Line, lineIntersection, lineSegmentsIntersect, Point } from './decomp';

export function cutBox(p1: SkPoint, p2: SkPoint) {
  const bodies = Matter.Composite.allBodies(world);
  console.log(bodies.map((b) => b.id));
  console.log('p1', p1.x, '-', p1.y);
  console.log('p2', p2.x, '-', p2.y);

  console.log(' --------------- ');

  const cutCollisions = Matter.Query.ray(bodies, p1, p2);

  const cutLine: Line = [
    { x: p1.x, y: p1.y },
    { x: p2.x, y: p2.y },
  ];

  cutCollisions.forEach((collision, i) => {
    // check along the edge lines
    const vertices = collision.bodyA.vertices;
    console.log(vertices.map((v) => v.x + ' ' + v.y));
    vertices.map((v, j) => {
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
        const intersection = lineIntersection(cutLine, edge);

        // creat rect for collision
        // context.rect(intersection[0] - 3.5, intersection[1] - 3.5, 4, 4);
      }
    });
  });
  return cutTheBodies(cutCollisions, cutLine);
}

export function cutTheBodies(cutCollisions: Matter.Collision[], cutLine: Line) {
  const newBodies: Matter.Body[] = [];
  const newVertices: Matter.Vertices[] = [];
  const removedBodies: Matter.Body[] = [];

  cutCollisions.forEach((collision, i) => {
    if (collision.bodyA.isStatic) {
      console.log('Static Body. Do not Cut!');
      return;
    }

    const vertices = collision.bodyA.vertices;
    const cutPoints: Point[] = [];
    const cutIndexes: number[] = [];

    vertices.map((v, j) => {
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

    console.log('indexes', cutIndexes);

    if (cutIndexes.length == 2) {
      console.log('can cut the body');
      Matter.World.remove(world, collision.bodyA, true);
      removedBodies.push(collision.bodyA);
      let body1Path = '',
        body2Path = '';

      for (let j = 0; j < vertices.length; j++) {
        body1Path += vertices[j].x + ' ' + vertices[j].y + ' ';
        if (j == cutIndexes[0]) {
          // add two cut points
          body1Path += cutPoints[0].x + ' ' + cutPoints[0].y + ' ';
          body1Path += cutPoints[1].x + ' ' + cutPoints[1].y + ' ';
          j = cutIndexes[1];
          continue;
        }
      }
      const body1Vertices = Matter.Vertices.fromPath(
        body1Path,
        collision.bodyA
      );
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

      newVertices.push(body1Vertices);
      newBodies.push(body1);
      Matter.World.add(world, body1);

      body2Path += cutPoints[0].x + ' ' + cutPoints[0].y + ' ';
      for (let j = cutIndexes[0] + 1; j < vertices.length; j++) {
        body2Path += vertices[j].x + ' ' + vertices[j].y + ' ';
        if (j == cutIndexes[1]) {
          body2Path += cutPoints[1].x + ' ' + cutPoints[1].y + ' ';
          break;
        }
      }
      const body2Vertices = Matter.Vertices.fromPath(
        body2Path,
        collision.bodyA
      );
      console.log('body2Path => ', JSON.stringify(body2Path));
      //console.log('collision.bodyA => ', JSON.stringify(collision.bodyA));

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

      console.log('vertices => ', body2Vertices);

      newVertices.push(body2Vertices);

      newBodies.push(body2);
      Matter.World.add(world, body2);
    }
  });

  return { newBodies: newBodies, newVertices: newVertices, removedBodies: removedBodies };
}

/**
 * Cut a box in half vertically
 * @param boxBody - The Matter.js body to cut
 * @param boxElement - The box coordinates element
 * @param world - The Matter.js world
 * @returns Array of [leftHalf, rightHalf] as { body, coords }
 */
export function cutBoxInHalf(
  boxBody: Matter.Body,
  boxElement: BoxCoords,
  world: Matter.World
) {
  const boxWidth = boxElement.width;
  const boxHeight = boxElement.height;
  const halfWidth = boxWidth / 2;

  // Create left half
  const leftBody = Matter.Bodies.rectangle(
    boxBody.position.x - halfWidth / 2,
    boxBody.position.y,
    halfWidth,
    boxHeight,
    {
      velocity: boxBody.velocity,
      angle: boxBody.angle,
      restitution: boxBody.restitution,
      density: boxBody.density,
    }
  );

  // Create right half
  const rightBody = Matter.Bodies.rectangle(
    boxBody.position.x + halfWidth / 2,
    boxBody.position.y,
    halfWidth,
    boxHeight,
    {
      velocity: boxBody.velocity,
      angle: boxBody.angle,
      restitution: boxBody.restitution,
      density: boxBody.density,
    }
  );

  // Remove original box from world
  Matter.World.remove(world, boxBody);

  // Add new boxes to world
  Matter.World.add(world, [leftBody, rightBody]);

  // Generate unique IDs for new boxes
  const timestamp = Date.now();
  const leftId = `${boxElement.id}-left-${timestamp}`;

  // Create left coordinates
  const leftCoords: BoxCoords = {
    id: leftId,
    x: makeMutable(leftBody.position.x),
    y: makeMutable(leftBody.position.y),
    angle: makeMutable([{ rotateZ: leftBody.angle }]),
    width: halfWidth,
    height: boxHeight,
    origin: makeMutable(
      vec(
        leftBody.position.x + halfWidth / 2,
        leftBody.position.y + boxHeight / 2
      )
    ),
    type: 'box',
  };

  const rightId = `${boxElement.id}-right-${timestamp}`;

  // Create right coordinates
  const rightCoords: BoxCoords = {
    id: rightId,
    x: makeMutable(rightBody.position.x),
    y: makeMutable(rightBody.position.y),
    angle: makeMutable([{ rotateZ: rightBody.angle }]),
    width: halfWidth,
    height: boxHeight,
    origin: makeMutable(
      vec(
        rightBody.position.x + halfWidth / 2,
        rightBody.position.y + boxHeight / 2
      )
    ),
    type: 'box',
  };

  return {
    originalElement: boxElement,
    leftBody,
    leftCoords,
    rightBody,
    rightCoords,
  };
}
