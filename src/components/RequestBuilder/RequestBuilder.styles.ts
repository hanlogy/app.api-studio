import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
  },

  tabs: {
    paddingTop: 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  content: {
    flex: 1,
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

  bodyContainer: {
    paddingBottom: 16,
  },

  bodyText: {
    fontFamily: 'Menlo',
    fontSize: 12,
    lineHeight: 20,
    color: '#666',
  },

  headerItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
  },

  headerItemKey: {
    minWidth: 120,
  },

  headerItemKeyText: {
    color: '#666',
    fontFamily: 'Menlo',
    fontSize: 12,
    lineHeight: 20,
  },

  headerItemValue: {
    minWidth: 120,
  },

  headerItemValueText: {
    color: '#666',
    fontFamily: 'Menlo',
    fontSize: 12,
    lineHeight: 20,
  },
});
