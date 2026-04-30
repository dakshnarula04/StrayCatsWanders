import { useState, useEffect } from 'react';

/**
 * Custom hook to manage the application's color theme (light/dark).
 * Synchronizes state with localStorage and the document's root class list.
 * 
 * @returns {Object} An object containing the current theme state and a toggle function.
 * @returns {boolean} dark - True if the current theme is dark.
 * @returns {Function} toggle - Function to switch between light and dark themes.
 */
export const useTheme = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    // Check localStorage first
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      return storedTheme === 'dark';
    }
    // Fall back to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggle = () => setIsDark((prev) => !prev);

  return { dark: isDark, toggle };
};
