import { useTheme as useThemeContext } from '../context/ThemeContext';

/**
 * Custom hook that wraps the global ThemeContext.
 * Ensures consistent theme state across all components.
 */
export const useTheme = () => {
  return useThemeContext();
};
