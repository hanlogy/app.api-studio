import type { Theme } from '@/states/theme/definitions';
import { StyleSheet } from 'react-native';

export function createStyles({ colors }: Theme) {
  return {
    styles: StyleSheet.create({
      container: {
        flex: 1,
        display: 'flex',
      },

      tabBar: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: 56,
      },

      tabButton: {
        height: 32,
        display: 'flex',
        justifyContent: 'center',
        marginRight: 16,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
      },

      tabButtonSelected: {
        borderBottomColor: colors.primary,
      },

      tabButtonText: {
        color: '#999',
      },

      tabButtonTextSelected: {
        color: colors.onBackground,
      },

      content: {
        flex: 1,
      },
    }),
  };
}
