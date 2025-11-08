import { StyleSheet } from 'react-native';

const borderColor = '#ccc';
export const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: borderColor,
    borderLeftColor: borderColor,
  },

  item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  itemCell: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderRightColor: borderColor,
    borderBottomColor: borderColor,
    padding: 8,
    height: '100%',
  },

  itemText: {
    lineHeight: 20,
  },

  itemKey: {
    minWidth: 120,
    width: '25%',
  },

  itemKeyText: {
    color: '#b25c06',
  },

  itemValue: {
    flex: 1,
  },

  itemValueText: {
    color: '#369',
  },
});
