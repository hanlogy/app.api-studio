import { Text, View, type ColorValue } from 'react-native';
import { createStyles } from './icons.styles';

export type IconSize = 'small' | 'medium' | 'large';
export interface NamedIconProps {
  readonly size?: IconSize;
  readonly color?: ColorValue;
}

function FontIcon({
  code,
  size,
  color,
}: {
  code: string;
  size?: IconSize;
  color?: ColorValue;
}) {
  const styles = createStyles({ size, color });

  return (
    <View style={styles.container}>
      <Text style={styles.fontello}>{code}</Text>
    </View>
  );
}

export function ChevronRightIcon(props: NamedIconProps = {}) {
  return <FontIcon {...props} code={'\ue802'} />;
}

export function ChevronUpIcon(props: NamedIconProps = {}) {
  return <FontIcon {...props} code={'\ue803'} />;
}

export function ChevronLeftIcon(props: NamedIconProps = {}) {
  return <FontIcon {...props} code={'\ue801'} />;
}

export function ChevronDownIcon(props: NamedIconProps = {}) {
  return <FontIcon {...props} code={'\ue800'} />;
}

export function HttpServerIcon(props: NamedIconProps = {}) {
  return <FontIcon {...props} code={'\ue804'} />;
}

export function ServerIcon(props: NamedIconProps = {}) {
  return <FontIcon {...props} code={'\ue807'} />;
}

export function ProxyServerIcon(props: NamedIconProps = {}) {
  return <FontIcon {...props} code={'\ue805'} />;
}

export function RequestIcon(props: NamedIconProps = {}) {
  return <FontIcon {...props} code={'\ue806'} />;
}
