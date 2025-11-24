import { Text, View } from 'react-native';
import { pickFolder } from '@/helpers/pickFolder';
import { Clickable } from '../clickables';
import { useStudioContext } from '@/states/studio';
import { createStyles } from './OpenWorkspaceHelper.styles';
import { useThemeContext } from '@/states/theme';
import type { PropsWithViewStyle } from '@/definitions';

export function OpenWorkspaceHelper({ style }: PropsWithViewStyle) {
  const { workspaces, setCurrentWorkspace } = useStudioContext();
  const { theme } = useThemeContext();

  if (!setCurrentWorkspace) {
    return <></>;
  }
  const { styles, openButtonStyles, tileStyles } = createStyles(theme);

  return (
    <View style={[style, styles.container]}>
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
            setCurrentWorkspace({ dir, environment: selectedEnvironment });
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
                    setCurrentWorkspace({
                      dir,
                      environment: selectedEnvironment,
                    })
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
