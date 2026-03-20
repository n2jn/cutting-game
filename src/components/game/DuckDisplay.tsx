import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import type { Entity } from '@engine';
import { ReanimatedFactory } from '@engine';

const reanimatedFactory = new ReanimatedFactory();

interface DuckDisplayProps {
  duckEntity: Entity | undefined;
}

/**
 * DuckDisplay Component
 *
 * Renders duck emoji positioned at the duck entity's location
 * MIGRATED: Now uses @engine and reactive position with unwrapped SharedValue
 */
export const DuckDisplay: React.FC<DuckDisplayProps> = ({ duckEntity }) => {
  if (!duckEntity || duckEntity.renderData.type !== 'duck') {
    return null;
  }

  const renderData = duckEntity.renderData;
  const positionShared = reanimatedFactory.unwrap(renderData.position);

  // Use duck radius to properly center the emoji
  const emojiSize = renderData.radius * 2;

  const animatedStyle = useAnimatedStyle(() => ({
    left: positionShared.value.x - emojiSize / 2,
    top: positionShared.value.y - emojiSize / 2,
    width: emojiSize,
    height: emojiSize,
  }));

  return (
    <Animated.View
      style={[styles.duckContainer, animatedStyle]}
      pointerEvents="none"
    >
      <Text style={[styles.duckEmoji, { fontSize: emojiSize }]}>🦆</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  duckContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
    pointerEvents: 'none',
  },
  duckEmoji: {
    // fontSize set dynamically based on duck radius
  },
});
