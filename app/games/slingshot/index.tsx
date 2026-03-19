import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

interface Level {
  id: number;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const levels: Level[] = [
  {
    id: 1,
    title: 'Level 1',
    description: 'Learn slingshot mechanics',
    difficulty: 'Easy',
  },
  {
    id: 2,
    title: 'Level 2',
    description: 'Hit moving targets',
    difficulty: 'Medium',
  },
  {
    id: 3,
    title: 'Level 3',
    description: 'Limited shots challenge',
    difficulty: 'Hard',
  },
];

export default function SlingshotLevels() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>Slingshot</Text>
        <Text style={styles.subtitle}>Select a Level</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {levels.map((level) => (
          <Pressable
            key={level.id}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => router.push(`/games/slingshot/${level.id}`)}
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{level.title}</Text>
              <Text style={styles.cardDescription}>{level.description}</Text>
              <View style={styles.difficultyBadge}>
                <Text style={styles.difficultyText}>{level.difficulty}</Text>
              </View>
            </View>
            <View style={styles.cardArrow}>
              <Text style={styles.arrowText}>▶</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, backgroundColor: '#16213e' },
  backButton: { marginBottom: 12 },
  backText: { fontSize: 16, color: '#e94560', fontWeight: '600' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#a0a0a0' },
  scrollContent: { padding: 20, gap: 16 },
  card: { backgroundColor: '#0f3460', borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4.65, elevation: 8 },
  cardPressed: { backgroundColor: '#0a2747', transform: [{ scale: 0.98 }] },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  cardDescription: { fontSize: 14, color: '#b0b0b0', marginBottom: 8 },
  difficultyBadge: { alignSelf: 'flex-start', backgroundColor: '#e94560', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  difficultyText: { fontSize: 12, color: '#fff', fontWeight: '600' },
  cardArrow: { marginLeft: 12 },
  arrowText: { fontSize: 20, color: '#e94560' },
});
