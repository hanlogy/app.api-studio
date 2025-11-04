import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  leftView: {
    width: 300,
    flexShrink: 0,
    flexGrow: 0,
    backgroundColor: '#F6F6F6',
  },
  leftContent: {
    padding: 16,
  },
  rightContent: {
    padding: 16,
  },
  rightView: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
  },
});
