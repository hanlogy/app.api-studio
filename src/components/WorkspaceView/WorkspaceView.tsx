import { ScrollView, View } from 'react-native';
import { styles } from './WorkspaceView.styles';
import { useStudioConext } from '@/states/studio/useStudioConext';
import { CollectionsList } from './CollectionsList';
import React from 'react';
import { RequestView } from './RequestView';

export function WorkspaceView() {
  const {
    state: { workspace },
    openedRequest,
  } = useStudioConext();

  if (!workspace) {
    return <></>;
  }

  const { collections } = workspace;

  return (
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
  );
}
