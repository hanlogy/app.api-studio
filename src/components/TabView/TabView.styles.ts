import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
  },

  tabBar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  tabButton: {
    height: 32,
    marginRight: 16,
  },

  tabButtonSelected: {
    borderBottomColor: '#089',
    borderBottomWidth: 1,
  },

  tabButtonText: {
    lineHeight: 32,
    color: '#999',
  },

  tabButtonTextSelected: {
    color: '#333',
  },

  content: {
    flex: 1,
  },
});
