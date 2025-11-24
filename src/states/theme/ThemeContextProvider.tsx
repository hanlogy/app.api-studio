import type { PropsWithChildren } from 'react';
import { ThemeContext } from './context';
import { useColorScheme } from 'react-native';
import { createTheme } from './createTheme';

export function ThemeContextProvider({ children }: PropsWithChildren<{}>) {
  const colorScheme = useColorScheme();

  const value = { theme: createTheme(colorScheme) };

  return <ThemeContext value={value}>{children}</ThemeContext>;
}
