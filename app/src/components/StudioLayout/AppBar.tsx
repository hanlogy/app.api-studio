import { Text, View } from 'react-native';
import { createStyles } from './AppBar.styles';
import { useThemeContext } from '@/states/theme';
import type { PropsWithViewStyle } from '@/definitions';

export function AppBar({ style }: PropsWithViewStyle) {
  const { theme } = useThemeContext();
  const styles = createStyles(theme);

  return (
    <View style={[style, styles.container]}>
      <Text>AppBar</Text>
    </View>
  );
}
