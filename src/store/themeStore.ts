import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Interface defining the theme state and actions
 */
interface ThemeState {
  /** Whether dark mode is currently active */
  isDarkMode: boolean;
  /** Toggles between light and dark mode */
  toggleDarkMode: () => void;
}

/**
 * Theme store using Zustand with persistence
 * Manages application theme state and persists it to local storage
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      // Initial state - light mode by default
      isDarkMode: false,
      // Toggle function that switches between light and dark mode
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      // Persistence configuration
      name: 'theme-storage', // Storage key in localStorage
    }
  )
);