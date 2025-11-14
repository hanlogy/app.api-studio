import { useWorkspaceContext } from '@/states/workspace';
import { Text, View } from 'react-native';
import { createStyles } from './EnvironmentSelect.styles';
import { ChevronDown, ChevronUp } from '../icons/icons';
import { Clickable } from '../clickables';
import { useState } from 'react';
import { useThemeContext } from '@/states/theme';

export function EnvironmentSelect() {
  const { selectedEnvironment, selectEnvironment, workspace } =
    useWorkspaceContext();
  const [dropdownShown, setDropdownShown] = useState(false);
  const { theme } = useThemeContext();

  if (!workspace) {
    return <></>;
  }

  const { environments } = workspace;
  const { styles } = createStyles(theme);

  return (
    <View style={styles.container}>
      <Clickable
        onPress={() => {
          setDropdownShown(prev => !prev);
        }}
        style={styles.handle}
        hoveredStyle={styles.handleHovered}
        pressedStyle={styles.handlePressed}>
        <Text style={styles.selectedLabel}>
          {selectedEnvironment ?? 'No Environment'}
        </Text>
        {dropdownShown ? <ChevronUp /> : <ChevronDown />}
      </Clickable>
      {dropdownShown && (
        <View style={styles.dropdown}>
          {[{ isGlobal: false, name: undefined }, ...environments]
            .filter(({ isGlobal }) => !isGlobal)
            .map(({ name }) => {
              return (
                <Clickable
                  onPress={() => {
                    setDropdownShown(false);
                    selectEnvironment?.(name);
                  }}
                  key={name ?? Date.now()}
                  style={styles.dropdownItem}
                  hoveredStyle={styles.dropdownItemHovered}
                  pressedStyle={styles.dropdownItemPressed}>
                  <Text>{name ?? '-'}</Text>
                </Clickable>
              );
            })}
        </View>
      )}
    </View>
  );
}
