import { Text, View } from 'react-native';
import { styles } from './RequestBar.styles';
import { Clickable } from '../clickables';
import { sendRequest } from '@/lib/sendRequest';
import { selectCurrentRequest, useWorkspaceContext } from '@/states/workspace';
import { mergeHeaders } from './mergeHeaders';

export function RequestBar() {
  const { status, saveHistory, ...restvalue } = useWorkspaceContext();
  const request = selectCurrentRequest(restvalue);
  if (status === 'waiting' || !request) {
    return <></>;
  }

  const {
    url = '',
    method = 'GET',
    body,
    key,
    headers,
    environments,
    collection,
  } = request;

  const onSendRequest = async () => {
    const response = await sendRequest({
      url,
      method,
      body,
      headers: mergeHeaders({ environments, collection, headers }),
    });
    saveHistory(key, response);
  };

  return (
    <View style={styles.container}>
      <View style={styles.methodAndUrl}>
        <View style={styles.method}>
          <Text style={styles.methodText}>{method ?? 'GET'}</Text>
        </View>
        <View>
          <Text style={styles.urlText}>{url}</Text>
        </View>
      </View>
      <Clickable
        onPress={onSendRequest}
        style={styles.sendButton}
        hoveredStyle={styles.sendButtonHovered}
        pressedStyle={styles.sendButtonPressed}>
        <Text style={styles.sendButtonText}>Send</Text>
      </Clickable>
    </View>
  );
}
