import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface GameHUDProps {
  hearts: number;
  maxHearts: number;
  score: number;
  level?: number;
}

export const GameHUD: React.FC<GameHUDProps> = ({ hearts, maxHearts, score, level }) => {
  return (
    <View style={styles.container}>
      {/* Level indicator */}
      {level !== undefined && (
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Level {level}</Text>
        </View>
      )}

      {/* Hearts */}
      <View style={styles.heartsContainer}>
        {Array.from({ length: maxHearts }).map((_, index) => (
          <Text key={index} style={styles.heart}>
            {index < hearts ? '❤️' : '🖤'}
          </Text>
        ))}
      </View>

      {/* Score */}
      <View style={styles.scoreBadge}>
        <Text style={styles.scoreLabel}>Score</Text>
        <Text style={styles.scoreValue}>{score}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 100,
  },
  levelBadge: {
    backgroundColor: 'rgba(15, 52, 96, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  levelText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  heartsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(22, 33, 62, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  heart: {
    fontSize: 20,
  },
  scoreBadge: {
    backgroundColor: 'rgba(233, 69, 96, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  scoreLabel: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 2,
  },
  scoreValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
