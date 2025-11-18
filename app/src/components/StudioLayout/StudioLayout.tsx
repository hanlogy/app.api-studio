import { useStudioContext } from '@/states/studio';
import { type PropsWithChildren } from 'react';
import { Text, View } from 'react-native';
import { AppBar } from './AppBar';
import { useThemeContext } from '@/states/theme';
import { createStyles } from './StudioLayout.styles';

export const StudioLayout = ({ children }: PropsWithChildren) => {
  const { theme } = useThemeContext();
  const styles = createStyles(theme);

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
      <View>
        <AppBar style={styles.appBar} />
        <View style={styles.content}>{children}</View>
      </View>
    </>
  );
};
