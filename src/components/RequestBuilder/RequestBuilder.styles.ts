import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
  },

  bodyContainer: {
    paddingBottom: 16,
  },

  bodyNoneText: {
    marginTop: 8,
    color: '#ccc',
    fontStyle: 'italic',
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
