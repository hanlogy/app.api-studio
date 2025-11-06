import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 10,
    marginBottom: 8,
  },

  handle: {
    height: 32,
    borderColor: '#999',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  handleHovered: {
    backgroundColor: '#EEE',
  },

  handlePressed: {
    backgroundColor: '#DDD',
  },

  selectedLabel: {
    fontSize: 14,
    color: '#666',
  },

  dropdown: {
    position: 'absolute',
    left: 0,
    top: 32,
    right: 0,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#666',
  },

  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 2,
    height: 36,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
  },

  dropdownItemHovered: {
    backgroundColor: '#EEE',
  },

  dropdownItemPressed: {
    backgroundColor: '#DDD',
  },
});
