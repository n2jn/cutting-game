import {
  Path,
  processTransform3d,
  usePathValue,
} from '@shopify/react-native-skia';
import { useEffect } from 'react';
import { useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { PathCoords } from './GameObjects/Path.object';

export const PathsAnimated = ({ pathCoords }: { pathCoords: PathCoords }) => {
  const rotateZ = useSharedValue(0);

  useEffect(() => {
    rotateZ.value = withRepeat(
      withTiming(Math.PI * 2, { duration: 4000 }),
      -1,
      false
    );
  }, [rotateZ]);

  const clip = usePathValue((path) => {
    'worklet';

    //console.log('origin ', pathCoords.origin.value.x);

    path.transform(
      processTransform3d([
        {
          translate: [pathCoords.x.value, pathCoords.y.value],
        },
      ])
    );
  }, pathCoords.path);

  return (
    <Path
      path={clip}
      color={'red'}
      origin={pathCoords.origin}
      transform={pathCoords.angle}
      strokeWidth={4}
      style="stroke"
      strokeCap="round"
      strokeJoin="round"
    />
  );
};
