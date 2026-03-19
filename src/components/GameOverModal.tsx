import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { StatType } from '../types/game';

interface GameOverModalProps {
  visible: boolean;
  score: number;
  xpGained: number;
  statType: StatType;
  currentStatValue: number;
  onRestart: () => void;
  onExit: () => void;
}

const statLabels: Record<StatType, string> = {
  fighting: 'Fighting',
  flying: 'Flying',
  speed: 'Speed',
  precision: 'Precision',
};

const statEmojis: Record<StatType, string> = {
  fighting: '⚔️',
  flying: '✈️',
  speed: '⚡',
  precision: '🎯',
};

export const GameOverModal: React.FC<GameOverModalProps> = ({
  visible,
  score,
  xpGained,
  statType,
  currentStatValue,
  onRestart,
  onExit,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Game Over!</Text>

          {/* Score */}
          <View style={styles.scoreSection}>
            <Text style={styles.scoreLabel}>Final Score</Text>
            <Text style={styles.scoreValue}>{score}</Text>
          </View>

          {/* XP Gained */}
          <View style={styles.xpSection}>
            <Text style={styles.xpLabel}>
              {statEmojis[statType]} {statLabels[statType]} XP
            </Text>
            <Text style={styles.xpValue}>+{xpGained}</Text>
            <View style={styles.statBar}>
              <View
                style={[
                  styles.statBarFill,
                  { width: `${Math.min(currentStatValue, 100)}%` },
                ]}
              />
            </View>
            <Text style={styles.statText}>
              {currentStatValue}/100
            </Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttons}>
            <Pressable
              style={[styles.button, styles.restartButton]}
              onPress={onRestart}
            >
              <Text style={styles.buttonText}>Play Again</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.exitButton]}
              onPress={onExit}
            >
              <Text style={styles.buttonText}>Exit</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#1a1a2e',
    borderRadius: 24,
    padding: 32,
    width: '85%',
    maxWidth: 400,
    borderWidth: 2,
    borderColor: '#e94560',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
  },
  scoreSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
  },
  scoreLabel: {
    color: '#a0a0a0',
    fontSize: 14,
    marginBottom: 8,
  },
  scoreValue: {
    color: '#fff',
    fontSize: 48,
    fontWeight: 'bold',
  },
  xpSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  xpLabel: {
    color: '#a0a0a0',
    fontSize: 14,
    marginBottom: 8,
  },
  xpValue: {
    color: '#4caf50',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statBar: {
    width: '100%',
    height: 16,
    backgroundColor: '#0f3460',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  statBarFill: {
    height: '100%',
    backgroundColor: '#e94560',
  },
  statText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  restartButton: {
    backgroundColor: '#e94560',
  },
  exitButton: {
    backgroundColor: '#0f3460',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
