import type { PropsWithChildren } from 'react';
import { Text } from 'react-native-macos';
import type { PropsWithTextStyle } from '@/definitions';

export function SelectableText({
  style,
  children,
  numberOfLines,
}: PropsWithChildren<
  PropsWithTextStyle<{
    numberOfLines?: number;
  }>
>) {
  return (
    <Text
      numberOfLines={numberOfLines}
      enableFocusRing={false}
      selectable
      style={style}>
      {children}
    </Text>
  );
}
