import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  leftBar: {
    width: 300,
    flexShrink: 0,
    flexGrow: 0,
    backgroundColor: '#F6F6F6',
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
    backgroundColor: '#FFF',
    borderLeftColor: '#EEE',
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
});
