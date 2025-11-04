import type {
  RequestResource,
  CollectionResource,
  WorkspaceResource,
} from '@/definitions';
import { Text, View } from 'react-native';
import { Button } from '../Button';

export function ApiList({ apis }: { apis: readonly WorkspaceResource[] }) {
  return (
    <>
      {apis.map(resource => {
        if ('apis' in resource) {
          return <CollectionItem key={resource.key} resource={resource} />;
        } else {
          return <ApiItem key={resource.key} resource={resource} />;
        }
      })}
    </>
  );
}

function CollectionItem({
  resource: { name = 'unnamed', apis },
}: {
  resource: CollectionResource;
}) {
  return (
    <View>
      <Button>
        <View>
          <Text> &gt; {name}</Text>
        </View>
      </Button>

      <View>
        {apis.map(api => {
          return <ApiItem key={api.key} resource={api} />;
        })}
      </View>
    </View>
  );
}

function ApiItem({
  resource: { name = 'unnamed' },
}: {
  resource: RequestResource;
}) {
  return (
    <View>
      <Text>{name}</Text>
    </View>
  );
}
