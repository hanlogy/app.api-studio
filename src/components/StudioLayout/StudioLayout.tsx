import { useStudioContext } from '@/states/studio';
import { type PropsWithChildren } from 'react';
import { Text, View } from 'react-native';
import { styles } from './StudioLayout.styles';

export const StudioLayout = ({ children }: PropsWithChildren) => {
  const { status, error } = useStudioContext();
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
