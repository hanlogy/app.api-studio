import type { Theme } from '@/states/theme/definitions';
import { StyleSheet } from 'react-native';

export function createStyles({ isLight }: Theme) {
  return StyleSheet.create({
    container: {
      backgroundColor: isLight ? '#F9F9F9' : '#262626',
      borderBottomColor: isLight ? '#EEE' : '#333',
      borderBottomWidth: 1,
    },
  });
}
