import { Canvas, Circle, Rect } from '@shopify/react-native-skia';
import Matter from 'matter-js';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { ball, ballCoords, GameObjects } from '../src/GameObjects';
import { PathsAnimated } from '../src/PathAnimated';

export const Ball = ({ elements }: { elements: GameObjects[] }) => {
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const circle = elements.find((e) => e.type === 'ball') || ballCoords;

  const boxes = elements
    .map((e) => (e.type === 'box' ? e : null))
    .filter((e) => !!e);

  const paths = elements
    .map((e) => (e.type === 'path' ? e : null))
    .filter((e) => !!e);

  const walls = elements
    .map((e) => (e.type === 'wall' ? e : null))
    .filter((e) => !!e);

  const updateBallVelocity = (x: number, y: number) => {
    Matter.Body.setVelocity(ball, { x: x, y: y });
  };

  const updateBallPosition = (x: number, y: number) => {
    Matter.Body.setPosition(ball, {
      x: x,
      y: y,
    });
  };

  const updateSleep = (sleep: boolean) => {
    Matter.Sleeping.set(ball, sleep);
  };

  // Pan gesture handler for ball control
  const panGesture = Gesture.Pan()
    .onStart(() => {
      // Store the initial ball position when pan starts
      startX.value = circle.x.value;
      startY.value = circle.y.value;
      // Stop velocity while dragging
      runOnJS(updateBallVelocity)(0, 0);
      runOnJS(updateSleep)(true);
    })
    .onChange((e) => {
      // Calculate new position from the starting position
      const newX = startX.value + e.translationX;
      const newY = startY.value + e.translationY;

      runOnJS(updateBallPosition)(newX, newY);
    })
    .onEnd((e) => {
      // Apply velocity when drag ends
      runOnJS(updateSleep)(false);
      runOnJS(updateBallVelocity)(e.velocityX * 0.01, e.velocityY * 0.01);
    });

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    // backgroundColor: 'red',
    top: -circle.radius,
    left: -circle.radius,
    width: circle.radius * 2,
    height: circle.radius * 2,
    transform: [{ translateX: circle.x.value }, { translateY: circle.y.value }],
  }));

  return (
    <View style={{ flex: 1 }}>
      <Canvas style={{ width: '100%', height: '100%' }}>
        <Circle
          cx={circle.x}
          cy={circle.y}
          r={circle.radius}
          color="limegreen"
        />

        {boxes.map((box, index) => {
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

      <GestureDetector gesture={panGesture}>
        <Animated.View style={style} />
      </GestureDetector>
    </View>
  );
};
