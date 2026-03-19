import React from 'react';
import { Canvas, Rect } from '@shopify/react-native-skia';
import { Entity } from '../systems/Entity.types';

interface ObstacleDisplayProps {
  entities: Entity[];
  width: number;
  height: number;
}

/**
 * ObstacleDisplay Component
 *
 * Renders obstacles using React Native Skia based on Matter.js positions
 * Updates automatically as entity positions change
 */
export const ObstacleDisplay: React.FC<ObstacleDisplayProps> = ({ entities, width, height }) => {
  return (
    <Canvas style={{ width, height }} pointerEvents="none">
      {entities.map((entity) => {
        // Only render obstacles (boxes with isObstacle metadata)
        if (entity.renderData.type === 'box' && entity.metadata?.isObstacle) {
          // For boxes, renderData.x and y are the top-left corner after PhysicsSync
          const boxWidth = entity.renderData.width;
          const boxHeight = entity.renderData.height;

          return (
            <Rect
              key={entity.id}
              x={entity.renderData.x}
              y={entity.renderData.y}
              width={boxWidth}
              height={boxHeight}
              color="#ff4444"
              style="fill"
            />
          );
        }
        return null;
      })}
    </Canvas>
  );
};
