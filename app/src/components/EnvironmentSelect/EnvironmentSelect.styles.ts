import type { Theme } from '@/states/theme/definitions';
import { StyleSheet } from 'react-native';

export function createStyles({ isLight, colors }: Theme) {
  return {
    styles: StyleSheet.create({
      container: {
        position: 'relative',
        zIndex: 10,
      },

      handle: {
        height: 32,
        borderColor: isLight ? '#999' : '#333',
        backgroundColor: colors.background,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderRadius: 5,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },

      handleHovered: {
        backgroundColor: isLight ? '#EEE' : '#333',
      },

      handlePressed: {
        backgroundColor: isLight ? '#DDD' : '#222',
      },

      selectedLabel: {
        color: isLight ? '#666' : '#ccc',
      },

      dropdown: {
        position: 'absolute',
        left: 0,
        top: 32,
        right: 0,
        backgroundColor: colors.background,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: isLight ? '#666' : '#333',
      },

      dropdownItem: {
        paddingHorizontal: 16,
        paddingVertical: 2,
        height: 36,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
      },

      dropdownItemHovered: {
        backgroundColor: isLight ? '#EEE' : '#333',
      },

      dropdownItemPressed: {
        backgroundColor: isLight ? '#DDD' : '#222',
      },
    }),
  };
}
