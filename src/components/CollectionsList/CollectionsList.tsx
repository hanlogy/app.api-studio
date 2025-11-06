import type { RequestResource, CollectionResource } from '@/definitions';
import { Text, View } from 'react-native';
import { Clickable } from '../clickables';
import { ChevronDown, ChevronRight } from '../icons/icons';
import {
  collectionItemStyles,
  requestItemStyles,
} from './CollectionsList.styles';
import { useState } from 'react';
import { useWorkspaceConext } from '@/states/workspace';

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
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View>
      <Clickable
        onPress={() => setIsExpanded(prev => !prev)}
        style={collectionItemStyles.button}
        hoveredStyle={collectionItemStyles.buttonHovered}
        pressedStyle={collectionItemStyles.buttonPressed}>
        {isExpanded ? <ChevronDown /> : <ChevronRight />}

        <Text>{name}</Text>
      </Clickable>

      {isExpanded && (
        <View style={collectionItemStyles.requestsList}>
          {requests.map(request => {
            return (
              <RequestItem key={request.key.join('-')} request={request} />
            );
          })}
        </View>
      )}
    </View>
  );
}

function RequestItem({ request }: { request: RequestResource }) {
  const { openRequest } = useWorkspaceConext();
  const { name = 'unnamed' } = request;

  return (
    <Clickable
      onPress={() => openRequest?.(request.key)}
      style={requestItemStyles.button}
      hoveredStyle={requestItemStyles.buttonHovered}
      pressedStyle={requestItemStyles.buttonPressed}>
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={requestItemStyles.text}>
        {name}
      </Text>
    </Clickable>
  );
}
