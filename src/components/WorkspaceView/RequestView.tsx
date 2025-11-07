import { Text, View } from 'react-native';
import { styles } from './RequestView.styles';
import { selectCurrentRequest, useWorkspaceContext } from '@/states/workspace';
import { selectCurrentHistories } from '@/states/workspace/selectors';
import { RequestBar } from '../RequestBar';
import { RequestBuilder } from '../RequestBuilder';

export function RequestView({}: {}) {
  const { status, ...restvalue } = useWorkspaceContext();
  const request = selectCurrentRequest(restvalue);

  if (status === 'waiting' || !request) {
    return <></>;
  }

  const { name } = request;

  const histories = selectCurrentHistories(restvalue);
  const history = histories.length > 0 ? histories[0] : undefined;

  return (
    <View>
      <View style={styles.name}>
        <Text>{name}</Text>
      </View>
      <RequestBar />
      <RequestBuilder />
      {history && (
        <View style={styles.response}>
          <View>
            <Text style={styles.responseHeadersText}>
              {JSON.stringify(history.headers, null, 4)}
            </Text>
            <Text>{JSON.stringify(history.body, null, 4)}</Text>
          </View>
        </View>
      )}
    </View>
  );
}
