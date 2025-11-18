import { Text, View, type ColorValue } from 'react-native';
import { createStyles } from './icons.styles';

export type IconSize = 'small' | 'medium' | 'large';
interface IconArgs {
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

export function ChevronRightIcon(args: IconArgs = {}) {
  return <FontIcon {...args} code={'\ue804'} />;
}

export function ChevronUpIcon(args: IconArgs = {}) {
  return <FontIcon {...args} code={'\ue806'} />;
}

export function ChevronLeftIcon(args: IconArgs = {}) {
  return <FontIcon {...args} code={'\ue805'} />;
}

export function ChevronDownIcon(args: IconArgs = {}) {
  return <FontIcon {...args} code={'\ue800'} />;
}

export function HttpServerIcon(args: IconArgs = {}) {
  return <FontIcon {...args} code={'\ue801'} />;
}

export function ProxyServerIcon(args: IconArgs = {}) {
  return <FontIcon {...args} code={'\ue802'} />;
}

export function RequestIcon(args: IconArgs = {}) {
  return <FontIcon {...args} code={'\ue803'} />;
}
