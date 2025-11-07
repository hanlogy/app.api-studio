import { useWorkspaceContext } from '@/states/workspace';
import { selectCurrentHistories } from '@/states/workspace/selectors';
import { Text, View } from 'react-native';
import { styles } from './ResponsePanel.styles';

export function ResponsePanel() {
  const { status, ...restvalue } = useWorkspaceContext();
  const histories = selectCurrentHistories(restvalue);
  const history = histories.length > 0 ? histories[0] : undefined;

  if (status === 'waiting' || !history) {
    return <></>;
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.responseHeadersText}>
          {JSON.stringify(history.response.headers, null, 4)}
        </Text>
        <Text>{JSON.stringify(history.response.body, null, 4)}</Text>
      </View>
    </View>
  );
}
