import { useThemeContext } from '@/states/theme';
import { useWorkspaceContext } from '@/states/workspace';
import { Text, ScrollView, View } from 'react-native-macos';
import { createStyles } from './MockServersView.styles';

export function MockServersView() {
  const { workspace } = useWorkspaceContext();
  const { theme } = useThemeContext();
  const { styles } = createStyles(theme);

  if (!workspace) {
    return <></>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.leftBar}>
        <View style={styles.leftBarTop}>
          <Text>Mock Servers</Text>
        </View>

        <ScrollView contentContainerStyle={styles.leftBarContent}>
          <Text>Server list</Text>
        </ScrollView>
      </View>
      <View style={styles.mainContent}>
        <Text>TODO: Route config</Text>
      </View>
    </View>
  );
}
