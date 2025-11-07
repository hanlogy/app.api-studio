import { selectCurrentRequest, useWorkspaceContext } from '@/states/workspace';
import { Text, View } from 'react-native';
import { styles } from './RequestBuilder.styles';
import { Clickable } from '../clickables';
import { useState } from 'react';
import { mergeRequestHeaders } from '@/states/workspace/mergeRequestHeaders';

const tabNames = ['params', 'headers', 'body', 'variable'] as const;
type TabName = (typeof tabNames)[number];

const tabs = [
  // { label: 'Params', name: 'params' },
  { label: 'Body', name: 'body' },
  { label: 'Headers', name: 'headers' },
  // { label: 'Variable', name: 'variable' },
] as const;

export function RequestBuilder() {
  const { status, ...restvalue } = useWorkspaceContext();
  const request = selectCurrentRequest(restvalue);
  const [selectedTab, setSelectedTab] = useState<TabName>('body');
  if (status === 'waiting' || !request) {
    return <></>;
  }
  const { body, ...requestRest } = request;

  return (
    <>
      <View style={styles.tabs}>
        {tabs.map(({ label, name }) => {
          const isSelected = selectedTab === name;
          return (
            <Clickable
              key={name}
              onPress={() => {
                setSelectedTab(name);
              }}
              style={[
                styles.tabButton,
                isSelected ? styles.tabButtonSelected : undefined,
              ]}>
              <Text
                style={[
                  styles.tabButtonText,
                  isSelected ? styles.tabButtonTextSelected : undefined,
                ]}>
                {label}
              </Text>
            </Clickable>
          );
        })}
      </View>
      {selectedTab === 'body' && body && (
        <View style={styles.bodyContainer}>
          <Text style={styles.bodyText}>{JSON.stringify(body, null, 4)}</Text>
        </View>
      )}

      {selectedTab === 'headers' &&
        Object.entries(mergeRequestHeaders(requestRest)).map(([key, value]) => {
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
        })}
    </>
  );
}
