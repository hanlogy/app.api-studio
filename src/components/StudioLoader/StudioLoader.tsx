import { Text, View } from 'react-native';
import { type PropsWithChildren } from 'react';
import { useStudioConext } from '@/states/studio/useStudioConext';
import { OpenWorkspaceButton } from '../OpenWorkspaceButton';
import { styles } from './styles';

export const StudioLoader = ({ children }: PropsWithChildren) => {
  const { state } = useStudioConext();

  const { status } = state;

  if (status === 'initializing') {
    return (
      <View>
        <Text>Initializing...</Text>
      </View>
    );
  }

  if (status === 'waiting') {
    return (
      <View>
        <OpenWorkspaceButton />
      </View>
    );
  }

  const { workspace } = state;

  if (status === 'loading' && !workspace) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  // TODO: Handle error

  return (
    <>
      {children}
      {status === 'loading' && (
        <View style={styles.updatingOverlay}>
          <Text>Updating...</Text>
        </View>
      )}
    </>
  );
};
