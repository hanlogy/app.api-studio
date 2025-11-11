import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({});

export const collectionItemStyles = StyleSheet.create({
  button: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 32,
    borderRadius: 16,
  },
  buttonHovered: {
    backgroundColor: '#EEE',
  },
  buttonPressed: {
    backgroundColor: '#DDD',
  },
  requestsList: {
    paddingLeft: 16,
  },
});

export const requestItemStyles = StyleSheet.create({
  button: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
    paddingRight: 8,
    height: 28,
    borderRadius: 16,
  },
  buttonHovered: {
    backgroundColor: '#EEE',
  },
  buttonPressed: {
    backgroundColor: '#DDD',
  },
  text: {
    color: '#666',
  },
});
