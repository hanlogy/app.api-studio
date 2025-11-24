import type { Theme } from '@/states/theme/definitions';
import { StyleSheet } from 'react-native';

export function createStyles({ isLight }: Theme) {
  return {
    styles: StyleSheet.create({}),

    collectionItemStyles: StyleSheet.create({
      button: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: 32,
        borderRadius: 16,
      },
      buttonHovered: {
        backgroundColor: isLight ? '#EEE' : '#333',
      },
      buttonPressed: {
        backgroundColor: isLight ? '#DDD' : '#2F2F2F',
      },
      requestsList: {
        paddingLeft: 16,
      },
    }),

    requestItemStyles: StyleSheet.create({
      button: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 0,
        paddingRight: 8,
        height: 28,
        borderRadius: 16,
      },
      buttonHovered: {
        backgroundColor: isLight ? '#EEE' : '#333',
      },
      buttonPressed: {
        backgroundColor: isLight ? '#DDD' : '#2F2F2F',
      },
      method: { marginRight: 4, width: 39 },
      methodText: { fontSize: 10, textAlign: 'right', fontWeight: '600' },

      text: {
        color: isLight ? '#666' : '#DDD',
      },
    }),
  };
}
