import type { PropsWithViewStyle } from '@/definitions';
import { useState, type ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native-macos';
import { createStyles } from './TabView.styles';
import { Clickable } from '../clickables';
import { useThemeContext } from '@/states/theme';

export interface Tab<Name extends string = string> {
  readonly name: Name;
  readonly label: string;
}

export function TabView<Name extends string>({
  style,
  tabs,
  defaultTab,
  renderContent,
}: PropsWithViewStyle<{
  readonly tabs: readonly Tab<Name>[];
  readonly defaultTab?: Name;
  readonly renderContent: (name: Name) => ReactNode;
}>) {
  const [selectedTab, setSelectedTab] = useState<Name | undefined>(
    defaultTab ?? (tabs.length > 0 ? tabs[0].name : undefined),
  );
  const { theme } = useThemeContext();

  if (!selectedTab) {
    return <></>;
  }

  const { styles } = createStyles(theme);
  return (
    <View style={[style, styles.container]}>
      <View style={styles.tabBar}>
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
      <ScrollView style={styles.content}>
        {renderContent(selectedTab)}
      </ScrollView>
    </View>
  );
}
