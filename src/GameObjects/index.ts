import { Skia, vec } from '@shopify/react-native-skia';
import Constants from 'expo-constants';
import Matter from 'matter-js';
import { Dimensions } from 'react-native';
import { makeMutable } from 'react-native-reanimated';
import { BallCoords } from './Ball.object';
import { BoxCoords } from './Box.object';
import { PathCoords } from './Path.object';
import { WallCoords } from './Wall.object';
import decomp from 'poly-decomp';


Matter.Common.setDecomp(decomp)

export type GameObjects = BoxCoords | BallCoords | PathCoords | WallCoords;

// Set up concave polygon decomposition for Matter.js

export const engine = Matter.Engine.create();
export const world = engine.world;



export const { height, width } = Dimensions.get('window');

const statusBarHeight = Constants.statusBarHeight;

export const BOX_SIZE = 50;
export const BALL_SIZE = 20;
export const BOTTOM_HEIGHT = 40;
export const WALL_THICKNESS = 20;

const bottomWall = Matter.Bodies.rectangle(
  width / 2,
  height - (statusBarHeight || WALL_THICKNESS) / 2,
  width,
  statusBarHeight || WALL_THICKNESS,
  { isStatic: true }
);

const leftWall = Matter.Bodies.rectangle(
  WALL_THICKNESS / 2,
  height / 2,
  WALL_THICKNESS,
  height,
  { isStatic: true }
);

const rightWall = Matter.Bodies.rectangle(
  width - WALL_THICKNESS / 2,
  height / 2,
  WALL_THICKNESS,
  height,
  { isStatic: true }
);

const topWall = Matter.Bodies.rectangle(
  width / 2,
  (statusBarHeight || WALL_THICKNESS) / 2,
  width,
  statusBarHeight || WALL_THICKNESS,
  {
    isStatic: true,
  }
);

export const topWallCoords: WallCoords = {
  id: 'top-wall',
  x: 0,
  y: 0,
  width: width,
  height: statusBarHeight || WALL_THICKNESS,
  type: 'wall',
};

export const bottomWallCoords: WallCoords = {
  id: 'bottom-wall',
  x: 0,
  y: height - (statusBarHeight || WALL_THICKNESS),
  width: width,
  height: statusBarHeight || WALL_THICKNESS,
  type: 'wall',
};

export const leftWallCoords: WallCoords = {
  id: 'left-wall',
  x: 0,
  y: 0,
  width: WALL_THICKNESS,
  height: height,
  type: 'wall',
};

export const rightWallCoords: WallCoords = {
  id: 'right-wall',
  x: width - WALL_THICKNESS,
  y: 0,
  width: WALL_THICKNESS,
  height: height,
  type: 'wall',
};

export const ballCoords: BallCoords = {
  id: 'ball-0',
  x: makeMutable(width * 0.15),
  y: makeMutable(height * 0.83),
  radius: BALL_SIZE,
  type: 'ball',
};

export const ball = Matter.Bodies.circle(
  ballCoords.x.value,
  ballCoords.y.value,
  ballCoords.radius,
  {
    density: 0.004,
    restitution: 0.9,
  }
);

export const boxCoords: BoxCoords = {
  id: 'box-0',
  x: makeMutable(width * 0.15),
  y: makeMutable(height * 0.5),
  angle: makeMutable([{ rotateZ: 0 }]),
  width: BOX_SIZE,
  height: BOX_SIZE,
  origin: makeMutable(vec(width / 2 + BOX_SIZE / 2, 200 / 2 + BOX_SIZE / 2)),
  type: 'box',
};

export const box = Matter.Bodies.rectangle(
  boxCoords.x.value,
  boxCoords.y.value,
  BOX_SIZE,
  BOX_SIZE,
  {
    restitution: 0.9,
    density: 0.004,
  }
);

const rrct2 = Skia.Path.Make();
rrct2.addPoly(
  [
    vec(128, 0),
    vec(168, 80),
    vec(256, 93),
    vec(192, 155),
    vec(207, 244),
    vec(128, 202),
    vec(49, 244),
    vec(64, 155),
    vec(0, 93),
    vec(88, 80),
  ],
  true
);

const triangleVertice2 = Matter.Vertices.fromPath(
  '128 0 168 80 256 93 192 155 207 244 128 202 49 244 64 155 0 93 88 80'
);

// Calculate the centroid to match Matter.js centering
const centroid2 = Matter.Vertices.centre(triangleVertice2);

export const triangleCoords2: PathCoords = {
  id: 'triangle-1',
  x: makeMutable(width * 0.15),
  y: makeMutable(height * 0.5),
  path: rrct2,
  angle: makeMutable([{ rotateZ: 0 }]),
  origin: makeMutable(vec(centroid2.x, centroid2.y)),
  width: rrct2.getBounds().width,
  height: rrct2.getBounds().height,
  centroid: { x: centroid2.x, y: centroid2.y },
  type: 'path',
};

export const triangle2 = Matter.Bodies.fromVertices(
  triangleCoords2.x.value + centroid2.x,
  triangleCoords2.y.value + centroid2.y,
  [triangleVertice2],
  {
    restitution: 0.9,
    density: 0.004,
  }
);

// const triangleVertice = Matter.Vertices.fromPath(
//   '15 0 19.7 9.4 30 10.9 22.5 18.2 24.2 28.6 15 23.7 5.7 28.6 7.5 18.2 0 10.9 10.3 9.4 15 0'
// );

// const rrct = Skia.Path.Make();
// rrct.addPoly(
//   [
//     vec(15, 0),
//     vec(19.7, 9.4),
//     vec(30, 10.9),
//     vec(22.5, 18.2),
//     vec(24.2, 28.6),
//     vec(15, 23.7),
//     vec(5.7, 28.6),
//     vec(7.5, 18.2),
//     vec(0, 10.9),
//     vec(10.3, 9.4),
//     vec(15, 0),
//   ],
//   true
// );

// export const triangleCoords: PathCoords = {
//   id: 'triangle-0',
//   x: makeMutable(width * 0.15),
//   y: makeMutable(height * 0.5),
//   path: rrct,
//   angle: makeMutable([{ rotateZ: 0 }]),
//   origin: makeMutable(
//     vec(rrct.getBounds().width / 2, rrct.getBounds().height / 2)
//   ),
//   width: rrct.getBounds().width,
//   height: rrct.getBounds().height,
//   type: 'path',
// };

// export const triangle = Matter.Bodies.fromVertices(
//   triangleCoords.x.value,
//   triangleCoords.y.value,
//   [triangleVertice],
//   {
//     restitution: 0.9,
//     density: 0.004,
//   }
// );

Matter.World.add(world, [
 // triangle,
  triangle2,
  ball,
  bottomWall,
  leftWall,
  rightWall,
  topWall,
]);
