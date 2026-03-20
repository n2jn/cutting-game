/**
 * Reactive System Port
 * Interface for creating reactive values and render paths
 */

import {
  ReactiveValueFactory,
  ReactiveValue,
} from '../../domain/renderer/ReactiveValue';
import { PathFactory, RenderPath } from '../../domain/renderer/Path';

/**
 * Port for reactive rendering system
 * Provides factories for creating reactive values and paths
 */
export interface IReactiveSystem {
  reactiveValueFactory: ReactiveValueFactory;
  pathFactory: PathFactory;
}

// Re-export types
export type { ReactiveValue, RenderPath };
