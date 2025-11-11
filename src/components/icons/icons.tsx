import type { PropsWithChildren } from 'react';
import { Text, View } from 'react-native';
import { styles } from './icons.styles';

function Icon({ children }: PropsWithChildren) {
  return <View style={styles.container}>{children}</View>;
}

function FontIcon({ code }: { code: string }) {
  return (
    <Icon>
      <Text style={styles.fontello}>{code}</Text>
    </Icon>
  );
}

export function ChevronRight() {
  return <FontIcon code={'\ue800'} />;
}

export function ChevronUp() {
  return <FontIcon code={'\ue801'} />;
}


export function ChevronLeft() {
  return <FontIcon code={'\ue802'} />;
}

export function ChevronDown() {
  return <FontIcon code={'\ue803'} />;
}