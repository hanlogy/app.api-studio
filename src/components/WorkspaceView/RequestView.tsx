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

  const {
    name,
    collection: { name: collectionName },
  } = request;

  return (
    <View style={styles.container}>
      <View style={styles.requestPanel}>
        <View style={styles.requestName}>
          <Text style={styles.requestNameText}>
            {[collectionName, name].join(' / ')}
          </Text>
        </View>
        <RequestBar style={styles.requestBar} />
        <RequestBuilder style={styles.requestBuilder} />
      </View>
      <ResponsePanel style={styles.responsePanel} />
    </View>
  );
}
