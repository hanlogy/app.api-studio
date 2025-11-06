import { useWorkspaceConext } from '@/states/workspace';
import { Text, View } from 'react-native';
import { styles } from './EnvironmentSelect.styles';
import { ChevronDown } from '../icons/icons';
import { Button } from '../Button';
import { useState } from 'react';

export function EnvironmentSelect() {
  const { selectedEnvironment, selectEnvironment, workspace } =
    useWorkspaceConext();
  const [dropdownShown, setDropdownShown] = useState(false);

  if (!workspace) {
    return <></>;
  }

  const { environments } = workspace;

  return (
    <View style={styles.container}>
      <Button
        onPress={() => {
          setDropdownShown(prev => !prev);
        }}
        style={styles.handle}
        hoveredStyle={styles.handleHovered}
        pressedStyle={styles.handlePressed}>
        <Text style={styles.selectedLabel}>
          {selectedEnvironment ?? 'No Environment'}
        </Text>
        <ChevronDown />
      </Button>
      {dropdownShown && (
        <View style={styles.dropdown}>
          {environments
            .filter(({ isGlobal }) => !isGlobal)
            .map(({ name }) => {
              return (
                <Button
                  onPress={() => {
                    setDropdownShown(false);
                    selectEnvironment?.(name);
                  }}
                  key={name}
                  style={styles.dropdownItem}
                  hoveredStyle={styles.dropdownItemHovered}
                  pressedStyle={styles.dropdownItemPressed}>
                  <Text>{name}</Text>
                </Button>
              );
            })}
        </View>
      )}
    </View>
  );
}
