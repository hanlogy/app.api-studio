import type { ColorValue } from 'react-native';

export interface ThemeContextValue {
  readonly theme: Theme;
}

export interface Theme {
  readonly isLight: boolean;
  readonly colors: {
    readonly primary: ColorValue;
    readonly onPrimary: ColorValue;
    readonly background: ColorValue;
    readonly onBackground: ColorValue;
    readonly secondary: ColorValue;
    readonly onSecondary: ColorValue;
    readonly error: ColorValue;
    readonly onError: ColorValue;
    readonly errorContainer: ColorValue;
    readonly onErrorContainer: ColorValue;
  };

  // TODO: define font size etc.
}
