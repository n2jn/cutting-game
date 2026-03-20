/**
 * Ball Component
 * Renders ball entities using Skia Circle
 */

import { Circle } from '@shopify/react-native-skia';
import type { Entity } from '@engine';
import { useReactiveVector } from '@hooks';

interface BallProps {
  entity: Entity;
}

export const Ball = ({ entity }: BallProps) => {
  if (entity.renderData.type !== 'ball') return null;
  const renderData = entity.renderData;

  const { x: cx, y: cy } = useReactiveVector(renderData.position);

  return (
    <Circle
      key={entity.id}
      cx={cx}
      cy={cy}
      r={renderData.radius}
      color="limegreen"
    />
  );
};
