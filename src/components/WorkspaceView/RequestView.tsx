import { Text, View } from 'react-native';
import { styles } from './RequestView.styles';
import { Button } from '../Button';
import { sendRequest } from '@/lib/sendRequest';
import { useWorkspaceConext } from '@/states/workspace';

export function RequestView({}: {}) {
  const { openedRequest, status, getHistories, saveHistory } =
    useWorkspaceConext();

  if (status === 'waiting' || !openedRequest) {
    return <></>;
  }

  const { name, url = '', method = 'GET', body, key, headers } = openedRequest;

  const histories = getHistories(key);
  const history = histories.length > 0 ? histories[0] : undefined;

  const onSendRequest = async () => {
    const response = await sendRequest({ url, method, headers, body });
    saveHistory(key, response);
  };

  return (
    <View>
      <View style={styles.name}>
        <Text>{name}</Text>
      </View>
      <View style={styles.requestBar}>
        <View style={styles.methodAndUrl}>
          <View style={styles.method}>
            <Text style={styles.methodText}>{method ?? 'GET'}</Text>
          </View>
          <View>
            <Text style={styles.urlText}>{url}</Text>
          </View>
        </View>
        <Button
          onPress={onSendRequest}
          style={styles.sendButton}
          hoveredStyle={styles.sendButtonHovered}
          pressedStyle={styles.sendButtonPressed}>
          <Text style={styles.sendButtonText}>Send</Text>
        </Button>
      </View>
      {body && (
        <View style={styles.body}>
          <Text style={styles.bodyText}>{JSON.stringify(body, null, 4)}</Text>
        </View>
      )}
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
