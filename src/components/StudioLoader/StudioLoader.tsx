import {Text, View} from 'react-native';
import {PropsWithChildren} from 'react';
import {useStudioConext} from '../../states/studio/useStudioConext';
import {OpenWorkspaceButton} from '../OpenWorkspaceButton';
import {styles} from './styles';

export const StudioLoader = ({children}: PropsWithChildren) => {
  const {status, workspace} = useStudioConext();

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

  if (!workspace) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

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
