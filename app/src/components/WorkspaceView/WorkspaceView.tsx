import { ScrollView, View } from 'react-native';
import { createStyles } from './WorkspaceView.styles';
import React from 'react';
import { RequestView } from './RequestView';
import { useWorkspaceContext } from '@/states/workspace';
import { EnvironmentSelect } from '../EnvironmentSelect';
import { CollectionsList } from '../CollectionsList';
import { useThemeContext } from '@/states/theme';

export function WorkspaceView() {
  const { workspace } = useWorkspaceContext();
  const { theme } = useThemeContext();
  const { styles } = createStyles(theme);

  if (!workspace) {
    return <></>;
  }

  const { collections } = workspace;

  return (
    <View style={styles.container}>
      <View style={styles.leftBar}>
        <View style={styles.leftBarTop}>
          <EnvironmentSelect />
        </View>

        <ScrollView contentContainerStyle={styles.leftBarContent}>
          <CollectionsList collections={collections} />
        </ScrollView>
      </View>
      <View style={styles.mainContent}>
        <RequestView />
      </View>
    </View>
  );
}
