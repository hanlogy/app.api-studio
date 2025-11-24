import { View } from 'react-native-macos';
import { createStyles } from './SideNav.styles';
import { useThemeContext } from '@/states/theme';
import type { NavName, PropsWithViewStyle } from '@/definitions';
import { Clickable } from '../clickables';
import { RequestIcon, ServerIcon, type NamedIconProps } from '../icons/icons';
import type { ComponentType } from 'react';

const items: {
  name: NavName;
  label: string;
  icon: ComponentType<NamedIconProps>;
}[] = [
  {
    name: 'requests',
    label: 'Requests',
    icon: RequestIcon,
  },
  {
    name: 'mockServers',
    label: 'Mock Servers',
    icon: ServerIcon,
  },
];

export function SideNav({
  style,
  onChanged,
  selected,
}: PropsWithViewStyle<{
  selected: string;
  onChanged: (nav: NavName) => void;
}>) {
  const { theme } = useThemeContext();
  const styles = createStyles(theme);

  return (
    <View style={[style, styles.container]}>
      <View style={styles.topGroup}>
        {items.map(({ name, icon: Icon }) => {
          const isSelected = name === selected;
          return (
            <Clickable
              key={name}
              style={styles.button}
              onPress={() => {
                onChanged(name);
              }}>
              {state => {
                return (
                  <Icon
                    size="medium"
                    color={
                      isSelected
                        ? '#CCC'
                        : state === 'hovered'
                        ? '#fff'
                        : '#999'
                    }
                  />
                );
              }}
            </Clickable>
          );
        })}
      </View>
    </View>
  );
}
