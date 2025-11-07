import { useWorkspaceContext } from '@/states/workspace';
import { selectCurrentHistories } from '@/states/workspace/selectors';
import { Text } from 'react-native';
import { styles } from './ResponseHistory.styles';

export function ResponseHistory() {
  const { status, ...restvalue } = useWorkspaceContext();
  const histories = selectCurrentHistories(restvalue);
  const history = histories.length > 0 ? histories[0] : undefined;

  if (status === 'waiting' || !history) {
    return <></>;
  }

  return (
    <>
      <Text style={styles.responseHeadersText}>
        {JSON.stringify(history.response.headers, null, 4)}
      </Text>
      <Text>{JSON.stringify(history.response.body, null, 4)}</Text>
    </>
  );
}
