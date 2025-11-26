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

      serverConfig: {
        padding: 16,
      },
    }),

    serverContext: StyleSheet.create({
      container: {
        display: 'flex',
      },

      toolbar: {
        height: 50,
        backgroundColor: isLight ? '#FFF' : '#333',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
      },

      toggleButton: {
        backgroundColor: '#DDD',
        paddingHorizontal: 16,
        height: 36,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 18,
      },
      toggleButtonHovered: {
        backgroundColor: '#EEE',
      },
      toggleButtonPressed: {
        backgroundColor: '#DDD',
      },
    }),

    serverItemStyles: StyleSheet.create({
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
      routesList: {
        paddingLeft: 16,
      },

      statusDot: {
        width: 12,
        height: 12,
        backgroundColor: isLight ? '#CCC' : '#999',
        borderRadius: 6,
        marginRight: 8,
      },
      statusDotActive: {
        backgroundColor: '#74a216ff',
      },
    }),
  };
}
