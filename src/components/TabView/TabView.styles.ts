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
    height: 56,
  },

  tabButton: {
    height: 32,
    display: 'flex',
    justifyContent: 'center',
    marginRight: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },

  tabButtonSelected: {
    borderBottomColor: '#089',
  },

  tabButtonText: {
    color: '#999',
  },

  tabButtonTextSelected: {
    color: '#333',
  },

  content: {
    flex: 1,
  },
});
