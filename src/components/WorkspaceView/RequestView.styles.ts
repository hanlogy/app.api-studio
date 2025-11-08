import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  requestPanel: {
    flex: 1,
    backgroundColor: '#FFF',
  },

  responsePanel: {
    borderTopColor: '#EEE',
    borderTopWidth: 1,
    flex: 1,
    backgroundColor: '#FFF',
  },

  sectionTitle: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  sectionTitleText: {
    color: '#666',
  },

  requestBar: {
    paddingHorizontal: 16,
  },

  requestBuilder: {
    paddingHorizontal: 16,
  },

  responseHistory: {
    padding: 16,
  },
});
