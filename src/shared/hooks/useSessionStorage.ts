import { useState } from 'react';

/**
 * useSessionStorage Hook
 * Type-safe sessionStorage hook with automatic JSON serialization
 *
 * Note: Unlike localStorage, sessionStorage does NOT emit 'storage' events
 * across tabs/windows, so no cross-tab sync listener is needed.
 */
export function useSessionStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // Get initial value from sessionStorage or use provided initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update sessionStorage when value changes
  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      // Allow value to be a function like useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
