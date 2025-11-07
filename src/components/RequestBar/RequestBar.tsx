import { Text, View } from 'react-native';
import { styles } from './RequestBar.styles';
import { Clickable } from '../clickables';
import { selectCurrentRequest, useWorkspaceContext } from '@/states/workspace';

export function RequestBar() {
  const { status, sendRequest, ...restvalue } = useWorkspaceContext();
  const request = selectCurrentRequest(restvalue);
  if (status === 'waiting' || !request) {
    return <></>;
  }

  const { url = '', method = 'GET' } = request;

  const onSendRequest = async () => {
    await sendRequest();
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
