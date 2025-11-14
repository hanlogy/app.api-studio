import { Text, View } from 'react-native';
import { pickFolder } from '@/helpers/pickFolder';
import { Clickable } from '../clickables';
import { useWorkspaceContext } from '@/states/workspace/context';
import { useStudioContext } from '@/states/studio';
import { createStyles } from './OpenWorkspaceHelper.styles';
import { useThemeContext } from '@/states/theme';

export function OpenWorkspaceHelper() {
  const { workspaces } = useStudioContext();
  const { openWorkspace } = useWorkspaceContext();
  const { theme } = useThemeContext();
  const { styles, openButtonStyles, tileStyles } = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Clickable
          style={openButtonStyles.default}
          hoveredStyle={openButtonStyles.hovered}
          pressedStyle={openButtonStyles.pressed}
          onPress={async () => {
            const dir = await pickFolder();
            const selectedEnvironment = workspaces?.find(
              e => e.dir === dir,
            )?.selectedEnvironment;
            openWorkspace({ dir, environment: selectedEnvironment });
          }}>
          <Text>Open Workspace...</Text>
        </Clickable>
      </View>
      <View style={styles.right}>
        {/* Enable this feature later */}
        {workspaces && workspaces.length > 10000 && (
          <>
            <Text style={styles.openRecentTitle}>Open Recent...</Text>
            {workspaces.map(({ name, dir, selectedEnvironment }) => {
              return (
                <Clickable
                  key={dir}
                  onPress={() =>
                    openWorkspace({ dir, environment: selectedEnvironment })
                  }
                  style={tileStyles.default}
                  hoveredStyle={tileStyles.hovered}
                  pressedStyle={tileStyles.pressed}>
                  <Text style={tileStyles.name}>{name ?? 'unnamed'}</Text>
                  <Text style={tileStyles.dir}>{dir}</Text>
                </Clickable>
              );
            })}
          </>
        )}
      </View>
    </View>
  );
}
