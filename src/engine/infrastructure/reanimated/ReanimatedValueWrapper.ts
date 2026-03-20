/**
 * Reanimated Value Wrapper
 * Wraps SharedValue as ReactiveValue
 * PERFORMANCE: Holds reference, no conversion on access
 */

import { makeMutable, SharedValue } from 'react-native-reanimated';
import {
  ReactiveValue,
  ReactiveValueFactory,
} from '../../domain/renderer/ReactiveValue';

/**
 * Wrapper class that implements ReactiveValue using SharedValue
 * Performance: Holds reference to underlying SharedValue
 */
class ReanimatedValueWrapper<T> implements ReactiveValue<T> {
  constructor(private sharedValue: SharedValue<T>) {}

  get value(): T {
    return this.sharedValue.value;
  }

  set value(v: T) {
    this.sharedValue.value = v;
  }

  /**
   * Get the underlying SharedValue for direct use in Reanimated components
   * Only use when you need to pass to Reanimated primitives
   */
  getSharedValue(): SharedValue<T> {
    return this.sharedValue;
  }
}

/**
 * Factory for creating Reanimated reactive values
 */
export class ReanimatedFactory implements ReactiveValueFactory {
  create<T>(initialValue: T): ReactiveValue<T> {
    const sharedValue = makeMutable(initialValue);
    return new ReanimatedValueWrapper(sharedValue);
  }

  /**
   * Unwrap to get the underlying SharedValue
   * Useful for legacy code or Reanimated-specific operations
   */
  unwrap<T>(reactive: ReactiveValue<T>): SharedValue<T> {
    if (reactive instanceof ReanimatedValueWrapper) {
      return (reactive as ReanimatedValueWrapper<T>).getSharedValue();
    }
    throw new Error('Cannot unwrap non-Reanimated value');
  }
}
