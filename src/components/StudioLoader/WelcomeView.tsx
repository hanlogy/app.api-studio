import { Text, View } from 'react-native';

import { useStudioConext } from '@/states/studio/useStudioConext';
import { pickFolder } from '@/helpers/pickFolder';
import { styles, tileStyles, openButtonStyles } from './WelcomeView.styles';
import { Button } from '../Button';

export function WelcomeView() {
  const {
    state: { workspaces },
    openWorkspace,
  } = useStudioConext();

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
