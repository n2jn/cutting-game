import { useLocalSearchParams } from 'expo-router';
import { View, StyleSheet, Dimensions } from 'react-native';
import { GameContainer } from '@components/game/GameContainer';
import { DuckDisplay } from '@components/game/DuckDisplay';
import {
  useHeartSystem,
  useScoreSystem,
  useGameSetup,
} from '@hooks';
import { Character } from '@components/character-rive/Character';

const MAX_HEARTS = 3;

export default function GravityRunnerLevel() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const levelId = parseInt(id || '1', 10);

  const { width, height } = Dimensions.get('window');

  // Game setup
  const { gameManager, selectedDuck, duckEntity } = useGameSetup();

  // Game systems
  const { hearts, maxHearts, isGameOver, reset: resetHearts } = useHeartSystem(MAX_HEARTS);
  const { score, xpGained, calculateAndAwardXP, reset: resetScore } = useScoreSystem();

  const handleRestart = () => {
    resetHearts();
    resetScore();
  };

  return (
    <GameContainer
      hearts={hearts}
      maxHearts={maxHearts}
      score={score}
      level={levelId}
      isGameOver={isGameOver}
      xpGained={xpGained}
      selectedDuck={selectedDuck}
      statType="flying"
      onRestart={handleRestart}
    >
      <View style={styles.gameArea}>
        {/* Duck Display */}
        <DuckDisplay duckEntity={duckEntity} />
        <Character characterEntity={duckEntity}/>
      </View>
    </GameContainer>
  );
}

const styles = StyleSheet.create({
  gameArea: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#1a1a2e',
  },
});
