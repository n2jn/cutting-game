/**
 * Box Component
 * Renders box entities using Skia Rect with rotation
 */

import { Rect, vec } from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';
import type { Entity } from '@engine';
import { ReanimatedFactory } from '@engine';
import { useReactiveVector } from '@hooks';

const reanimatedFactory = new ReanimatedFactory();

interface BoxProps {
  entity: Entity;
}

export const Box = ({ entity }: BoxProps) => {
  if (entity.renderData.type !== 'box') return null;
  const renderData = entity.renderData;

  const { x, y } = useReactiveVector(renderData.position);
  const { sharedValue: originShared } = useReactiveVector(renderData.rotationOrigin);
  const angleShared = reanimatedFactory.unwrap(renderData.angle);

  const origin = useDerivedValue(() => vec(originShared.value.x, originShared.value.y));
  const transform = useDerivedValue(() => [{ rotateZ: angleShared.value }]);

  return (
    <Rect
      key={entity.id}
      x={x}
      y={y}
      width={renderData.width}
      height={renderData.height}
      origin={origin}
      transform={transform}
      color="purple"
      strokeWidth={3}
    />
  );
};
