import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  contaienr: {
    display: 'flex',
    flexDirection: 'row',
  },
  lines: {
    display: 'none',
  },
  content: {
    flex: 1,
  },
  jsonText: {
    lineHeight: 20,
  },
  string: { color: '#369' },
  number: { color: '#618e06' },
  boolean: { color: '#A09', fontWeight: 'bold' },
  null: { color: '#A09', fontWeight: 'bold' },
  key: { color: '#b25c06' },
  bracket: { color: '#666' },
});
