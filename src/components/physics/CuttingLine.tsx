/**
 * CuttingLine Component
 * Main game canvas with cutting gesture and entity rendering
 */

import { Canvas, Skia, SkPoint } from '@shopify/react-native-skia';
import { useState } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS, useSharedValue } from 'react-native-reanimated';
import type { Entity } from '@engine';
import { Ball } from './Ball';
import { Box } from './Box';
import { Duck } from './Duck';
import { Wall } from './Wall';
import { Polygon } from './Polygon';
import { DraggableBall } from './DraggableBall';

interface CuttingLineProps {
  entities: Entity[];
  onCut?: (p1: SkPoint, p2: SkPoint) => void;
}

export const CuttingLine = ({ entities, onCut }: CuttingLineProps) => {
  const p1 = useSharedValue<SkPoint | null>(null);
  const p2 = useSharedValue<SkPoint | null>(null);

  const handleCut = (p1: SkPoint, p2: SkPoint) => {
    onCut?.(p1, p2);
  };

  /**
   * Pan gesture for drawing cutting line
   */
  const cuttingGesture = Gesture.Pan()
    .maxPointers(1)
    .onStart((e) => {
      p1.value = Skia.Point(e.x, e.y);
    })
    .onChange((e) => {
      if (p1.value) {
        p2.value = Skia.Point(e.x, e.y);
      }
    })
    .onEnd((e) => {
      if (p1.value && p2.value) {
        runOnJS(handleCut)(p1.value, p2.value);

        p2.value = null;
        p1.value = null;
      }
    });

  // Find ball entity for draggable overlay
  const ballEntity = entities.find((e) => e.type === 'ball');

  return (
    <>
      <GestureDetector gesture={cuttingGesture}>
        <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
          <Canvas style={{ width: '100%', height: '100%' }}>
            {/* Render cutting line while drawing */}
            {/* {line && <Line
              p1={p1}
              p2={p2}
              color="lightblue"
              style="stroke"
              strokeWidth={4}
            />} */}

            {/* Render all entities */}
            {entities.map((entity) => {
              switch (entity.renderData.type) {
                case 'ball':
                  return <Ball key={entity.id} entity={entity} />;
                case 'polygon':
                  return <Polygon key={entity.id} renderData={entity.renderData} />;
                case 'wall':
                  return <Wall key={entity.id} entity={entity} />;
                case 'box':
                  return <Box key={entity.id} entity={entity} />;
                case 'duck':
                  return <Duck key={entity.id} entity={entity} />;
                default:
                  return null;
              }
            })}
          </Canvas>
        </View>
      </GestureDetector>

      {/* Draggable ball overlay */}
      {ballEntity && <DraggableBall entity={ballEntity} />}
    </>
  );
};
