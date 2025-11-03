import { Text, View } from 'react-native';
import { type PropsWithChildren } from 'react';
import { useStudioConext } from '@/states/studio/useStudioConext';
import { OpenWorkspaceButton } from '../OpenWorkspaceButton';
import { styles } from './styles';

export function StudioLoader({ children }: PropsWithChildren) {
  const {
    state: { status, workspace, workspaces, error },
  } = useStudioConext();

  if (status === 'initializing') {
    return (
      <View>
        <Text>Initializing...</Text>
      </View>
    );
  }

  return (
    <>
      {workspace ? (
        children
      ) : (
        <View>
          <OpenWorkspaceButton />
          <Text>Recently opened...</Text>
        </View>
      )}
      {status === 'error' && (
        <View style={styles.bottomBanner}>
          <Text style={styles.errorText}>{error.message}</Text>
        </View>
      )}
      {status === 'loading' && (
        <View style={styles.overlay}>
          <Text>Loading...</Text>
        </View>
      )}
      <></>
    </>
  );
}
