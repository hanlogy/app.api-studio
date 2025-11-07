import { Text, View } from 'react-native';
import { styles } from './RequestView.styles';
import { selectCurrentRequest, useWorkspaceContext } from '@/states/workspace';
import { RequestBar } from '../RequestBar';
import { RequestBuilder } from '../RequestBuilder';
import { ResponsePanel } from '../ResponsePanel';

export function RequestView({}: {}) {
  const { status, ...restvalue } = useWorkspaceContext();
  const request = selectCurrentRequest(restvalue);

  if (status === 'waiting' || !request) {
    return <></>;
  }

  const { name } = request;

  return (
    <View>
      <View style={styles.name}>
        <Text>{name}</Text>
      </View>
      <RequestBar />
      <RequestBuilder />
      <ResponsePanel />
    </View>
  );
}
