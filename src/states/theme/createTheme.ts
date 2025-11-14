import type { ColorSchemeName } from 'react-native';
import type { Theme } from './definitions';

const lightTheme: Theme = {
  isLight: true,
  colors: {
    primary: '#9B3DE8',
    onPrimary: '#FFF',
    background: '#FFF',
    onBackground: '#333',
    secondary: '',
    onSecondary: '',
    error: '',
    onError: '',
    errorContainer: '',
    onErrorContainer: '',
  },
};

const darkTheme: Theme = {
  isLight: false,
  colors: {
    primary: '#9B3DE8',
    onPrimary: '#FFF',
    background: '#1A1A1A',
    onBackground: '#FFF',
    secondary: '',
    onSecondary: '',
    error: '',
    onError: '',
    errorContainer: '',
    onErrorContainer: '',
  },
};

export function createTheme(name: ColorSchemeName): Theme {
  return name !== 'dark' ? lightTheme : darkTheme;
}
