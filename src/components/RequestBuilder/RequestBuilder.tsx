import { selectCurrentRequest, useWorkspaceContext } from '@/states/workspace';
import { Text, View } from 'react-native';
import { styles } from './RequestBuilder.styles';
import type { PropsWithViewStyle } from '@/definitions';
import { TabView } from '../TabView';
import { JsonViewer } from '../JsonViewer';
import { mergeRequestHeaders } from '@/helpers/mergeRequestHeaders';
import { KeyValueViewer } from '../KeyValueViewer';

const tabs = [
  { label: 'Body', name: 'body' },
  { label: 'Headers', name: 'headers' },
] as const;

export type TabName = (typeof tabs)[number]['name'];

export function RequestBuilder({ style }: PropsWithViewStyle) {
  const { status, ...restvalue } = useWorkspaceContext();
  const request = selectCurrentRequest(restvalue);

  if (status === 'waiting' || !request) {
    return <></>;
  }

  const { body, ...requestRest } = request;
  return (
    <View style={[style, styles.container]}>
      <TabView
        tabs={tabs}
        style={styles.tabView}
        renderContent={name => {
          switch (name) {
            case 'body': {
              if (!body) {
                return (
                  <Text style={styles.bodyNoneText}>
                    This request does not have a body
                  </Text>
                );
              }
              return <JsonViewer style={styles.tabContent} value={body} />;
            }

            case 'headers': {
              return (
                <KeyValueViewer
                  style={styles.tabContent}
                  data={mergeRequestHeaders(requestRest)}
                />
              );
            }
          }
        }}
      />
    </View>
  );
}
