import { selectCurrentRequest, useWorkspaceContext } from '@/states/workspace';
import { Text, View } from 'react-native';
import { styles } from './RequestBuilder.styles';

export function RequestBuilder() {
  const { status, ...restvalue } = useWorkspaceContext();
  const request = selectCurrentRequest(restvalue);
  if (status === 'waiting' || !request) {
    return <></>;
  }
  const { body } = request;
  return (
    body && (
      <View style={styles.container}>
        <Text style={styles.bodyText}>{JSON.stringify(body, null, 4)}</Text>
      </View>
    )
  );
}
