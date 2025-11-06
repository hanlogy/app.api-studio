import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  name: {
    marginBottom: 10,
  },

  requestBar: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 16,
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

  sendButton: {
    flexShrink: 0,
    marginLeft: 8,
    height: 36,
    width: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#089',
    borderRadius: 6,
  },

  sendButtonHovered: {
    backgroundColor: '#037483ff',
  },

  sendButtonPressed: {
    backgroundColor: '#025d69ff',
  },

  sendButtonText: {
    color: '#FFF',
  },

  body: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 6,
    borderColor: '#ccc',
  },

  bodyText: {
    fontFamily: 'Menlo',
    fontSize: 12,
    lineHeight: 20,
    color: '#666',
  },
});
