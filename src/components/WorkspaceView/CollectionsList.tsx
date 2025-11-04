import type { RequestResource, CollectionResource } from '@/definitions';
import { Text, View } from 'react-native';
import { Button } from '../Button';

export function CollectionsList({
  collections,
}: {
  collections: readonly CollectionResource[];
}) {
  return (
    <>
      {collections.map(collection => {
        return <CollectionItem key={collection.key} collection={collection} />;
      })}
    </>
  );
}

function CollectionItem({
  collection: { name = 'unnamed', requests },
}: {
  collection: CollectionResource;
}) {
  return (
    <View>
      <Button>
        <View>
          <Text> &gt; {name}</Text>
        </View>
      </Button>

      <View>
        {requests.map(request => {
          return <RequestItem key={request.key} request={request} />;
        })}
      </View>
    </View>
  );
}

function RequestItem({
  request: { name = 'unnamed' },
}: {
  request: RequestResource;
}) {
  return (
    <View>
      <Text>{name}</Text>
    </View>
  );
}
