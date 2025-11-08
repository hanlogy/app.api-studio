import type { PropsWithTextStyle, RequestMethod } from '@/definitions';
import { Text, type TextStyle } from 'react-native';
import { StyleSheet } from 'react-native-macos';

const methodStyles = StyleSheet.create<
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
  },
});

export function MethodText({
  style,
  method,
}: PropsWithTextStyle<{
  readonly method: RequestMethod;
}>) {
  return (
    <Text style={[methodStyles.font, style, methodStyles[method]]}>
      {method}
    </Text>
  );
}
