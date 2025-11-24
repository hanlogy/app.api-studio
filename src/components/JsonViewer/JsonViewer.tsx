import type { JsonValue, PropsWithViewStyle } from '@/definitions';
import { Text, View } from 'react-native-macos';
import { createStyles, type Styles } from './JsonViewer.styles';
import { SelectableText } from '../text/SelectableText';
import { isJsonValue } from '@/helpers/checkTypes';
import { useThemeContext } from '@/states/theme';

export function JsonViewer({
  value,
  style,
}: PropsWithViewStyle<{ value: unknown }>) {
  const { theme } = useThemeContext();
  const { styles } = createStyles(theme);

  if (!isJsonValue(value)) {
    return <></>;
  }
  return (
    <View style={[style, styles.contaienr]}>
      <View style={styles.lines}>
        <Text>1</Text>
      </View>
      <View style={styles.content}>
        <SelectableText style={styles.jsonText}>
          {renderJsonValue(styles, value)}
        </SelectableText>
      </View>
    </View>
  );
}

function renderJsonValue(
  styles: Styles['styles'],
  value: JsonValue,
  level = 0,
) {
  if (value === null) {
    return <Text style={styles.null}>null</Text>;
  }

  if (typeof value === 'string') {
    return <Text style={styles.string}>"{value}"</Text>;
  }

  if (typeof value === 'number') {
    return <Text style={styles.number}>{value}</Text>;
  }

  if (typeof value === 'boolean') {
    return <Text style={styles.boolean}>{value.toString()}</Text>;
  }

  if (Array.isArray(value)) {
    return <CollapsibleArray styles={styles} array={value} level={level} />;
  }

  return <CollapsibleObject styles={styles} object={value} level={level} />;
}

function CollapsibleArray({
  styles,
  array,
  level,
}: {
  styles: Styles['styles'];
  array: JsonValue[];
  level: number;
}) {
  return (
    <Text>
      <Text style={styles.bracket}>[{'\n'}</Text>
      {array.map((item, idx) => (
        <Text key={idx}>
          {'\t'.repeat(level + 1)}
          {renderJsonValue(styles, item, level + 1)}
          {idx < array.length - 1 ? ',' : ''}
          {'\n'}
        </Text>
      ))}
      <Text style={styles.bracket}>{'\t'.repeat(level)}]</Text>
    </Text>
  );
}

function CollapsibleObject({
  styles,
  object,
  level,
}: {
  styles: Styles['styles'];
  object: Record<string, JsonValue>;
  level: number;
}) {
  const entries = Object.entries(object);
  return (
    <Text>
      <Text style={styles.bracket}>{'{\n'}</Text>
      {entries.map(([key, val], idx) => (
        <Text key={key}>
          {'\t'.repeat(level + 1)}
          <Text style={styles.key}>"{key}": </Text>
          {renderJsonValue(styles, val, level + 1)}
          {idx < entries.length - 1 ? ',' : ''}
          {'\n'}
        </Text>
      ))}
      <Text style={styles.bracket}>
        {'\t'.repeat(level)}
        {'}'}
      </Text>
    </Text>
  );
}
