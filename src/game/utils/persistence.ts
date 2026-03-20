import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlayerState } from '../types/game';

const GAME_STATE_KEY = '@duck_clicker_game_state';

/**
 * Save game state to AsyncStorage
 */
export async function saveGameState(state: PlayerState): Promise<void> {
  try {
    const jsonValue = JSON.stringify(state);
    await AsyncStorage.setItem(GAME_STATE_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving game state:', error);
  }
}

/**
 * Load game state from AsyncStorage
 */
export async function loadGameState(): Promise<PlayerState | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(GAME_STATE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error loading game state:', error);
    return null;
  }
}

/**
 * Clear game state (for debugging/reset)
 */
export async function clearGameState(): Promise<void> {
  try {
    await AsyncStorage.removeItem(GAME_STATE_KEY);
  } catch (error) {
    console.error('Error clearing game state:', error);
  }
}

/**
 * Debounce utility for auto-save
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}
