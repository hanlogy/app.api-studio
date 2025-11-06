import type { RequestResource } from '@/definitions';
import { Text, View } from 'react-native';
import { styles } from './RequestView.styles';
import { Button } from '../Button';

export function RequestView({
  request: { name, url, method, body },
}: {
  request: RequestResource;
}) {
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
    </View>
  );
}
