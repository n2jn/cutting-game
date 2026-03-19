import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useGameState } from '../../src/hooks';
import { DuckSelector } from '../../src/components/DuckSelector';
import { StatType } from '../../src/types/game';

interface Game {
  id: string;
  title: string;
  description: string;
  route: string;
  color: string;
  emoji: string;
  stat: StatType;
}

const games: Game[] = [
  {
    id: 'physics-slicer',
    title: 'Physics Slicer',
    description: 'Cut and slice physics objects',
    route: '/games/physics-slicer',
    color: '#e94560',
    emoji: '⚔️',
    stat: 'fighting',
  },
  {
    id: 'slingshot',
    title: 'Slingshot',
    description: 'Launch objects at targets',
    route: '/games/slingshot',
    color: '#f39c12',
    emoji: '🎯',
    stat: 'precision',
  },
  {
    id: 'gravity-runner',
    title: 'Gravity Runner',
    description: 'Defy gravity and dodge obstacles',
    route: '/games/gravity-runner',
    color: '#3498db',
    emoji: '✈️',
    stat: 'flying',
  },
  {
    id: 'rhythm-master',
    title: 'Rhythm Master',
    description: 'Tap to the beat with perfect timing',
    route: '/games/rhythm-master',
    color: '#9b59b6',
    emoji: '⚡',
    stat: 'speed',
  },
];

const statLabels: Record<StatType, string> = {
  fighting: 'Fighting',
  flying: 'Flying',
  speed: 'Speed',
  precision: 'Precision',
};

export default function GamesTab() {
  const router = useRouter();
  const { manager, state, isLoading } = useGameState();

  if (isLoading || !state || !manager) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const selectedDuck = state.ducks.find((d) => d.id === state.selectedDuckId);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Games</Text>
        <Text style={styles.subtitle}>Train Your Duck</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Duck Selector */}
        <DuckSelector
          selectedDuck={selectedDuck || null}
          allDucks={state.ducks}
          onSelectDuck={(id) => manager.selectDuck(id)}
        />

        {/* Games List */}
        {games.map((game) => {
          const currentStat = selectedDuck ? selectedDuck.stats[game.stat] : 0;
          const isMaxed = currentStat === 100;
          const isDisabled = !selectedDuck;

          return (
            <Pressable
              key={game.id}
              style={({ pressed }) => [
                styles.card,
                pressed && !isDisabled && styles.cardPressed,
                isDisabled && styles.cardDisabled,
              ]}
              onPress={() => !isDisabled && router.push(game.route)}
              disabled={isDisabled}
            >
              <View style={[styles.colorBar, { backgroundColor: game.color }]} />
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={styles.gameEmoji}>{game.emoji}</Text>
                  <Text style={styles.cardTitle}>{game.title}</Text>
                </View>
                <Text style={styles.cardDescription}>{game.description}</Text>

                {/* Stat Info */}
                <View style={styles.statInfo}>
                  <Text style={styles.statLabel}>Trains: {statLabels[game.stat]}</Text>
                  {selectedDuck ? (
                    <View style={styles.statProgress}>
                      <View style={styles.statBarContainer}>
                        <View
                          style={[
                            styles.statBarFill,
                            {
                              width: `${currentStat}%`,
                              backgroundColor: isMaxed ? '#4caf50' : game.color,
                            },
                          ]}
                        />
                      </View>
                      <Text style={[styles.statValue, isMaxed && styles.statMaxed]}>
                        {currentStat}/100 {isMaxed && '✓'}
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.noDuckWarning}>Select a duck first!</Text>
                  )}
                </View>
              </View>
              <View style={styles.cardArrow}>
                <Text style={[styles.arrowText, { color: isDisabled ? '#555' : game.color }]}>
                  ▶
                </Text>
              </View>
            </Pressable>
          );
        })}

        {/* No Duck Message */}
        {!selectedDuck && state.ducks.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🥚</Text>
            <Text style={styles.emptyTitle}>No Ducks Yet!</Text>
            <Text style={styles.emptyText}>
              Go to the Home tab and hatch an egg to get your first duck
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#16213e',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#a0a0a0',
  },
  scrollContent: {
    padding: 20,
  },
  card: {
    backgroundColor: '#0f3460',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  cardPressed: {
    backgroundColor: '#0a2747',
    transform: [{ scale: 0.98 }],
  },
  cardDisabled: {
    opacity: 0.5,
  },
  colorBar: {
    width: 6,
    height: '100%',
  },
  cardContent: {
    flex: 1,
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  gameEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardDescription: {
    fontSize: 13,
    color: '#b0b0b0',
    marginBottom: 12,
  },
  statInfo: {
    marginTop: 8,
  },
  statLabel: {
    color: '#a0a0a0',
    fontSize: 12,
    marginBottom: 6,
  },
  statProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#16213e',
    borderRadius: 4,
    overflow: 'hidden',
  },
  statBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  statValue: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    minWidth: 60,
  },
  statMaxed: {
    color: '#4caf50',
  },
  noDuckWarning: {
    color: '#e94560',
    fontSize: 12,
    fontStyle: 'italic',
  },
  cardArrow: {
    marginRight: 20,
  },
  arrowText: {
    fontSize: 24,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#a0a0a0',
    textAlign: 'center',
  },
});
