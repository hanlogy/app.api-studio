import { useContext } from 'react';
import { createContext } from 'react';
import type { ThemeContextValue } from './definitions';

export const useThemeContext = () => {
  return useContext<ThemeContextValue | null>(ThemeContext)!;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);
