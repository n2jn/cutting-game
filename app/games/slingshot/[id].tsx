import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

/**
 * Slingshot Game - Dynamic Level Component
 *
 * FEATURES TO IMPLEMENT:
 * - Slingshot mechanic: Pull back and release to launch objects
 * - Touch and drag gesture to control slingshot tension
 * - Visual trajectory preview while pulling
 * - Target objects or zones to hit
 * - Power/velocity based on pull distance
 * - Angle-based trajectory calculation
 *
 * GAMEPLAY:
 * - Player pulls back on a slingshot with touch gestures
 * - Release to launch projectiles (balls/objects)
 * - Hit targets to complete level
 * - Limited number of shots per level
 * - Star rating based on performance
 *
 * LEVEL-SPECIFIC CONFIGS:
 * - Level 1: Static targets, unlimited shots (tutorial)
 * - Level 2: Moving targets, 10 shots
 * - Level 3: Complex obstacle course, 5 shots
 */

export default function SlingshotLevel() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </Pressable>

      <View style={styles.content}>
        <Text style={styles.title}>Slingshot</Text>
        <Text style={styles.levelText}>Level {id}</Text>
        <Text style={styles.description}>Pull back and launch!</Text>
        <Text style={styles.todo}>TODO: Implement slingshot mechanics</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  backButton: { position: 'absolute', top: 60, left: 20, backgroundColor: 'rgba(233, 69, 96, 0.9)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, zIndex: 10 },
  backText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  levelText: { fontSize: 24, color: '#e94560', marginBottom: 12 },
  description: { fontSize: 16, color: '#a0a0a0', textAlign: 'center', marginBottom: 20 },
  todo: { fontSize: 14, color: '#e94560', fontStyle: 'italic' },
});
