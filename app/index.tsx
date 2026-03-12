import { Pressable, StyleSheet, View } from 'react-native';

import { vec } from '@shopify/react-native-skia';
import Matter from 'matter-js';
import { useEffect, useRef, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ball } from '../src/Ball';
import {
  ball,
  ballCoords,
  bottomWallCoords,
  BOX_SIZE,
  engine,
  GameObjects,
  leftWallCoords,
  rightWallCoords,
  topWallCoords,
  triangle,
  triangle2,
  triangleCoords,
  triangleCoords2,
} from '../src/GameObjects';
import { CuttingLine } from '../src/CuttingLine';

export default function App() {
  const [elements, setElements] = useState<GameObjects[]>([
    ballCoords,
    //  boxCoords,
   // triangleCoords,
    triangleCoords2,
    bottomWallCoords,
    leftWallCoords,
    rightWallCoords,
    topWallCoords,
  ]);
  const boxesWorld = useRef([ball, triangle2]);

  useEffect(() => {
    let animationFrame: any;

    const update = () => {
      Matter.Engine.update(engine, 1000 / 60);
      animationFrame = requestAnimationFrame(update);


      let bodyIndex = 0;
      elements.forEach((element) => {
        // Skip walls - they're static and don't need updates
        if (element.type === 'wall') return;

        const body = boxesWorld.current[bodyIndex];
        if (!body) return; // Skip if body doesn't exist

        if (element.type === 'box') {
          element.x.value = body.position.x;
          element.y.value = body.position.y;
          element.angle.value = [{ rotateZ: body.angle }];
          element.origin.value = vec(
            element.x.value + BOX_SIZE / 2,
            element.y.value + BOX_SIZE / 2
          );
        } else if (element.type === 'ball') {
          element.x.value = body.position.x;
          element.y.value = body.position.y;
        } else if (element.type === 'path') {
          const centroidX = element.centroid?.x ?? element.width / 2;
          const centroidY = element.centroid?.y ?? element.height / 2;
          element.x.value = body.position.x - centroidX;
          element.y.value = body.position.y - centroidY;
          element.angle.value = [{ rotateZ: body.angle }];
          element.origin.value = vec(
            element.x.value + centroidX,
            element.y.value + centroidY
          );
        }

        bodyIndex++;
      });
    };

    update();

    return () => cancelAnimationFrame(animationFrame);
  }, [elements]);

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        {/* <Ball elements={elements} /> */}
        <CuttingLine
          elements={elements}
          bodies={boxesWorld.current}
          onCut={(newBodies, elementsCoords) => {
            console.log(elementsCoords.map((e) => e.id));

            // Get all bodies that still exist in the world
            const worldBodies = Matter.Composite.allBodies(engine.world);

            // Filter out bodies that were removed during cutting
            const remainingBodies = boxesWorld.current.filter(body => {
              if (!body) return false;
              const stillExists = worldBodies.includes(body);

              // If body doesn't exist in world anymore, ensure it's removed
              if (!stillExists) {
                try {
                  Matter.World.remove(engine.world, body, true);
                } catch (e) {
                  // Body already removed, ignore error
                }
              }

              return stillExists;
            });

            // Update both bodies and elements
            boxesWorld.current = [...remainingBodies, ...newBodies];
            setElements(elementsCoords);
          }}
        />
        <Pressable
          style={{
            width: '10%',
            height: '10%',
            backgroundColor: 'red',
            position: 'absolute',
          }}
          onPress={() => {
            engine.gravity.y === 1
              ? (engine.gravity.y = -1)
              : (engine.gravity.y = 1);
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
});
