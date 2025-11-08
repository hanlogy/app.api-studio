import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
  },

  methodAndUrl: {
    display: 'flex',
    flexDirection: 'row',
    borderWidth: 1,
    height: 36,
    borderRadius: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
    flex: 1,
  },

  method: {
    marginRight: 6,
  },

  methodText: {
    color: '#089',
    fontWeight: '600',
  },

  urlText: {
    color: '#666',
    backgroundColor: 'transparent',
  },

  actionButton: {
    flexShrink: 0,
    marginLeft: 8,
    height: 36,
    width: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  requestButton: {
    backgroundColor: '#089',
  },

  requestButtonHovered: {
    backgroundColor: '#037483ff',
  },

  requestButtonPressed: {
    backgroundColor: '#025d69ff',
  },
  requestButtonText: {
    color: '#FFF',
  },

  cancelButton: {
    backgroundColor: '#AAA',
  },

  cancelButtonHovered: {
    backgroundColor: '#CCC',
  },

  cancelButtonPressed: {
    backgroundColor: '#ddd',
  },

  cancelButtonText: {
    color: '#333',
  },
});
