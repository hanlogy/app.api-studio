import type { PropsWithTextStyle, RequestMethod } from '@/definitions';
import { Text, type TextStyle } from 'react-native';
import { StyleSheet } from 'react-native-macos';

function createStyles({ isCompact }: { isCompact?: boolean }) {
  return StyleSheet.create<
    Record<RequestMethod, TextStyle> & { font: TextStyle }
  >({
    GET: { color: '#00742b' },
    POST: { color: '#a36f07' },
    PUT: { color: '#0049af' },
    PATCH: { color: '#572e8c' },
    DELETE: { color: '#b51408' },
    HEAD: { color: '#00742b' },
    OPTIONS: { color: '#4b4a4a' },
    font: {
      fontWeight: '600',
      letterSpacing: isCompact ? -0.8 : 0,
    },
  });
}

function shorten(method: RequestMethod) {
  if (method === 'DELETE') {
    return 'DEL';
  }
  if (method === 'OPTIONS') {
    return 'OPT';
  }
  return method;
}

export function MethodText({
  style,
  method,
  isCompact,
}: PropsWithTextStyle<{
  readonly method: RequestMethod;
  readonly isCompact?: boolean;
}>) {
  const styles = createStyles({ isCompact });

  return (
    <Text style={[styles.font, style, styles[method]]}>
      {isCompact ? shorten(method) : method}
    </Text>
  );
}
