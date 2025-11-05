import { useStudioConext } from '@/states/studio';
import { type PropsWithChildren } from 'react';
import { Text, View } from 'react-native';
import { styles } from './StudioLayout.styles';

export const StudioLayout = ({ children }: PropsWithChildren) => {
  const { status, error } = useStudioConext();
  if (status === 'initializing') {
    return (
      <View>
        <Text>Initializing...</Text>
      </View>
    );
  }

  return (
    <>
      {error && (
        <View style={styles.bottomBanner}>
          <Text style={styles.errorText}>{error.message}</Text>
        </View>
      )}
      {children}
    </>
  );
};
