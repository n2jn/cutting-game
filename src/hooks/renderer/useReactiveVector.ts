/**
 * useReactiveVector Hook
 * Helper to unwrap ReactiveValue<Vector2D> to separate x/y SharedValues
 * This avoids creating derived values and uses the underlying SharedValue directly
 */

import { useDerivedValue } from 'react-native-reanimated';
import type { ReactiveValue, Vector2D } from '@engine';
import { ReanimatedFactory } from '@engine';

const reanimatedFactory = new ReanimatedFactory();

export const useReactiveVector = (reactiveVec: ReactiveValue<Vector2D>) => {
  const sharedValue = reanimatedFactory.unwrap(reactiveVec);

  const x = useDerivedValue(() => sharedValue.value.x);
  const y = useDerivedValue(() => sharedValue.value.y);

  return { x, y, sharedValue };
};
