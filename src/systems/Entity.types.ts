import { SharedValue } from 'react-native-reanimated';
import { SkPath, SkPoint } from '@shopify/react-native-skia';
import Matter from 'matter-js';

/**
 * Core Entity interface - binds physics body to render data
 */
export interface Entity {
  id: string;
  type: 'ball' | 'box' | 'path' | 'wall' | 'duck';
  body: Matter.Body | null; // null for static walls
  renderData: RenderData;
  metadata?: EntityMetadata;
}

/**
 * Render data with reactive properties (discriminated union)
 */
export type RenderData =
  | BallRenderData
  | BoxRenderData
  | PathRenderData
  | WallRenderData
  | DuckRenderData;

export interface BallRenderData {
  type: 'ball';
  x: SharedValue<number>;
  y: SharedValue<number>;
  radius: number;
}

export interface BoxRenderData {
  type: 'box';
  x: SharedValue<number>;
  y: SharedValue<number>;
  angle: SharedValue<[{ rotateZ: number }]>;
  origin: SharedValue<SkPoint>;
  width: number;
  height: number;
}

export interface PathRenderData {
  type: 'path';
  x: SharedValue<number>;
  y: SharedValue<number>;
  angle: SharedValue<[{ rotateZ: number }]>;
  origin: SharedValue<SkPoint>;
  path: SkPath;
  centroid: { x: number; y: number };
  width: number;
  height: number;
}

export interface WallRenderData {
  type: 'wall';
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DuckRenderData {
  type: 'duck';
  x: SharedValue<number>;
  y: SharedValue<number>;
  radius: number;
  rarityColor: string;
}

/**
 * Optional metadata for entity behavior
 */
export interface EntityMetadata {
  isCuttable?: boolean;
  createdAt?: number;
  parentId?: string; // For tracking cut pieces
  generation?: number; // How many times cut from original
  isDuck?: boolean; // Marks this as the player's duck
  isObstacle?: boolean; // Marks this as an obstacle for runner games
  scored?: boolean; // Whether this obstacle has been scored
}
