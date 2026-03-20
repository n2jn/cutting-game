import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { useGameState, useAutoClicker } from '@hooks';
import { EggClicker } from '@components/game/EggClicker';
import { StatBar } from '@components/ui/StatBar';
import { RARITY_COLORS } from '@game';

/**
 * Home Tab - Duck Clicker Game
 *
 * Main screen where players click eggs to hatch ducks,
 * select ducks, and view stats.
 */
export default function Home() {
  const { manager, state, isLoading } = useGameState();

  // Set up auto-clicker
  useAutoClicker(manager, state?.autoClickRate || 0);

  if (isLoading || !state || !manager) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const primaryEgg = state.eggs[0]; // For now, just show first egg
  const selectedDuck = state.ducks.find((d) => d.id === state.selectedDuckId);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Stats Header */}
      <View style={styles.statsHeader}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Clicks</Text>
          <Text style={styles.statValue}>{state.totalClicks}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Power</Text>
          <Text style={styles.statValue}>{state.clickPower}/tap</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Auto</Text>
          <Text style={styles.statValue}>{state.autoClickRate}/sec</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Coins</Text>
          <Text style={styles.statValue}>{state.coins}🪙</Text>
        </View>
      </View>

      {/* Duck Background Scene (Simple placeholder for now) */}
      {state.ducks.length > 0 && (
        <View style={styles.duckScene}>
          <Text style={styles.duckSceneLabel}>Your Ducks</Text>
          <View style={styles.ducksContainer}>
            {state.ducks.map((duck) => (
              <Pressable
                key={duck.id}
                style={[
                  styles.duck,
                  duck.id === state.selectedDuckId && styles.duckSelected,
                  { borderColor: RARITY_COLORS[duck.variant] },
                ]}
                onPress={() => manager.selectDuck(duck.id)}
              >
                <Text style={styles.duckEmoji}>🦆</Text>
                <Text style={[styles.duckRarity, { color: RARITY_COLORS[duck.variant] }]}>
                  {duck.variant}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* Egg Clicker */}
      {primaryEgg && (
        <EggClicker
          egg={primaryEgg}
          onPress={() => manager.clickEgg(primaryEgg.id)}
        />
      )}

      {/* Selected Duck Stats Panel */}
      {selectedDuck ? (
        <View style={styles.duckPanel}>
          <Text style={styles.duckPanelTitle}>
            Selected Duck: {selectedDuck.variant} 🦆
          </Text>
          <View style={styles.statsContainer}>
            <StatBar label="Fighting" value={selectedDuck.stats.fighting} color="#e94560" />
            <StatBar label="Flying" value={selectedDuck.stats.flying} color="#3498db" />
            <StatBar label="Speed" value={selectedDuck.stats.speed} color="#9c27b0" />
            <StatBar label="Precision" value={selectedDuck.stats.precision} color="#f39c12" />
          </View>

          {selectedDuck.isFullyLeveled && (
            <Pressable
              style={styles.sellButton}
              onPress={() => manager.sellDuck(selectedDuck.id)}
            >
              <Text style={styles.sellButtonText}>
                Sell Duck for {RARITY_COLORS[selectedDuck.variant] ? '⭐' : ''}{' '}
                Coins
              </Text>
            </Pressable>
          )}

          {!selectedDuck.isFullyLeveled && (
            <Text style={styles.levelUpHint}>Play games to level up stats!</Text>
          )}
        </View>
      ) : (
        <View style={styles.duckPanel}>
          <Text style={styles.noDuckText}>Hatch an egg to get your first duck!</Text>
        </View>
      )}

      {/* Duck Collection Stats */}
      <View style={styles.collectionStats}>
        <Text style={styles.collectionStatText}>
          Ducks Hatched: {state.ducks.length}
        </Text>
        <Text style={styles.collectionStatText}>
          Ducks Sold: {state.soldDucks.length}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },

  // Stats Header
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#a0a0a0',
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Duck Scene
  duckScene: {
    backgroundColor: '#0f3460',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  duckSceneLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  ducksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  duck: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    backgroundColor: '#16213e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  duckSelected: {
    borderWidth: 4,
    shadowColor: '#e94560',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  duckEmoji: {
    fontSize: 28,
  },
  duckRarity: {
    fontSize: 8,
    fontWeight: 'bold',
    marginTop: 2,
  },

  // Duck Panel
  duckPanel: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
  },
  duckPanelTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsContainer: {
    marginBottom: 16,
  },
  sellButton: {
    backgroundColor: '#e94560',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  sellButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  levelUpHint: {
    color: '#a0a0a0',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  noDuckText: {
    color: '#a0a0a0',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },

  // Collection Stats
  collectionStats: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#0f3460',
  },
  collectionStatText: {
    color: '#a0a0a0',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 4,
  },
});
