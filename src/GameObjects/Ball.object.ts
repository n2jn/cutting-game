import { SharedValue } from 'react-native-reanimated';

export interface BallCoords {
  id: string;
  x: SharedValue<number>;
  y: SharedValue<number>;
  radius: number;
  type: 'ball';
}
