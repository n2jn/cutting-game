/**
 * Abstract reactive value interface
 * No dependency on react-native-reanimated
 */

/**
 * Generic reactive value that can be observed for changes
 * Implementations: SharedValue (Reanimated), MobX observable, etc.
 */
export interface ReactiveValue<T> {
  value: T;
}

/**
 * Factory for creating reactive values
 * Implementation will be provided by infrastructure layer
 */
export interface ReactiveValueFactory {
  create<T>(initialValue: T): ReactiveValue<T>;
}
