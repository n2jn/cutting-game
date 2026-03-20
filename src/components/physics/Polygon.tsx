/**
 * Polygon Component
 * Renders polygon entities using Skia Path with rotation
 */

import { Path, vec, processTransform3d, usePathValue } from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';
import type { PolygonRenderData } from '@engine';
import { SkiaPathFactory, ReanimatedFactory } from '@engine';
import { useReactiveVector } from '@hooks';

const skiaPathFactory = new SkiaPathFactory();
const reanimatedFactory = new ReanimatedFactory();

interface PolygonProps {
  renderData: PolygonRenderData;
}

export const Polygon = ({ renderData }: PolygonProps) => {
  // Unwrap the abstract RenderPath to get the actual SkPath
  const skPath = skiaPathFactory.unwrap(renderData.path);
  const { sharedValue: positionShared } = useReactiveVector(renderData.position);
  const { sharedValue: originShared } = useReactiveVector(renderData.rotationOrigin);
  const angleShared = reanimatedFactory.unwrap(renderData.angle);

  const clip = usePathValue((path) => {
    'worklet';

    path.transform(
      processTransform3d([
        {
          translate: [positionShared.value.x, positionShared.value.y],
        },
      ])
    );
  }, skPath);

  // Derive rotation origin as SkPoint
  const origin = useDerivedValue(() => {
    return vec(originShared.value.x, originShared.value.y);
  });

  // Derive rotation transform
  const transform = useDerivedValue(() => {
    return [{ rotateZ: angleShared.value }];
  });

  return (
    <Path
      path={clip}
      color="red"
      origin={origin}
      transform={transform}
      strokeWidth={4}
      style="stroke"
      strokeCap="round"
      strokeJoin="round"
    />
  );
};
