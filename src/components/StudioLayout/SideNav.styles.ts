import type { Theme } from '@/states/theme/definitions';
import { StyleSheet } from 'react-native';

export function createStyles(_: Theme) {
  return StyleSheet.create({
    container: {
      backgroundColor: '#2C2C2C',
      display: 'flex',
    },

    topGroup: {
      display: 'flex',
      alignItems: 'center',
    },

    apiText: {
      color: '#999',
      fontSize: 20,
    },

    button: {
      width: '100%',
      height: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}
