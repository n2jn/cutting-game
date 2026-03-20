import React from 'react';
import { Canvas, Rect, vec } from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';
import type { Entity, ReactiveValue, Vector2D } from '@engine';
import { ReanimatedFactory } from '@engine';

const reanimatedFactory = new ReanimatedFactory();

interface ObstacleDisplayProps {
  entities: Entity[];
  width: number;
  height: number;
}

/**
 * Helper to unwrap ReactiveValue<Vector2D> to separate x/y SharedValues
 */
const useReactiveVector = (reactiveVec: ReactiveValue<Vector2D>) => {
  const sharedValue = reanimatedFactory.unwrap(reactiveVec);
  const x = useDerivedValue(() => sharedValue.value.x);
  const y = useDerivedValue(() => sharedValue.value.y);
  return { x, y, sharedValue };
};

/**
 * Single obstacle renderer component
 * Extracts hooks to component level (Rules of Hooks)
 */
const ObstacleBox = ({ entity }: { entity: Entity }) => {
  if (entity.renderData.type !== 'box' || !entity.metadata?.isObstacle) {
    return null;
  }

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
      color="#ff4444"
      style="fill"
    />
  );
};

/**
 * ObstacleDisplay Component
 *
 * Renders obstacles using React Native Skia based on physics positions
 * Updates automatically as entity positions change
 * MIGRATED: Now uses @engine with reactive position values
 */
export const ObstacleDisplay: React.FC<ObstacleDisplayProps> = ({ entities, width, height }) => {
  return (
    <Canvas style={{ width, height }} pointerEvents="none">
      {entities
        .filter((entity) => entity.renderData.type === 'box' && entity.metadata?.isObstacle)
        .map((entity) => (
          <ObstacleBox key={entity.id} entity={entity} />
        ))}
    </Canvas>
  );
};
