import { Text, View } from 'react-native';
import { styles } from './RequestView.styles';
import { selectCurrentRequest, useWorkspaceContext } from '@/states/workspace';
import { RequestBar } from '../RequestBar';
import { RequestBuilder } from '../RequestBuilder';
import { ResponseHistory } from '../ResponseHistory';

export function RequestView({}: {}) {
  const { status, ...restvalue } = useWorkspaceContext();
  const request = selectCurrentRequest(restvalue);

  if (status === 'waiting' || !request) {
    return <></>;
  }

  const { name } = request;

  return (
    <View style={styles.container}>
      <View style={styles.requestPanel}>
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>{name}</Text>
        </View>
        <View style={styles.requestBar}>
          <RequestBar />
        </View>
        <View style={styles.requestBuilder}>
          <RequestBuilder />
        </View>
      </View>
      <View style={styles.responsePanel}>
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Response</Text>
        </View>
        <View style={styles.responseHistory}>
          <ResponseHistory />
        </View>
      </View>
    </View>
  );
}
