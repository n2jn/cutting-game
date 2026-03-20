/**
 * Duck Component
 * Renders duck entity using Skia Circle (semi-transparent)
 */

import { Circle } from '@shopify/react-native-skia';
import type { Entity } from '@engine';
import { useReactiveVector } from '@hooks';

interface DuckProps {
  entity: Entity;
}

export const Duck = ({ entity }: DuckProps) => {
  if (entity.renderData.type !== 'duck') return null;
  const renderData = entity.renderData;

  const { x: cx, y: cy } = useReactiveVector(renderData.position);

  return (
    <Circle
      key={entity.id}
      cx={cx}
      cy={cy}
      r={renderData.radius}
      color={renderData.rarityColor}
      opacity={0.3}
    />
  );
};
