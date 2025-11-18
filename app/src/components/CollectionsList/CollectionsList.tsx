import type { RequestResource, CollectionResource } from '@/definitions';
import { Text, View } from 'react-native';
import { Clickable } from '../clickables';
import { ChevronDownIcon, ChevronRightIcon } from '../icons/icons';
import { createStyles } from './CollectionsList.styles';
import { useState } from 'react';
import { useWorkspaceContext } from '@/states/workspace';
import { useThemeContext } from '@/states/theme';
import { MethodText } from '../text';

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
  const { theme } = useThemeContext();

  const { collectionItemStyles } = createStyles(theme);

  return (
    <View>
      <Clickable
        onPress={() => setIsExpanded(prev => !prev)}
        style={collectionItemStyles.button}
        hoveredStyle={collectionItemStyles.buttonHovered}
        pressedStyle={collectionItemStyles.buttonPressed}>
        {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}

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
  const { openResource } = useWorkspaceContext();
  const { name = 'unnamed' } = request;
  const { theme } = useThemeContext();

  const { requestItemStyles } = createStyles(theme);

  return (
    <Clickable
      onPress={() => openResource?.(request.key)}
      style={requestItemStyles.button}
      hoveredStyle={requestItemStyles.buttonHovered}
      pressedStyle={requestItemStyles.buttonPressed}>
      <View style={requestItemStyles.method}>
        <MethodText
          isCompact
          style={requestItemStyles.methodText}
          method={request.method ?? 'GET'}
        />
      </View>
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={requestItemStyles.text}>
        {name}
      </Text>
    </Clickable>
  );
}
