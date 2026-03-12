import { SkPath, SkPoint } from '@shopify/react-native-skia';
import { SharedValue } from 'react-native-reanimated';

export interface PathCoords {
  id: string;
  x: SharedValue<number>;
  y: SharedValue<number>;
  angle: SharedValue<[{ rotateZ: number }]>;
  origin: SharedValue<SkPoint>;
  width: number;
  height: number;
  path: SkPath;
  centroid?: { x: number; y: number };
  type: 'path';
}
