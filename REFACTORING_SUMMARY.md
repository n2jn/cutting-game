# Refactoring Summary: Class + Hook Pattern

## What Changed

We refactored all game systems to follow a consistent **Class + Hook** pattern, matching the existing `EntityManager` + `useEntityManager` architecture.

## Before: Hooks with Inline Logic

```typescript
// src/hooks/useHeartSystem.ts (OLD)
export const useHeartSystem = (maxHearts: number) => {
  const [hearts, setHearts] = useState(maxHearts);
  const [isGameOver, setIsGameOver] = useState(false);

  const loseHeart = useCallback(() => {
    let gameOverTriggered = false;
    setHearts((prev) => {
      const newHearts = prev - 1;
      if (newHearts <= 0) {
        setIsGameOver(true);
        gameOverTriggered = true;
      }
      return Math.max(0, newHearts);
    });
    return gameOverTriggered;
  }, []);

  // More logic mixed with React state...
}
```

**Problems:**
- Logic tightly coupled to React
- Can't test without React
- Can't reuse outside React components
- Harder to reason about state changes

## After: Separate Class + Thin Hook

### The Class (Business Logic)

```typescript
// src/systems/HeartSystem.ts (NEW)
export class HeartSystem {
  private hearts: number;
  private readonly maxHearts: number;
  private isGameOver: boolean = false;

  constructor(maxHearts: number = 3) {
    this.maxHearts = maxHearts;
    this.hearts = maxHearts;
  }

  loseHeart(): boolean {
    if (this.isGameOver) return true;
    this.hearts = Math.max(0, this.hearts - 1);
    if (this.hearts <= 0) {
      this.isGameOver = true;
      return true;
    }
    return false;
  }

  getHearts(): number { return this.hearts; }
  getIsGameOver(): boolean { return this.isGameOver; }
  reset(): void { /* ... */ }
}
```

### The Hook (React Integration)

```typescript
// src/hooks/useHeartSystem.ts (NEW)
export const useHeartSystem = (maxHearts: number) => {
  const systemRef = useRef<HeartSystem | null>(null);
  const [, forceUpdate] = useState({});

  if (!systemRef.current) {
    systemRef.current = new HeartSystem(maxHearts);
  }

  const loseHeart = useCallback(() => {
    const result = systemRef.current!.loseHeart();
    forceUpdate({}); // Trigger re-render
    return result;
  }, []);

  return {
    hearts: systemRef.current.getHearts(),
    isGameOver: systemRef.current.getIsGameOver(),
    loseHeart,
    // ...
  };
};
```

**Benefits:**
✅ Logic separated from React
✅ Easy to unit test (just test the class)
✅ Can use in non-React contexts
✅ Explicit re-render control
✅ Type-safe getters

## What Was Refactored

### New System Classes (in `src/systems/`)

1. **`HeartSystem.ts`**
   - Manages hearts/lives
   - Detects game over
   - 85 lines, pure TypeScript

2. **`ScoreSystem.ts`**
   - Tracks score & total objects
   - Calculates XP from performance
   - Awards XP to ducks
   - 82 lines, pure TypeScript

3. **`DuckCollisionSystem.ts`**
   - Handles Matter.js collision events
   - Removes colliding entities
   - Triggers callbacks
   - 70 lines, pure TypeScript

### Updated Hooks (in `src/hooks/`)

1. **`useHeartSystem.ts`** - Now wraps `HeartSystem` class
2. **`useScoreSystem.ts`** - Now wraps `ScoreSystem` class
3. **`useDuckCollision.ts`** - Now wraps `DuckCollisionSystem` class

### Moved to Hooks Directory

- ✅ `useEntityManager.ts` (from `src/core/`)
- ✅ `useGameState.ts` (from `src/core/`)

Now **all hooks are in `src/hooks/`** with a single export point.

## Consistency Across Codebase

All systems now follow the same pattern:

| System | Class | Hook |
|--------|-------|------|
| Entities | `EntityManager` | `useEntityManager` |
| Game State | `GameStateManager` | `useGameState` |
| Hearts | `HeartSystem` | `useHeartSystem` |
| Score | `ScoreSystem` | `useScoreSystem` |
| Collision | `DuckCollisionSystem` | `useDuckCollision` |
| Physics | `PhysicsSync` (static) | `usePhysicsLoop` |
| Cutting | `CuttingSystem` | *(no hook, used directly)* |

## File Organization

```
src/
├── hooks/          # ALL React hooks (thin wrappers)
│   ├── index.ts
│   ├── useEntityManager.ts
│   ├── useGameState.ts
│   ├── useHeartSystem.ts
│   ├── useScoreSystem.ts
│   ├── useDuckCollision.ts
│   └── usePhysicsLoop.ts
│
├── systems/        # Game systems (classes, no React)
│   ├── HeartSystem.ts
│   ├── ScoreSystem.ts
│   ├── DuckCollisionSystem.ts
│   ├── PhysicsSync.ts
│   └── CuttingSystem.ts
│
└── core/           # Core systems (classes, no React)
    ├── EntityManager.ts
    ├── GameStateManager.ts
    ├── EntityFactory.ts
    └── Entity.types.ts
```

## Impact on Game Code

Games are **unaffected** - the hook APIs remain identical:

```typescript
// Still works exactly the same!
const { hearts, loseHeart, reset } = useHeartSystem(3);
const { score, addScore } = useScoreSystem();
useDuckCollision(engine, entityManager, handleDuckHit);
```

The only difference is **under the hood**, the logic is now in testable, reusable classes.

## Testing Benefits

### Before (Hard to Test)
```typescript
// Had to mock React hooks
import { renderHook, act } from '@testing-library/react-hooks';

test('loseHeart', () => {
  const { result } = renderHook(() => useHeartSystem(3));
  act(() => {
    result.current.loseHeart();
  });
  expect(result.current.hearts).toBe(2);
});
```

### After (Easy to Test)
```typescript
// Just test the class!
import { HeartSystem } from '../systems/HeartSystem';

test('loseHeart', () => {
  const system = new HeartSystem(3);
  system.loseHeart();
  expect(system.getHearts()).toBe(2);
});
```

## Summary

✅ **All hooks centralized** in `src/hooks/`
✅ **All logic extracted** to classes in `src/systems/` and `src/core/`
✅ **Consistent pattern** across entire codebase
✅ **No breaking changes** to game code
✅ **Better testability** with pure TypeScript classes
✅ **Clear separation** between React and business logic

The codebase is now **more maintainable, testable, and professional**!
