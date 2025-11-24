import type { Theme } from '@/states/theme/definitions';
import { StyleSheet } from 'react-native';

export function createStyles({ isLight }: Theme) {
  return {
    styles: StyleSheet.create({
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
      string: {
        color: isLight ? '#369' : '#327dc7ff',
      },
      number: { color: '#618e06' },
      boolean: { color: isLight ? '#A09' : '#bb1fabff', fontWeight: 'bold' },
      null: { color: isLight ? '#A09' : '#bb1fabff', fontWeight: 'bold' },
      key: { color: isLight ? '#b25c06' : '#c6690bff' },
      bracket: { color: isLight ? '#666' : '#CCC' },
    }),
  };
}

export type Styles = ReturnType<typeof createStyles>;
