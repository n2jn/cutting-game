import React from 'react';
import { Canvas, Circle, Group } from '@shopify/react-native-skia';
import { StyleSheet, Text, View } from 'react-native';
import type { Duck } from '@game';
import { RARITY_COLORS } from '@game';

interface DuckOverlayProps {
  duck: Duck;
  width: number;
  height: number;
}

export const DuckOverlay: React.FC<DuckOverlayProps> = ({ duck, width, height }) => {
  // Position the duck (simple positioning for now)
  const duckX = 50;
  const duckY = height - 80;
  const duckSize = 30;

  const rarityColor = RARITY_COLORS[duck.variant];

  return (
    <>
      {/* Skia Canvas for effects */}
      <Canvas style={[styles.canvas, { width, height }]} pointerEvents="none">
        <Group>
          {/* Duck circle background with glow */}
          <Circle cx={duckX} cy={duckY} r={duckSize} color={rarityColor} opacity={0.3} />

          {/* Rarity indicator */}
          <Circle cx={duckX + duckSize - 5} cy={duckY - duckSize + 5} r={8} color={rarityColor} />
        </Group>
      </Canvas>

      {/* React Native Text for emoji (positioned absolutely) */}
      <View style={[styles.emojiContainer, { width, height }]} pointerEvents="none">
        <Text style={[styles.duckEmoji, { left: duckX - 15, top: duckY - 15 }]}>
          🦆
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 5,
  },
  emojiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 6,
  },
  duckEmoji: {
    position: 'absolute',
    fontSize: 30,
  },
});
