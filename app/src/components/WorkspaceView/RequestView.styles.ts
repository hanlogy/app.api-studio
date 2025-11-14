import type { Theme } from '@/states/theme/definitions';
import { StyleSheet } from 'react-native';

export function createStyles({ isLight, colors }: Theme) {
  return {
    styles: StyleSheet.create({
      container: {
        flex: 1,
      },

      requestPanel: {
        flex: 1,
        backgroundColor: colors.background,
      },

      requestName: {
        paddingHorizontal: 16,
      },

      requestNameText: {
        color: isLight ? '#666' : '#DDD',
        lineHeight: 36,
      },

      requestBar: {
        paddingHorizontal: 16,
      },

      requestBuilder: {
        paddingHorizontal: 16,
      },

      responsePanel: {
        borderTopColor: isLight ? '#EEE' : '#333',
        borderTopWidth: 1,
        flex: 1,
      },
    }),
  };
}
