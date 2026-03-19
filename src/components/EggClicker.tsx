import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Egg, RARITY_COLORS } from '../types/game';

interface EggClickerProps {
  egg: Egg;
  onPress: () => void;
}

export const EggClicker: React.FC<EggClickerProps> = ({ egg, onPress }) => {
  const progress = egg.clicks / egg.clicksRequired;
  const rarityColor = RARITY_COLORS[egg.variant];

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.eggContainer,
          { borderColor: rarityColor },
          pressed && styles.pressed,
        ]}
        onPress={onPress}
      >
        <Text style={styles.eggEmoji}>🥚</Text>
        <Text style={[styles.rarityLabel, { color: rarityColor }]}>
          {egg.variant.toUpperCase()}
        </Text>
      </Pressable>

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          {egg.clicks} / {egg.clicksRequired}
        </Text>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${progress * 100}%`,
                backgroundColor: rarityColor,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  eggContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 4,
    backgroundColor: '#16213e',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  pressed: {
    transform: [{ scale: 0.95 }],
  },
  eggEmoji: {
    fontSize: 80,
  },
  rarityLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  progressContainer: {
    width: '100%',
    maxWidth: 300,
    marginTop: 20,
  },
  progressText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 24,
    backgroundColor: '#0f3460',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#16213e',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 10,
  },
});
