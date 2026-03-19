# Game Architecture - Reusable Components & Hooks

This document explains the modular architecture for games in the duck clicker app.

## Directory Structure

```
src/
├── hooks/                      # ALL React hooks (centralized)
│   ├── index.ts               # Exports all hooks
│   │
│   │ # Core hooks (moved from core/)
│   ├── useEntityManager.ts    # Entity lifecycle hook
│   ├── useGameState.ts        # Game state hook (singleton access)
│   │
│   │ # Game system hooks
│   ├── useHeartSystem.ts      # Heart/lives management
│   ├── useScoreSystem.ts      # Score tracking & XP calculation
│   ├── useGameSetup.ts        # Common game initialization
│   ├── useDuckCollision.ts    # Duck collision detection
│   └── usePhysicsLoop.ts      # Physics update loop
│
├── components/                 # Reusable game components
│   ├── GameContainer.tsx      # Wrapper with HUD, back button, game over modal
│   ├── DuckDisplay.tsx        # Duck emoji positioned at entity location
│   ├── GameHUD.tsx            # Hearts, score, level display
│   └── GameOverModal.tsx      # End game modal with XP rewards
│
├── core/                       # Core systems (non-React classes)
│   ├── EntityManager.ts       # Entity lifecycle management
│   ├── EntityFactory.ts       # Entity creation (ball, box, wall, duck)
│   ├── GameStateManager.ts    # Global game state (singleton)
│   ├── Entity.types.ts        # Entity TypeScript interfaces
│   └── physics.ts             # Matter.js engine setup
│
└── systems/                    # Game systems (non-React classes)
    ├── PhysicsSync.ts         # Sync Matter.js with render data
    ├── CuttingSystem.ts       # Cutting/slicing logic
    ├── HeartSystem.ts         # Heart/lives management (class)
    ├── ScoreSystem.ts         # Score & XP calculation (class)
    └── DuckCollisionSystem.ts # Duck collision detection (class)
```

## Reusable Hooks

### 1. `useGameSetup()`
Sets up common game elements:
- Entity manager
- Game state manager
- Boundary walls
- Duck entity (with collision detection)

**Returns:**
```typescript
{
  entityManager: EntityManager
  entities: Entity[]
  gameManager: GameStateManager | null
  gameState: PlayerState | null
  selectedDuck: Duck | undefined
  duckEntity: Entity | undefined
  engine: Matter.Engine
  world: Matter.World
  width: number
  height: number
}
```

### 2. `useHeartSystem(maxHearts)`
Manages heart/lives system:
```typescript
{
  hearts: number
  maxHearts: number
  isGameOver: boolean
  loseHeart: () => boolean  // Returns true if game over
  gainHeart: () => void
  reset: () => void
  triggerGameOver: () => void
}
```

### 3. `useScoreSystem()`
Tracks score and calculates XP:
```typescript
{
  score: number
  totalObjects: number
  xpGained: number
  addScore: (points: number) => void
  incrementTotalObjects: () => void
  calculateAndAwardXP: (manager, duck, statType, maxXP?) => number
  reset: () => void
}
```

### 4. `useDuckCollision(engine, entityManager, onDuckHit)`
Handles object-duck collisions:
- Detects when objects hit the duck
- Automatically removes colliding objects
- Calls `onDuckHit()` callback

### 5. `usePhysicsLoop(engine, entityManager)`
Runs physics at 60fps:
- Updates Matter.js engine
- Syncs bodies with render data

## Reusable Components

### `<GameContainer>`
Wraps all games with common UI:
```tsx
<GameContainer
  hearts={hearts}
  maxHearts={maxHearts}
  score={score}
  level={levelId}
  isGameOver={isGameOver}
  xpGained={xpGained}
  selectedDuck={selectedDuck}
  statType="fighting" // or "flying", "speed", "precision"
  onRestart={handleRestart}
>
  {/* Game-specific content */}
</GameContainer>
```

**Includes:**
- Game HUD (hearts, score, level)
- Back button
- Game over modal with XP display
- Gesture handling wrapper

### `<DuckDisplay>`
Renders duck emoji at entity position:
```tsx
<DuckDisplay duckEntity={duckEntity} />
```

## Creating a New Game

Here's a template for creating new games:

```tsx
import { useEffect, useRef } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { GameContainer } from '../../../src/components/GameContainer';
import { DuckDisplay } from '../../../src/components/DuckDisplay';
import {
  useHeartSystem,
  useScoreSystem,
  useGameSetup,
  useDuckCollision,
  usePhysicsLoop,
} from '../../../src/hooks';

const MAX_HEARTS = 3;

export default function MyNewGame() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const levelId = parseInt(id || '1', 10);

  // Setup
  const { entityManager, entities, gameManager, selectedDuck, duckEntity, engine } = useGameSetup();

  // Systems
  const { hearts, maxHearts, isGameOver, loseHeart, reset: resetHearts } = useHeartSystem(MAX_HEARTS);
  const { score, xpGained, addScore, calculateAndAwardXP, reset: resetScore } = useScoreSystem();

  // Duck collision
  const handleDuckHit = () => {
    const gameOver = loseHeart();
    if (gameOver) {
      calculateAndAwardXP(gameManager, selectedDuck, 'your-stat-type');
    }
  };
  useDuckCollision(engine, entityManager, handleDuckHit);

  // Physics
  usePhysicsLoop(engine, entityManager);

  // Game-specific logic here
  useEffect(() => {
    // Your game logic
  }, []);

  const handleRestart = () => {
    // Clear entities
    const allEntities = entityManager.getAll();
    allEntities.forEach((entity) => {
      if (entity.renderData.type !== 'wall' && entity.renderData.type !== 'duck') {
        entityManager.remove(entity.id);
      }
    });

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
      statType="your-stat-type"
      onRestart={handleRestart}
    >
      {/* Your game rendering here */}
      <DuckDisplay duckEntity={duckEntity} />
    </GameContainer>
  );
}
```

## Stat Types by Game

Map each game to a stat type:
- **Physics Slicer** → `fighting` ⚔️
- **Slingshot** → `precision` 🎯
- **Gravity Runner** → `flying` ✈️
- **Rhythm Master** → `speed` ⚡

## Architecture Pattern: Class + Hook

This codebase follows a **consistent pattern** for all systems:

1. **Class (in `src/systems/` or `src/core/`)**: Contains all business logic
   - Pure TypeScript class
   - No React dependencies
   - Easy to test
   - Can be used outside React

2. **Hook (in `src/hooks/`)**: Thin React wrapper
   - Creates/manages class instance
   - Handles React lifecycle
   - Triggers re-renders when needed
   - Provides clean API to components

### Example: HeartSystem

**Class** (`src/systems/HeartSystem.ts`):
```typescript
export class HeartSystem {
  private hearts: number;
  private maxHearts: number;
  private isGameOver: boolean = false;

  loseHeart(): boolean { /* ... */ }
  gainHeart(): void { /* ... */ }
  reset(): void { /* ... */ }
}
```

**Hook** (`src/hooks/useHeartSystem.ts`):
```typescript
export const useHeartSystem = (maxHearts: number) => {
  const systemRef = useRef<HeartSystem | null>(null);
  const [, forceUpdate] = useState({});

  if (!systemRef.current) {
    systemRef.current = new HeartSystem(maxHearts);
  }

  const loseHeart = useCallback(() => {
    const result = systemRef.current.loseHeart();
    forceUpdate({}); // Trigger re-render
    return result;
  }, []);

  return {
    hearts: systemRef.current.getHearts(),
    loseHeart,
    // ...
  };
};
```

### Benefits of This Pattern

✅ **Separation of Concerns** - Logic separate from React
✅ **Testability** - Test classes without React
✅ **Reusability** - Use classes in non-React contexts
✅ **Performance** - Only re-render when needed
✅ **Type Safety** - Full TypeScript support
✅ **Consistency** - Same pattern everywhere

## Key Concepts

### Entity System
All game objects (balls, boxes, duck, walls) are entities with:
- `id`: Unique identifier
- `type`: 'ball' | 'box' | 'path' | 'wall' | 'duck'
- `body`: Matter.js physics body
- `renderData`: Render-specific data (position, size, color)
- `metadata`: Extra properties (isCuttable, isDuck, etc.)

### Duck Entity
The duck is a **static sensor body**:
- `isStatic: true` → Doesn't move
- `isSensor: true` → Detects collisions but doesn't affect physics
- Fixed ID `'duck'` for easy lookup
- Rendered with rarity-colored glow + emoji overlay

### Collision Detection
Matter.js `collisionStart` event detects:
1. Duck collisions → lose heart
2. Objects falling off screen → lose heart

### XP Calculation
```typescript
performance = score / totalObjects (0-1)
xp = performance * 25 (0-25)
```

## Benefits of This Architecture

1. **Consistency**: All games have same UI/UX
2. **Reusability**: Write once, use in 4 games
3. **Maintainability**: Bug fixes apply to all games
4. **Scalability**: Easy to add new games
5. **Clean Code**: ~160 lines per game vs ~300+ before
