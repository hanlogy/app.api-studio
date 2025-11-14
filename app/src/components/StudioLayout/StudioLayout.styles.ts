import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
