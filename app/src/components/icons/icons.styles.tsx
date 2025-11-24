import { StyleSheet, type ColorValue } from 'react-native';
import type { IconSize } from './icons';

export function createStyles({
  size = 'small',
  color = '#666',
}: {
  size?: IconSize;
  color?: ColorValue;
}) {
  const containerSize = { small: 24, medium: 32, large: 46 }[size];
  const fontSize = { small: 16, medium: 22, large: 30 }[size];

  return StyleSheet.create({
    container: {
      width: containerSize,
      height: containerSize,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },

    fontello: {
      fontFamily: 'fontello',
      color: color,
      fontSize: fontSize,
    },
  });
}
