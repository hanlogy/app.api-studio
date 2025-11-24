import type { Theme } from '@/states/theme/definitions';
import { StyleSheet } from 'react-native';

export function createStyles(_: Theme) {
  return StyleSheet.create({
    openWorkspaceHelper: {},
    studioLayout: {
      display: 'flex',
      flexDirection: 'row',
      flex: 1,
    },
    appBar: {
      width: 46,
    },
    content: {
      flex: 1,
    },
    bottomBanner: {
      position: 'absolute',
      height: 36,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      zIndex: 999,
    },

    errorText: {
      color: '#FF9933',
    },

    recentlyOpenedTile: {},

    recentlyOpenedTileText: {
      color: '#333',
    },
  });
}
