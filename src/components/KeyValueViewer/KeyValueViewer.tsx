import type { PropsWithViewStyle } from '@/definitions';
import { View } from 'react-native-macos';
import { styles } from './KeyValueViewer.styles';
import { SelectableText } from '../text/SelectableText';

export function KeyValueViewer({
  style,
  data,
}: PropsWithViewStyle<{
  data: Record<string, string>;
}>) {
  return (
    <View style={style}>
      <View style={styles.container}>
        {Object.entries(data).map(([key, value]) => {
          return (
            <View key={key} style={styles.item}>
              <View style={[styles.itemCell, styles.itemKey]}>
                <SelectableText style={[styles.itemText, styles.itemKeyText]}>
                  {key}
                </SelectableText>
              </View>
              <View style={[styles.itemCell, styles.itemValue]}>
                <SelectableText style={[styles.itemText, styles.itemValueText]}>
                  {value}
                </SelectableText>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
