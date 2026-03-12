import {
  Canvas,
  Circle,
  Line,
  Rect,
  Skia,
  SkPoint,
  vec,
} from '@shopify/react-native-skia';
import { useState } from 'react';
import { View } from 'react-native';
import Matter from 'matter-js';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  makeMutable,
  runOnJS,
  useSharedValue,
} from 'react-native-reanimated';
import { GameObjects } from './GameObjects';
import { cutBox } from './lib/cutBox';
import { PathsAnimated } from '../src/PathAnimated';
import { PathCoords } from './GameObjects/Path.object';

export const CuttingLine = ({
  elements,
  onCut,
  bodies,
}: {
  elements: GameObjects[];
  bodies?: Matter.Body[];
  onCut?: (elements: Matter.Body[], elementsCoords: GameObjects[]) => void;
}) => {
  const boxes = elements
    .map((e) => (e.type === 'box' ? e : null))
    .filter((e) => !!e);
  const balls = elements
    .map((e) => (e.type === 'ball' ? e : null))
    .filter((e) => !!e);

  const paths = elements
    .map((e) => (e.type === 'path' ? e : null))
    .filter((e) => !!e);

  const walls = elements
    .map((e) => (e.type === 'wall' ? e : null))
    .filter((e) => !!e);

  const p1 = useSharedValue<SkPoint | null>(null);
  const p2 = useSharedValue<SkPoint | null>(null);
  const [line, setLine] = useState<SkPoint[] | null>(null);

  const addPath = (p1: SkPoint, p2: SkPoint) => {
    const { newBodies, removedBodies } = cutBox(p1, p2);

    if (!newBodies.length) {
      return;
    }

    const newPaths: PathCoords[] = newBodies.map((body, index) => {
      // Get vertices relative to body center
      const vertices = body.vertices;
      const centroid = Matter.Vertices.centre(vertices);

      // Create Skia path from the body's vertices
      const path = Skia.Path.Make();
      if (vertices.length > 0) {
        // Calculate relative vertices
        const relativeVertices = vertices.map(v => ({
          x: v.x - body.position.x + centroid.x,
          y: v.y - body.position.y + centroid.y
        }));

        path.moveTo(relativeVertices[0].x, relativeVertices[0].y);
        for (let i = 1; i < relativeVertices.length; i++) {
          path.lineTo(relativeVertices[i].x, relativeVertices[i].y);
        }
        path.close();
      }

      const bounds = path.getBounds();
      const timestamp = Date.now();

      return {
        id: `path-cut-${timestamp}-${index}`,
        x: makeMutable(body.position.x - centroid.x),
        y: makeMutable(body.position.y - centroid.y),
        path: path,
        origin: makeMutable(vec(centroid.x, centroid.y)),
        angle: makeMutable([{ rotateZ: body.angle }]),
        width: bounds.width,
        height: bounds.height,
        centroid: { x: centroid.x, y: centroid.y },
        type: 'path',
      };
    });

    console.log('Created paths:', newPaths.length);

    // Filter out the removed bodies from elements
    // Match removed bodies to elements by index in bodies array
    const removedIndices = new Set<number>();
    removedBodies.forEach(removedBody => {
      const idx = bodies?.findIndex(b => b.id === removedBody.id);
      if (idx !== undefined && idx >= 0) {
        removedIndices.add(idx);
      }
    });

    const filteredElements = elements.filter((_, index) => !removedIndices.has(index));

    onCut?.(newBodies, [...filteredElements, ...newPaths]);
  };

  /**
   * Pan gesture for drawing cutting line
   */
  const cuttingGesture = Gesture.Pan()
    .maxPointers(1)
    .onStart((e) => {
      p1.value = Skia.Point(e.x, e.y);
      runOnJS(setLine)([p1.value, p1.value]);
    })
    .onChange((e) => {
      if (p1.value) {
        p2.value = Skia.Point(e.x, e.y);
        runOnJS(setLine)([p1.value, p2.value]);
      }
    })
    .onEnd((e) => {
      if (p1.value && p2.value) {
        runOnJS(addPath)(p1.value, p2.value);

        p2.value = null;
        p1.value = null;
        runOnJS(setLine)(null);
      }
    });

  return (
    <>
      <GestureDetector gesture={cuttingGesture}>
        <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
          <Canvas style={{ width: '100%', height: '100%' }}>
            {/* Render cutting line while drawing */}
            {line && (
              <Line
                p1={line[0]}
                p2={line[1]}
                color="lightblue"
                style="stroke"
                strokeWidth={4}
              />
            )}
            {/* {boxes.map((box, index) => {
              return (
                <Rect
                  key={`box ${index}`}
                  x={box.x}
                  y={box.y}
                  width={box.width}
                  height={box.height}
                  origin={box.origin}
                  transform={box.angle}
                  strokeWidth={3}
                  color="purple"
                />
              );
            })} */}
            {balls.map((ball, index) => {
              return (
                <Circle
                  key={`ball ${index}`}
                  cx={ball.x}
                  cy={ball.y}
                  r={ball.radius}
                  color="limegreen"
                />
              );
            })}
            {paths &&
              paths.map((path, index) => (
                <PathsAnimated key={`path ${index}`} pathCoords={path} />
              ))}
            {walls.map((wall, index) => {
              return (
                <Rect
                  key={`wall ${index}`}
                  x={wall.x}
                  y={wall.y}
                  width={wall.width}
                  height={wall.height}
                  color="gray"
                />
              );
            })}
          </Canvas>
        </View>
      </GestureDetector>
    </>
  );
};
