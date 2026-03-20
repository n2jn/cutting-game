# Matter Game Expo - Technical Documentation

## Overview

A React Native Expo game built with clean architecture, featuring physics-based gameplay using Matter.js (with plans for Rapier physics engine). The project demonstrates proper separation of concerns through Domain-Driven Design (DDD) and dependency inversion principles.

## Project Structure

```
matter-game-expo/
├── src/
│   ├── engine/                    # Core game engine (Clean Architecture)
│   │   ├── domain/                # Business logic & entities (framework-agnostic)
│   │   │   ├── physics/           # Physics abstractions
│   │   │   ├── geometry/          # Vector2D, Line, etc.
│   │   │   └── operations/        # Cutting, collision detection
│   │   ├── application/           # Use cases & services
│   │   │   ├── ports/             # Interfaces (IPhysicsEngine, etc.)
│   │   │   ├── services/          # EntityService, etc.
│   │   │   └── usecases/          # CreateEntity, PerformCut, etc.
│   │   └── infrastructure/        # External adapters
│   │       ├── matter/            # Matter.js implementation
│   │       ├── reanimated/        # Reanimated SharedValue wrapper
│   │       ├── skia/              # Skia Path wrapper
│   │       └── config/            # Engine configuration
│   ├── game/                      # Game-specific logic
│   │   ├── gameplay/              # Game systems (DuckProtection, etc.)
│   │   └── entities/              # Entity factories
│   ├── components/                # React components
│   │   ├── physics/               # Physics-related components
│   │   ├── game/                  # Game UI components
│   │   └── ui/                    # Reusable UI components
│   └── hooks/                     # React hooks
│       ├── physics/               # Physics loop, entity management
│       ├── game/                  # Game state, systems
│       └── renderer/              # Rendering utilities
├── app/                           # Expo Router screens
├── docs/                          # Technical documentation
└── public/                        # Static assets
```

## Architecture

### Clean Architecture Principles

The project follows clean architecture with three main layers:

#### 1. Domain Layer (`src/engine/domain/`)
- **Pure TypeScript** - No framework dependencies
- **Entities & Value Objects**: `PhysicsBody`, `Vector2D`, `Line`
- **Interfaces**: Abstract contracts like `PhysicsEngine`, `PhysicsWorld`
- **Business Rules**: Core game logic

#### 2. Application Layer (`src/engine/application/`)
- **Use Cases**: `CreateEntityUseCase`, `PerformCutUseCase`, `SyncToRendererUseCase`
- **Services**: `EntityService`, `PhysicsUpdater`
- **Ports**: Interfaces that infrastructure must implement (`IPhysicsEngine`, `ICollisionDetector`)

#### 3. Infrastructure Layer (`src/engine/infrastructure/`)
- **Adapters**: Concrete implementations of ports
  - `MatterPhysicsEngine` - Matter.js adapter
  - `ReanimatedFactory` - Reanimated SharedValue wrapper
  - `SkiaPathFactory` - Skia Path wrapper
- **Dependency Injection**: `EngineFactory` singleton

### Dependency Flow

```
UI/Components → Hooks → Application (Use Cases) → Domain (Interfaces)
                                                        ↑
                                    Infrastructure (Adapters)
```

**Key Benefit**: Can swap physics engines (Matter.js → Rapier) by:
1. Creating new adapter files
2. Changing 1 line in `EngineFactory.ts`
3. **Zero changes** to game logic, UI, or hooks!

## Key Technologies

- **React Native 0.81.4** - Mobile framework
- **Expo 54.0.1** - Development platform
- **TypeScript** - Type safety
- **Matter.js** - Current physics engine (2D rigid body physics)
- **Reanimated 4.1.1** - UI thread animations
- **Skia** - High-performance 2D rendering
- **Gesture Handler** - Touch/gesture handling
- **Nitro Modules 0.35.2** - Native module framework (installed, ready for Rapier)

## Performance Analysis

### Current Bottlenecks

| Priority | Issue | Impact | Location |
|----------|-------|--------|----------|
| 🔴 CRITICAL | Physics on JS thread | Frame drops, unresponsive UI | `usePhysicsLoop.ts` |
| 🔴 CRITICAL | Body sleeping disabled | All bodies simulated always | `EngineConfig.ts` |
| 🟠 HIGH | Object allocations | 600+ Vector2D/frame, GC stalls | `SyncToRenderer.ts` |
| 🟠 HIGH | 60fps sync | Wasted computation | `usePhysicsLoop.ts` |
| 🟠 HIGH | Linear lookups | O(n) during collisions | Entity queries |

### Optimization Paths

#### Path A: Optimize Matter.js (Quick Wins)
**Timeline**: 2-3 hours
**Expected Improvement**: 50-70%

1. Enable body sleeping in `EngineConfig.ts`
2. Reduce sync frequency to 30fps (physics still smooth)
3. Fix object allocations in `SyncToRenderer.ts`
4. Add entity body ID map for O(1) lookups
5. Remove duplicate sync calls

#### Path B: Swap to Rapier WASM
**Timeline**: 4 hours
**Expected Improvement**: 10-30%

- Still runs on JS thread
- Validates Rapier physics behavior
- Easy upgrade path to native later

#### Path C: Rapier Native (via Nitro Modules)
**Timeline**: 3-7 days
**Expected Improvement**: 59x faster, native thread

- Physics runs on native thread (doesn't block JS/UI)
- Zero GC pressure in JavaScript
- Requires Rust toolchain + native bridges

**See**: `/Users/n2jn/.claude/plans/purrfect-splashing-church.md` for detailed implementation guides

## Physics Engine Swapping

### How Easy Is It?

**VERY EASY** - This is the core benefit of clean architecture!

### Example: Matter.js → Rapier

**Step 1**: Create adapter files (3-4 files)
```
src/engine/infrastructure/rapier/
├── RapierPhysicsEngine.ts      # Implements IPhysicsEngine
├── RapierBodyWrapper.ts         # Implements PhysicsBody
├── RapierCollisionDetector.ts   # Implements ICollisionDetector
└── RapierCuttingOperation.ts    # Implements CuttingOperation
```

**Step 2**: Update `EngineFactory.ts` (1 line!)
```typescript
// Before:
const matterEngine = new MatterPhysicsEngine(PHYSICS_CONFIG.gravity);

// After:
const rapierEngine = new RapierPhysicsEngine(PHYSICS_CONFIG.gravity);
```

**Step 3**: Done!
- ✅ Game logic unchanged
- ✅ UI components unchanged
- ✅ Hooks unchanged
- ✅ Rendering unchanged

### Runtime Swapping

Can even swap engines at runtime:

```typescript
// EngineConfig.ts
export const PHYSICS_CONFIG = {
  engine: 'rapier' as 'matter' | 'rapier' | 'box2d',
  // ...
};

// EngineFactory.ts uses factory pattern
switch (PHYSICS_CONFIG.engine) {
  case 'rapier': return new RapierPhysicsEngine(...);
  case 'matter': return new MatterPhysicsEngine(...);
  // ...
}
```

## Component Architecture

### Physics Components

Located in `src/components/physics/`:

- **`Ball.tsx`** - Renders ball entities using Skia Circle
- **`Box.tsx`** - Renders box entities with rotation support
- **`Duck.tsx`** - Renders duck entities (semi-transparent)
- **`Wall.tsx`** - Renders static wall entities
- **`Polygon.tsx`** - Renders cut polygon pieces with rotation
- **`CuttingLine.tsx`** - Main game canvas with cutting gesture
- **`DraggableBall.tsx`** - Draggable overlay for ball entity

### Key Hooks

#### Physics Hooks (`src/hooks/physics/`)
- **`usePhysicsLoop`** - Runs physics update loop via `requestAnimationFrame`
- **`useEntityManager`** - Manages entity lifecycle (create, remove, query)

#### Game Hooks (`src/hooks/game/`)
- **`useGameState`** - Game state management (playing, game over)
- **`useHeartSystem`** - Heart/life system
- **`useScoreSystem`** - Score tracking
- **`useDuckCollision`** - Duck protection logic
- **`useGameSetup`** - Initializes game world (walls, entities)

#### Renderer Hooks (`src/hooks/renderer/`)
- **`useReactiveVector`** - Unwraps `ReactiveValue<Vector2D>` to Reanimated SharedValues for Skia

## Path Aliases

Configured in `tsconfig.json`:

```typescript
import { Entity, EngineFacade } from '@engine';
import { usePhysicsLoop, useGameSetup } from '@hooks';
import { Ball, Box, Polygon } from '@components/physics';
```

## Game Flow

### 1. Initialization (`useGameSetup`)
```typescript
const { entities } = useGameSetup(screenWidth, screenHeight);
```
- Creates physics world
- Spawns walls (boundaries)
- Spawns initial entities (ball, duck, boxes)

### 2. Physics Loop (`usePhysicsLoop`)
```typescript
usePhysicsLoop(entities);
```
- Runs at 60fps via `requestAnimationFrame`
- Updates Matter.js engine
- Syncs physics bodies to Reanimated SharedValues
- Triggers collision detection

### 3. Rendering (`CuttingLine`)
```tsx
<CuttingLine entities={entities} onCut={handleCut} />
```
- Skia Canvas renders all entities
- Uses Reanimated SharedValues for smooth 60fps rendering
- Gesture handler for cutting line input

### 4. Game Systems
- **Duck Protection** - Prevents duck from being cut
- **Heart System** - Lose hearts when duck collides with obstacles
- **Score System** - Gain points for cutting objects

## Entity System

### Entity Structure

```typescript
interface Entity {
  id: string;
  type: 'ball' | 'box' | 'duck' | 'wall' | 'polygon';
  physicsBody?: PhysicsBody;      // Optional (walls don't need physics)
  renderData: RenderData;          // Type-specific render data
  metadata?: Record<string, any>;  // Custom data
}
```

### Render Data Types

```typescript
type RenderData =
  | BallRenderData    // { type: 'ball', position, radius }
  | BoxRenderData     // { type: 'box', position, width, height, angle, rotationOrigin }
  | DuckRenderData    // { type: 'duck', position, radius, rarityColor }
  | WallRenderData    // { type: 'wall', position, width, height }
  | PolygonRenderData // { type: 'polygon', position, path, angle, rotationOrigin }
```

### Creating Entities

```typescript
// Via EngineFacade
const entity = EngineFacade.creator.createBall({
  position: { x: 100, y: 100 },
  radius: 20,
});

EngineFacade.entities.register(entity);
```

## Cutting System

### How Cutting Works

1. **User Input**: Pan gesture in `CuttingLine.tsx`
2. **Raycast**: Convert gesture to line, perform raycast
3. **Collision Detection**: Find bodies intersecting line
4. **Cut Operation**: Use `PerformCutUseCase`
5. **Polygon Generation**: Split bodies into convex polygons
6. **Physics Update**: Create new entities for each piece

### Protection System

`DuckProtectionSystem` prevents cutting protected entities:

```typescript
const protectedIds = new Set(['duck-id']);
const result = EngineFacade.cutter.performCut(cuttingLine, protectedIds);
```

## Development

### Running the App

```bash
# Install dependencies
npm install

# Start Expo dev server
npm start

# iOS
npm run ios

# Android
npm run android
```

### Building for Production

```bash
# Development build (required for native modules)
npx expo run:ios
npx expo run:android

# Production build
eas build --platform ios
eas build --platform android
```

## Future Improvements

### Phase 1: Matter.js Optimizations (Recommended First)
- [ ] Enable body sleeping
- [ ] Reduce sync frequency to 30fps
- [ ] Fix object allocations
- [ ] Add entity body ID map
- [ ] Remove duplicate sync calls

**Estimated**: 2-3 hours, 50-70% improvement

### Phase 2: Rapier WASM (Validation)
- [ ] Install `@dimforge/rapier2d`
- [ ] Implement `RapierWasmPhysicsEngine`
- [ ] Test physics behavior
- [ ] Profile performance

**Estimated**: 4 hours, 10-30% improvement

### Phase 3: Rapier Native (Production)
- [ ] Setup Rust toolchain
- [ ] Implement Rust wrapper
- [ ] Create native bridges (iOS/Android)
- [ ] Build and test

**Estimated**: 3-7 days, 59x improvement

### Phase 4: Advanced Features
- [ ] Object pooling for Vector2D
- [ ] Entity limiter (prevent exponential growth)
- [ ] Spatial partitioning
- [ ] Custom collision detection
- [ ] Multi-threaded physics

## Performance Benchmarks

### Current (Matter.js)
- 100 bodies: 8-12ms per frame
- Blocks JS thread
- GC pressure from allocations

### Target (Rapier Native)
- 100 bodies: 0.1-0.5ms per frame
- Native thread (non-blocking)
- Zero GC pressure in JS

## Resources

### Internal Documentation
- **Performance Plan**: `/Users/n2jn/.claude/plans/purrfect-splashing-church.md`
- **Architecture Guides**:
  - `ARCHITECTURE_REFACTOR.md`
  - `PATH_ALIASES_GUIDE.md`

### External Resources
- [Matter.js Documentation](https://brm.io/matter-js/)
- [Rapier Physics Engine](https://rapier.rs/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [React Native Skia](https://shopify.github.io/react-native-skia/)
- [Nitro Modules](https://nitro.margelo.com/)

## License

MIT

## Credits

Built with clean architecture principles, demonstrating proper separation of concerns and dependency inversion for maximum flexibility and maintainability.
