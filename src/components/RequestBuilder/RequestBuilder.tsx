import { selectCurrentRequest, useWorkspaceContext } from '@/states/workspace';
import { Text, View } from 'react-native';
import { styles } from './RequestBuilder.styles';
import type { PropsWithViewStyle } from '@/definitions';
import { TabView } from '../TabView';
import { JsonViewer } from '../JsonViewer';
import { mergeRequestHeaders } from '@/helpers/mergeRequestHeaders';

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
              return (
                <View style={styles.bodyContainer}>
                  <JsonViewer value={body} />
                </View>
              );
            }
            case 'headers': {
              return Object.entries(mergeRequestHeaders(requestRest)).map(
                ([key, value]) => {
                  return (
                    <View key={key} style={styles.headerItem}>
                      <View style={styles.headerItemKey}>
                        <Text style={styles.headerItemKeyText}>{key}</Text>
                      </View>
                      <View style={styles.headerItemValue}>
                        <Text style={styles.headerItemValueText}>{value}</Text>
                      </View>
                    </View>
                  );
                },
              );
            }
          }
        }}
      />
    </View>
  );
}
