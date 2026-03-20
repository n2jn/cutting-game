import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { STAT_MAX } from '@game';

interface StatBarProps {
  label: string;
  value: number;
  max?: number;
  color?: string;
}

export const StatBar: React.FC<StatBarProps> = ({
  label,
  value,
  max = STAT_MAX,
  color = '#e94560',
}) => {
  const progress = Math.min(value / max, 1);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>
          {value}/{max}
        </Text>
      </View>
      <View style={styles.barBackground}>
        <View
          style={[
            styles.barFill,
            {
              width: `${progress * 100}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  value: {
    color: '#a0a0a0',
    fontSize: 14,
    fontWeight: '600',
  },
  barBackground: {
    height: 16,
    backgroundColor: '#0f3460',
    borderRadius: 8,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 8,
  },
});
