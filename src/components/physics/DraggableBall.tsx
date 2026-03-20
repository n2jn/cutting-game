/**
 * DraggableBall Component
 * Provides drag interaction for ball entities
 * MIGRATED: Direct Matter.js access for now (TODO: add manipulation methods to PhysicsEngine)
 */

import { useSharedValue, runOnJS, useAnimatedStyle } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Matter from 'matter-js';
import type { Entity, Vector2D } from '@engine';
import { ReanimatedFactory } from '@engine';

const reanimatedFactory = new ReanimatedFactory();

interface DraggableBallProps {
  entity: Entity;
}

export const DraggableBall = ({ entity }: DraggableBallProps) => {
  if (entity.renderData.type !== 'ball' || !entity.physicsBody) return null;

  const renderData = entity.renderData;
  const positionShared = reanimatedFactory.unwrap(renderData.position);
  const startPosition = useSharedValue({ x: 0, y: 0 });

  // Get the underlying Matter.Body for direct manipulation
  // TODO: This should go through a proper abstraction in PhysicsEngine
  const getMatterBody = (): Matter.Body | null => {
    if (entity.physicsBody && 'getMatterBody' in entity.physicsBody) {
      return (entity.physicsBody as any).getMatterBody();
    }
    return null;
  };

  const updateBallVelocity = (velocity: Vector2D) => {
    const body = getMatterBody();
    if (body) {
      Matter.Body.setVelocity(body, { x: velocity.x, y: velocity.y });
    }
  };

  const updateBallPosition = (position: Vector2D) => {
    const body = getMatterBody();
    if (body) {
      Matter.Body.setPosition(body, { x: position.x, y: position.y });
    }
  };

  const updateSleep = (sleep: boolean) => {
    const body = getMatterBody();
    if (body) {
      Matter.Sleeping.set(body, sleep);
    }
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startPosition.value = { ...positionShared.value };
      runOnJS(updateBallVelocity)({ x: 0, y: 0 });
      runOnJS(updateSleep)(true);
    })
    .onChange((e) => {
      const newPosition = {
        x: startPosition.value.x + e.translationX,
        y: startPosition.value.y + e.translationY,
      };
      runOnJS(updateBallPosition)(newPosition);
    })
    .onEnd((e) => {
      runOnJS(updateSleep)(false);
      runOnJS(updateBallVelocity)({
        x: e.velocityX * 0.01,
        y: e.velocityY * 0.01,
      });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    top: -renderData.radius,
    left: -renderData.radius,
    width: renderData.radius * 2,
    height: renderData.radius * 2,
    transform: [
      { translateX: positionShared.value.x as number },
      { translateY: positionShared.value.y as number },
    ] as any,
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={animatedStyle} />
    </GestureDetector>
  );
};
