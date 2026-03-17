import { Pressable, StyleSheet, View } from 'react-native';
import Matter from 'matter-js';
import { useEffect, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { engine, world, width, height } from '../src/core/physics';
import { CuttingLine } from '../src/CuttingLine';
import { useEntityManager } from '../src/core/useEntityManager';
import { EntityFactory } from '../src/core/EntityFactory';
import { PhysicsSync } from '../src/systems/PhysicsSync';
import { CuttingSystem } from '../src/systems/CuttingSystem';

export default function App() {
  const { manager, entities } = useEntityManager(world);
  const cuttingSystemRef = useRef<CuttingSystem | null>(null);

  // Initialize cutting system
  if (!cuttingSystemRef.current) {
    cuttingSystemRef.current = new CuttingSystem(manager, world);
  }

  // Initialize game entities (runs once)
  useEffect(() => {
    // Create walls
    const statusBarHeight = 20; // Fallback constant
    manager.register(
      EntityFactory.createWall(0, 0, 20, height)
    ); // Left wall
    manager.register(
      EntityFactory.createWall(width - 20, 0, 20, height)
    ); // Right wall
    manager.register(
      EntityFactory.createWall(0, 0, width, statusBarHeight)
    ); // Top wall
    manager.register(
      EntityFactory.createWall(0, height - statusBarHeight, width, statusBarHeight)
    ); // Bottom wall

    // Create ball
    manager.register(
      EntityFactory.createBall(width * 0.15, height * 0.83, 20)
    );

    manager.register(
      EntityFactory.createBall(width * 0.15, height * 0.83, 20)
    );

    manager.register(
      EntityFactory.createBox(width * 0.15, height * 0.83, 20, 20)
    );
    manager.register(
      EntityFactory.createBox(width * 0.15, height * 0.83, 200, 200)
    );
    manager.register(
      EntityFactory.createBox(width * 0.15, height * 0.83, 20, 20)
    );
    manager.register(
      EntityFactory.createBox(width * 0.15, height * 0.83, 20, 20)
    );

    // Create star/triangle path
    // const starVerticesString = '128 0 168 80 256 93 192 155 207 244 128 202 49 244 64 155 0 93 88 80';
    // const starVertices = Matter.Svg.pathToVertices(starVerticesString);
    // manager.register(
    //   EntityFactory.createPath(width * 0.15, height * 0.5, starVertices)
    // );

    // Cleanup on unmount
    return () => {
      // EntityManager handles cleanup
    };
  }, [manager]);

  // Physics update loop (60fps)
  useEffect(() => {
    let animationFrame: any;

    const update = () => {
      Matter.Engine.update(engine, 1000 / 60);

      // Sync all dynamic entities (balls, paths, boxes)
      PhysicsSync.updateAll(manager.getDynamic());

      animationFrame = requestAnimationFrame(update);
    };

    update();

    return () => cancelAnimationFrame(animationFrame);
  }, [manager]);

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <CuttingLine
          entities={entities}
          onCut={(p1, p2) => {
            // Use cutting system for clean entity lifecycle management
            cuttingSystemRef.current?.cut(p1, p2);
          }}
        />
        <Pressable
          style={styles.gravityButton}
          onPress={() => {
            engine.gravity.y = engine.gravity.y === 1 ? -1 : 1;
          }}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gravityButton: {
    width: '10%',
    height: '10%',
    backgroundColor: 'red',
    position: 'absolute',
  },
});
