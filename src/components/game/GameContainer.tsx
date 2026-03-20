import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { GameHUD } from './GameHUD';
import { GameOverModal } from './GameOverModal';
import type { Duck, StatType } from '@game';

interface GameContainerProps {
  children: React.ReactNode;
  hearts: number;
  maxHearts: number;
  score: number;
  level: number;
  isGameOver: boolean;
  xpGained: number;
  selectedDuck?: Duck;
  statType: StatType;
  onRestart: () => void;
}

/**
 * GameContainer Component
 *
 * Reusable container for all games with:
 * - Game HUD (hearts, score, level)
 * - Back button
 * - Game over modal
 * - Gesture handling wrapper
 */
export const GameContainer: React.FC<GameContainerProps> = ({
  children,
  hearts,
  maxHearts,
  score,
  level,
  isGameOver,
  xpGained,
  selectedDuck,
  statType,
  onRestart,
}) => {
  const router = useRouter();

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        {children}

        {/* Game HUD */}
        <GameHUD hearts={hearts} maxHearts={maxHearts} score={score} level={level} />

        {/* Back button */}
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        {/* Game Over Modal */}
        {selectedDuck && (
          <GameOverModal
            visible={isGameOver}
            score={score}
            xpGained={xpGained}
            statType={statType}
            currentStatValue={selectedDuck.stats[statType]}
            onRestart={onRestart}
            onExit={() => router.back()}
          />
        )}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: 'rgba(233, 69, 96, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    zIndex: 10,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
