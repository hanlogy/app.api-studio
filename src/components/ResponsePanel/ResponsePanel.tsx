import { useWorkspaceContext } from '@/states/workspace';
import { selectCurrentHistories } from '@/states/workspace/selectors';
import { Text, View } from 'react-native-macos';
import { createStyles } from './ResponsePanel.styles';
import type { PropsWithViewStyle } from '@/definitions';
import { HttpStatusText } from '../text';
import { TabView } from '../TabView';
import { JsonViewer } from '../JsonViewer';
import { KeyValueViewer } from '../KeyValueViewer';
import { checkBodyFormat } from '@/lib/sendHttpRequest/checkBodyFormat';
import { useThemeContext } from '@/states/theme';

const tabs = [
  { label: 'Body', name: 'body' },
  { label: 'Headers', name: 'headers' },
] as const;

export function ResponsePanel({ style }: PropsWithViewStyle) {
  const { status, ...restvalue } = useWorkspaceContext();
  const histories = selectCurrentHistories(restvalue);
  const history = histories.length > 0 ? histories[0] : undefined;
  const { theme } = useThemeContext();

  if (status === 'waiting' || !history) {
    return <></>;
  }

  const {
    headers,
    body,
    status: httpStatus,
    requestTime,
    responseTime,
  } = history.response;

  const duration = responseTime - requestTime;
  const bodyFormat = checkBodyFormat(headers ?? {});
  const { styles } = createStyles(theme);

  return (
    <View style={[style, styles.container]}>
      <View style={styles.sectionTitle}>
        <Text style={styles.sectionTitleText}>Response</Text>
        <View style={styles.metaItems}>
          <Text style={styles.durationText}>
            {duration < 1000
              ? `${duration}ms`
              : `${(duration / 1000).toFixed(2)}s`}
          </Text>
          <HttpStatusText status={httpStatus} />
        </View>
      </View>
      <TabView
        tabs={tabs}
        style={styles.tabView}
        renderContent={name => {
          switch (name) {
            case 'body': {
              if (!body) {
                return (
                  <Text style={styles.bodyNoneText}>
                    This response does not have a body
                  </Text>
                );
              }
              if (bodyFormat === 'text' || bodyFormat === 'json') {
                return <JsonViewer style={styles.tabContent} value={body} />;
              }
              if (bodyFormat === 'html') {
                return <Text>{String(body)}</Text>;
              }
              return <Text>Unsupported body format</Text>;
            }

            case 'headers': {
              return (
                <KeyValueViewer
                  style={styles.tabContent}
                  data={headers ?? {}}
                />
              );
            }
          }
        }}
      />
    </View>
  );
}
