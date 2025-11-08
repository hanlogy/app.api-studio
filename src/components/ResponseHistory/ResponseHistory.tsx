import { useWorkspaceContext } from '@/states/workspace';
import { selectCurrentHistories } from '@/states/workspace/selectors';
import { Text, View } from 'react-native-macos';
import { styles } from './ResponseHistory.styles';
import type { PropsWithViewStyle } from '@/definitions';

export function ResponseHistory({ style }: PropsWithViewStyle) {
  const { status, ...restvalue } = useWorkspaceContext();
  const histories = selectCurrentHistories(restvalue);
  const history = histories.length > 0 ? histories[0] : undefined;

  if (status === 'waiting' || !history) {
    return <></>;
  }

  return (
    <View style={style}>
      <Text style={styles.responseHeadersText}>
        {JSON.stringify(history.response.headers, null, 4)}
      </Text>
      <Text>{JSON.stringify(history.response.body, null, 4)}</Text>
    </View>
  );
}
