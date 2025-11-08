import type { PropsWithChildren } from 'react';
import { Text } from 'react-native-macos';
import type { PropsWithTextStyle } from '@/definitions';

export function SelectableText({
  style,
  children,
}: PropsWithChildren<PropsWithTextStyle>) {
  return (
    <Text enableFocusRing={false} selectable style={style}>
      {children}
    </Text>
  );
}
