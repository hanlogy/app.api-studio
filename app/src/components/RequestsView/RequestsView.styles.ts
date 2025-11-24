import type { Theme } from '@/states/theme/definitions';
import { StyleSheet } from 'react-native';

export function createStyles({ isLight, colors }: Theme) {
  return {
    styles: StyleSheet.create({
      container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
      },
      leftBar: {
        width: 300,
        flexShrink: 0,
        flexGrow: 0,
        backgroundColor: isLight ? '#F9F9F9' : '#222',
        paddingBottom: 8,
      },

      leftBarTop: {
        paddingLeft: 16,
        paddingTop: 16,
        paddingRight: 16,
        paddingBottom: 8,
        zIndex: 10,
      },

      leftBarContent: {
        paddingHorizontal: 16,
      },

      mainContent: {
        flex: 1,
        backgroundColor: colors.background,
        borderLeftColor: isLight ? '#EDEDED' : '#333',
        borderLeftWidth: 1,
      },
      overlay: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        zIndex: 999,
      },
    }),
  };
}
