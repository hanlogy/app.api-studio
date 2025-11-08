import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
  },

  methodAndUrl: {
    display: 'flex',
    flexDirection: 'row',
    minHeight: 42,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#999',
    paddingHorizontal: 8,
    paddingVertical: 6,
    alignItems: 'center',
    flex: 1,
  },

  method: {
    marginRight: 8,
  },

  url: {
    flex: 1,
  },

  methodText: {
    color: '#089',
    fontWeight: '600',
  },

  methodGetText: { color: '#00742b' },
  methodPostText: { color: '#a36f07' },
  methodPutText: { color: '#0049af' },
  methodPatchText: { color: '#572e8c' },
  methodDeleteText: { color: '#831911' },
  methodHeadText: { color: '#00742b' },
  methodOptionsText: { color: '#9d175f' },

  urlText: {
    color: '#666',
    backgroundColor: 'transparent',
  },

  actionButton: {
    flexShrink: 0,
    marginLeft: 8,
    height: 42,
    width: 120,
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
