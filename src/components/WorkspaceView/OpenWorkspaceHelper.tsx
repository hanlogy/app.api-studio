import { Text, View } from 'react-native';

import { pickFolder } from '@/helpers/pickFolder';
import {
  styles,
  tileStyles,
  openButtonStyles,
} from './OpenWorkspaceHelper.styles';
import { Button } from '../Button';
import { useWorkspaceConext } from '@/states/workspace/context';
import { useStudioConext } from '@/states/studio';

export function OpenWorkspaceHelper() {
  const { workspaces } = useStudioConext();
  const { openWorkspace } = useWorkspaceConext();

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Button
          style={openButtonStyles.default}
          hoveredStyle={openButtonStyles.hovered}
          pressedStyle={openButtonStyles.pressed}
          onPress={async () => {
            openWorkspace(await pickFolder());
          }}>
          <Text>Open Workspace...</Text>
        </Button>
      </View>
      <View style={styles.right}>
        {workspaces && workspaces.length > 0 && (
          <>
            <Text style={styles.openRecentTitle}>Open Recent...</Text>
            {workspaces.map(({ name, dir }) => {
              return (
                <Button
                  key={dir}
                  onPress={() => openWorkspace(dir)}
                  style={tileStyles.default}
                  hoveredStyle={tileStyles.hovered}
                  pressedStyle={tileStyles.pressed}>
                  <Text style={tileStyles.name}>{name ?? 'unnamed'}</Text>
                  <Text style={tileStyles.dir}>{dir}</Text>
                </Button>
              );
            })}
          </>
        )}
      </View>
    </View>
  );
}
