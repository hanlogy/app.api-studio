import { ScrollView, Text, View } from 'react-native';
import { styles } from './WorkspaceView.styles';
import { useStudioConext } from '@/states/studio/useStudioConext';
import { CollectionsList } from './CollectionsList';

export function WorkspaceView() {
  const {
    state: { workspace },
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
          <Text>TODO</Text>
        </View>
      </ScrollView>
    </View>
  );
}
