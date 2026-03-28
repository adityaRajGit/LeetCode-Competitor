import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Theme } from '@/features/dashboard/types';

/**
 * useTheme Hook
 * Manages theme state with localStorage persistence
 */
export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'light');

  // Apply theme to root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Toggle theme
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return [theme, toggleTheme];
}
