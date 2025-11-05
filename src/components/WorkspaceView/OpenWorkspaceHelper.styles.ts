import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    padding: 20,
    display: 'flex',
    flexDirection: 'row',
    maxWidth: 800,
  },
  left: {
    flex: 1,
    paddingRight: 32,
  },
  right: {
    flex: 1,
  },

  openRecentTitle: {
    marginBottom: 12,
    color: '#666',
  },
});

export const openButtonStyles = StyleSheet.create({
  default: {
    backgroundColor: '#f6f6f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },

  pressed: {
    backgroundColor: '#DDD',
  },
  hovered: {
    backgroundColor: '#EEEE',
  },
});

export const tileStyles = StyleSheet.create({
  default: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f6f6f6',
  },

  pressed: {
    backgroundColor: '#DDD',
  },

  hovered: {
    backgroundColor: '#eee',
  },

  name: {
    color: '#333',
    fontWeight: '500',
    marginBottom: 4,
  },

  dir: {
    color: '#666',
  },
});
