import type { Theme } from '@/states/theme/definitions';
import { StyleSheet } from 'react-native';

export function createStyles({ isLight }: Theme) {
  const borderColor = isLight ? '#ccc' : '#444';
  return {
    styles: StyleSheet.create({
      container: {
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderTopColor: borderColor,
        borderLeftColor: borderColor,
      },

      item: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      },

      itemCell: {
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderRightColor: borderColor,
        borderBottomColor: borderColor,
        padding: 8,
        height: '100%',
      },

      itemText: {
        lineHeight: 20,
      },

      itemKey: {
        width: '25%',
      },

      itemKeyText: {
        color: isLight ? '#b25c06' : '#c6690bff',
      },

      itemValue: {
        flex: 1,
      },

      itemValueText: {
        color: isLight ? '#369' : '#327dc7ff',
      },
    }),
  };
}
