import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, ScrollView } from 'react-native';
import { Duck, RARITY_COLORS } from '../types/game';

interface DuckSelectorProps {
  selectedDuck: Duck | null;
  allDucks: Duck[];
  onSelectDuck: (duckId: string) => void;
}

export const DuckSelector: React.FC<DuckSelectorProps> = ({
  selectedDuck,
  allDucks,
  onSelectDuck,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.selectorButton}
        onPress={() => setModalVisible(true)}
      >
        {selectedDuck ? (
          <View style={styles.selectedDuckInfo}>
            <Text style={styles.duckEmoji}>🦆</Text>
            <View style={styles.duckDetails}>
              <Text style={styles.duckTitle}>Selected Duck</Text>
              <Text
                style={[
                  styles.duckVariant,
                  { color: RARITY_COLORS[selectedDuck.variant] },
                ]}
              >
                {selectedDuck.variant.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.changeText}>Tap to change</Text>
          </View>
        ) : (
          <View style={styles.noDuckSelected}>
            <Text style={styles.noDuckText}>No duck selected</Text>
            <Text style={styles.noDuckHint}>Tap to select a duck</Text>
          </View>
        )}
      </Pressable>

      {/* Duck Selection Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select a Duck</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </Pressable>
            </View>

            <ScrollView style={styles.duckList}>
              {allDucks.length === 0 ? (
                <Text style={styles.emptyText}>
                  No ducks hatched yet! Go hatch an egg first.
                </Text>
              ) : (
                allDucks.map((duck) => (
                  <Pressable
                    key={duck.id}
                    style={[
                      styles.duckOption,
                      duck.id === selectedDuck?.id && styles.duckOptionSelected,
                      { borderLeftColor: RARITY_COLORS[duck.variant] },
                    ]}
                    onPress={() => {
                      onSelectDuck(duck.id);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.duckOptionEmoji}>🦆</Text>
                    <View style={styles.duckOptionDetails}>
                      <Text
                        style={[
                          styles.duckOptionVariant,
                          { color: RARITY_COLORS[duck.variant] },
                        ]}
                      >
                        {duck.variant.toUpperCase()}
                      </Text>
                      <View style={styles.duckStats}>
                        <Text style={styles.statText}>
                          ⚔️ {duck.stats.fighting}/100
                        </Text>
                        <Text style={styles.statText}>
                          ✈️ {duck.stats.flying}/100
                        </Text>
                        <Text style={styles.statText}>
                          ⚡ {duck.stats.speed}/100
                        </Text>
                        <Text style={styles.statText}>
                          🎯 {duck.stats.precision}/100
                        </Text>
                      </View>
                    </View>
                    {duck.id === selectedDuck?.id && (
                      <Text style={styles.selectedIndicator}>✓</Text>
                    )}
                  </Pressable>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  selectorButton: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#0f3460',
  },
  selectedDuckInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  duckEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  duckDetails: {
    flex: 1,
  },
  duckTitle: {
    color: '#a0a0a0',
    fontSize: 12,
    marginBottom: 2,
  },
  duckVariant: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  changeText: {
    color: '#e94560',
    fontSize: 12,
    fontWeight: '600',
  },
  noDuckSelected: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  noDuckText: {
    color: '#a0a0a0',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  noDuckHint: {
    color: '#e94560',
    fontSize: 12,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1a2e',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    color: '#e94560',
    fontSize: 24,
    fontWeight: 'bold',
  },
  duckList: {
    padding: 16,
  },
  emptyText: {
    color: '#a0a0a0',
    textAlign: 'center',
    padding: 40,
    fontSize: 14,
  },
  duckOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  duckOptionSelected: {
    backgroundColor: '#0f3460',
    borderWidth: 2,
    borderColor: '#e94560',
  },
  duckOptionEmoji: {
    fontSize: 36,
    marginRight: 16,
  },
  duckOptionDetails: {
    flex: 1,
  },
  duckOptionVariant: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  duckStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statText: {
    color: '#a0a0a0',
    fontSize: 12,
  },
  selectedIndicator: {
    color: '#e94560',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
