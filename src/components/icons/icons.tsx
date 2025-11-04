import type { PropsWithChildren } from 'react';
import { Text, View } from 'react-native';
import { styles } from './icons.styles';

function Icon({ children }: PropsWithChildren) {
  return <View style={styles.container}>{children}</View>;
}

export function ChevronRight() {
  return (
    <Icon>
      <Text>+</Text>
    </Icon>
  );
}

export function ChevronDown() {
  return (
    <Icon>
      <Text>-</Text>
    </Icon>
  );
}
