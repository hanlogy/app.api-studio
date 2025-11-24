import { useStudioContext } from '@/states/studio';
import { useState, type ReactNode } from 'react';
import { Text, View } from 'react-native';
import { SideNav } from './SideNav';
import { useThemeContext } from '@/states/theme';
import { createStyles } from './StudioLayout.styles';
import { OpenWorkspaceHelper } from '../OpenWorkspaceHelper';
import { WorkspaceContextProvider } from '@/states/workspace';
import type { NavName } from '@/definitions';

export const StudioLayout = ({
  renderWorkspace,
}: {
  readonly renderWorkspace: (name: NavName) => ReactNode;
}) => {
  const { theme } = useThemeContext();
  const styles = createStyles(theme);
  const [selectedNav, setSelectedNav] = useState<NavName>('requests');

  const { status, error, currentWorkspace } = useStudioContext();
  if (status === 'initializing') {
    return (
      <View>
        <Text>Initializing...</Text>
      </View>
    );
  }

  if (!currentWorkspace) {
    return <OpenWorkspaceHelper style={styles.openWorkspaceHelper} />;
  }

  return (
    <>
      {error && (
        <View style={styles.bottomBanner}>
          <Text style={styles.errorText}>{error.message}</Text>
        </View>
      )}
      <View style={styles.studioLayout}>
        <SideNav
          selected={selectedNav}
          onChanged={setSelectedNav}
          style={styles.appBar}
        />
        <View style={styles.content}>
          <WorkspaceContextProvider
            dir={currentWorkspace.dir}
            environment={currentWorkspace.environment}>
            {renderWorkspace(selectedNav)}
          </WorkspaceContextProvider>
        </View>
      </View>
    </>
  );
};
