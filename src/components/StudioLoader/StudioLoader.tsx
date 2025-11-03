import { Text, View } from 'react-native';
import { type PropsWithChildren } from 'react';
import { useStudioConext } from '@/states/studio/useStudioConext';
import { WelcomeView } from './WelcomeView';
import { styles } from './StudioLoader.styles';

export function StudioLoader({ children }: PropsWithChildren) {
  const {
    state: { status, workspace, error },
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
      {workspace ? children : <WelcomeView />}
      {status === 'error' && (
        <View style={styles.bottomBanner}>
          <Text style={styles.errorText}>{error.message}</Text>
        </View>
      )}
      {status === 'loading' && (
        <View style={styles.overlay}>
          <Text> </Text>
        </View>
      )}
      <></>
    </>
  );
}
