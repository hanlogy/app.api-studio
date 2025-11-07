import { Text, View } from 'react-native';
import { styles } from './RequestBar.styles';
import { Clickable } from '../clickables';
import { selectCurrentRequest, useWorkspaceContext } from '@/states/workspace';
import { useState } from 'react';

export function RequestBar() {
  const { status, sendRequest, ...restvalue } = useWorkspaceContext();
  const request = selectCurrentRequest(restvalue);
  const [isWaitingResponse, setIsWaitingResponse] = useState(false);
  if (status === 'waiting' || !request) {
    return <></>;
  }

  const { url = '', method = 'GET' } = request;

  const handleRequest = async () => {
    if (isWaitingResponse) {
      // TODO:
      return;
    }

    setIsWaitingResponse(true);
    await sendRequest();
    setIsWaitingResponse(false);
  };

  const handleCancel = async () => {};

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
      {isWaitingResponse ? (
        <Clickable
          onPress={handleCancel}
          style={[styles.actionButton, styles.cancelButton]}
          hoveredStyle={styles.cancelButtonHovered}
          pressedStyle={styles.cancelButtonPressed}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Clickable>
      ) : (
        <Clickable
          onPress={handleRequest}
          style={[styles.actionButton, styles.requestButton]}
          hoveredStyle={styles.requestButtonHovered}
          pressedStyle={styles.requestButtonPressed}>
          <Text style={styles.requestButtonText}>Send</Text>
        </Clickable>
      )}
    </View>
  );
}
