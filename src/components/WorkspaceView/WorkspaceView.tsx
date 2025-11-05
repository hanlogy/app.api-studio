import { ScrollView, View } from 'react-native';
import { styles } from './WorkspaceView.styles';
import { CollectionsList } from './CollectionsList';
import React from 'react';
import { RequestView } from './RequestView';
import { useWorkspaceConext } from '@/states/workspace/context';
import { OpenWorkspaceHelper } from './OpenWorkspaceHelper';

export function WorkspaceView() {
  const { workspace, openedRequest } = useWorkspaceConext();

  if (!workspace) {
    return <OpenWorkspaceHelper />;
  }

  const { collections } = workspace;

  return (
    <>
      <View style={styles.container}>
        <ScrollView style={styles.leftView}>
          <View style={styles.leftContent}>
            <CollectionsList collections={collections} />
          </View>
        </ScrollView>
        <ScrollView style={styles.rightView}>
          <View style={styles.rightContent}>
            {openedRequest && <RequestView request={openedRequest} />}
          </View>
        </ScrollView>
      </View>
    </>
  );
}
