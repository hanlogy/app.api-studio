import { View } from 'react-native-macos';
import { createStyles } from './SideNav.styles';
import { useThemeContext } from '@/states/theme';
import type { PropsWithViewStyle } from '@/definitions';
import { Clickable } from '../clickables';
import { HttpServerIcon, ProxyServerIcon, RequestIcon } from '../icons/icons';

export function SideNav({
  style,
  onChanged,
  selected,
}: PropsWithViewStyle<{ selected: string; onChanged: (nav: string) => void }>) {
  const { theme } = useThemeContext();
  const styles = createStyles(theme);

  const items = [
    {
      name: 'request',
      icon: RequestIcon,
    },
    {
      name: 'httpServer',
      icon: HttpServerIcon,
    },
    {
      name: 'proxyServer',
      icon: ProxyServerIcon,
    },
  ];

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
              <Icon size="medium" color={isSelected ? '#CCC' : '#999'} />
            </Clickable>
          );
        })}
      </View>
    </View>
  );
}
