import type { RequestResource } from '@/definitions';
import { Text, View } from 'react-native';

export function RequestView({
  request: { name, url },
}: {
  request: RequestResource;
}) {
  return (
    <View>
      <Text>{name}</Text>
      <Text>{url}</Text>
    </View>
  );
}
