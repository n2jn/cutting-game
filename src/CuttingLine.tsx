import {
  Canvas,
  Circle,
  Line,
  Path,
  Rect,
  Skia,
  SkPoint,
  processTransform3d,
  usePathValue,
} from '@shopify/react-native-skia';
import { useState } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import Matter from 'matter-js';
import { Entity, PathRenderData } from './systems/Entity.types';

/**
 * Helper component for rendering animated Path with combined transforms
 */
const AnimatedPath = ({ renderData }: { renderData: PathRenderData }) => {
  const clip = usePathValue((path) => {
    'worklet';

    path.transform(
      processTransform3d([
        {
          translate: [renderData.x.value, renderData.y.value],
        },
      ])
    );
  }, renderData.path);

  return (
    <Path
      path={clip}
      color="red"
      origin={renderData.origin}
      transform={renderData.angle}
      strokeWidth={4}
      style="stroke"
      strokeCap="round"
      strokeJoin="round"
    />
  );
};

/**
 * Draggable ball component overlay
 */
const DraggableBall = ({ entity }: { entity: Entity }) => {
  if (!entity.body || entity.renderData.type !== 'ball') return null;

  const renderData = entity.renderData;
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const updateBallVelocity = (x: number, y: number) => {
    if (entity.body) {
      Matter.Body.setVelocity(entity.body, { x, y });
    }
  };

  const updateBallPosition = (x: number, y: number) => {
    if (entity.body) {
      Matter.Body.setPosition(entity.body, { x, y });
    }
  };

  const updateSleep = (sleep: boolean) => {
    if (entity.body) {
      Matter.Sleeping.set(entity.body, sleep);
    }
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startX.value = renderData.x.value;
      startY.value = renderData.y.value;
      runOnJS(updateBallVelocity)(0, 0);
      runOnJS(updateSleep)(true);
    })
    .onChange((e) => {
      const newX = startX.value + e.translationX;
      const newY = startY.value + e.translationY;
      runOnJS(updateBallPosition)(newX, newY);
    })
    .onEnd((e) => {
      runOnJS(updateSleep)(false);
      runOnJS(updateBallVelocity)(e.velocityX * 0.01, e.velocityY * 0.01);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    top: -renderData.radius,
    left: -renderData.radius,
    width: renderData.radius * 2,
    height: renderData.radius * 2,
    transform: [
      { translateX: renderData.x.value as number },
      { translateY: renderData.y.value as number },
    ] as any,
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={animatedStyle} />
    </GestureDetector>
  );
};

export const CuttingLine = ({
  entities,
  onCut,
}: {
  entities: Entity[];
  onCut?: (p1: SkPoint, p2: SkPoint) => void;
}) => {
  const p1 = useSharedValue<SkPoint | null>(null);
  const p2 = useSharedValue<SkPoint | null>(null);
  const [line, setLine] = useState<SkPoint[] | null>(null);

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
      runOnJS(setLine)([p1.value, p1.value]);
    })
    .onChange((e) => {
      if (p1.value) {
        p2.value = Skia.Point(e.x, e.y);
        runOnJS(setLine)([p1.value, p2.value]);
      }
    })
    .onEnd((e) => {
      if (p1.value && p2.value) {
        runOnJS(handleCut)(p1.value, p2.value);

        p2.value = null;
        p1.value = null;
        runOnJS(setLine)(null);
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
            {line && (
              <Line
                p1={line[0]}
                p2={line[1]}
                color="lightblue"
                style="stroke"
                strokeWidth={4}
              />
            )}

            {/* Render all entities */}
            {entities.map((entity) => {
              const { renderData } = entity;

              switch (renderData.type) {
                case 'ball':
                  return (
                    <Circle
                      key={entity.id}
                      cx={renderData.x}
                      cy={renderData.y}
                      r={renderData.radius}
                      color="limegreen"
                    />
                  );

                case 'path':
                  return <AnimatedPath key={entity.id} renderData={renderData} />;

                case 'wall':
                  return (
                    <Rect
                      key={entity.id}
                      x={renderData.x}
                      y={renderData.y}
                      width={renderData.width}
                      height={renderData.height}
                      color="gray"
                    />
                  );

                case 'box':
                  return (
                    <Rect
                      key={entity.id}
                      x={renderData.x}
                      y={renderData.y}
                      width={renderData.width}
                      height={renderData.height}
                      origin={renderData.origin}
                      transform={renderData.angle}
                      color="purple"
                      strokeWidth={3}
                    />
                  );

                case 'duck':
                  return (
                    <Circle
                      key={entity.id}
                      cx={renderData.x}
                      cy={renderData.y}
                      r={renderData.radius}
                      color={renderData.rarityColor}
                      opacity={0.3}
                    />
                  );

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
