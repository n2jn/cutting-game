import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Entity } from '../systems/Entity.types';

interface DuckDisplayProps {
  duckEntity: Entity | undefined;
}

/**
 * DuckDisplay Component
 *
 * Renders duck emoji positioned at the duck entity's location
 */
export const DuckDisplay: React.FC<DuckDisplayProps> = ({ duckEntity }) => {
  if (!duckEntity || duckEntity.renderData.type !== 'duck') {
    return null;
  }

  return (
    <View
      style={[
        styles.duckContainer,
        {
          left: duckEntity.renderData.x.value - 20,
          top: duckEntity.renderData.y.value - 20,
        },
      ]}
      pointerEvents="none"
    >
      <Text style={styles.duckEmoji}>🦆</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  duckContainer: {
    position: 'absolute',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
    pointerEvents: 'none',
  },
  duckEmoji: {
    fontSize: 40,
  },
});
