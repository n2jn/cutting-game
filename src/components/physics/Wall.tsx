/**
 * Wall Component
 * Renders wall entities using Skia Rect
 */

import { Rect } from '@shopify/react-native-skia';
import type { Entity } from '@engine';

interface WallProps {
  entity: Entity;
}

export const Wall = ({ entity }: WallProps) => {
  if (entity.renderData.type !== 'wall') return null;
  const renderData = entity.renderData;

  // Wall position comes from physics body (center), convert to top-left for rendering
  const x = renderData.position.x - renderData.width / 2;
  const y = renderData.position.y - renderData.height / 2;

  return (
    <Rect
      key={entity.id}
      x={x}
      y={y}
      width={renderData.width}
      height={renderData.height}
      color="gray"
    />
  );
};
