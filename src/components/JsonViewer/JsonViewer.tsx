import type { JsonValue } from '@/definitions';
import { Text, View } from 'react-native-macos';
import { styles } from './JsonViewer.styles';
import { SelectableText } from '../text/SelectableText';

export function JsonViewer({ value }: { value: JsonValue }) {
  return (
    <View style={styles.contaienr}>
      <View style={styles.lines}>
        <Text>1</Text>
      </View>
      <View style={styles.content}>
        <SelectableText style={styles.jsonText}>
          {renderJsonValue(value)}
        </SelectableText>
      </View>
    </View>
  );
}

function renderJsonValue(value: JsonValue, level = 0) {
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
    return <CollapsibleArray array={value} level={level} />;
  }

  return <CollapsibleObject object={value} level={level} />;
}

function CollapsibleArray({
  array,
  level,
}: {
  array: JsonValue[];
  level: number;
}) {
  return (
    <Text>
      <Text style={styles.bracket}>[{'\n'}</Text>
      {array.map((item, idx) => (
        <Text key={idx}>
          {'\t'.repeat(level + 1)}
          {renderJsonValue(item, level + 1)}
          {idx < array.length - 1 ? ',' : ''}
          {'\n'}
        </Text>
      ))}
      <Text style={styles.bracket}>{'\t'.repeat(level)}]</Text>
    </Text>
  );
}

function CollapsibleObject({
  object,
  level,
}: {
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
          {renderJsonValue(val, level + 1)}
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
