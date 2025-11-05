import type { JsonValue } from '@/definitions';
import { stringFromStringOrNumber } from '@/helpers/filterValues';

interface Args {
  accumulateIds: string[];
  id?: JsonValue;
  name?: JsonValue;
}

export function resolveResourceKeys(
  type: 'collection',
  args: Args,
):
  | {
      id: string;
      name: string;
      key: string;
    }
  | undefined;

export function resolveResourceKeys(
  type: 'request',
  args: {
    collectionKey: string;
  } & Args,
):
  | {
      id: string;
      name: string;
      key: [string, string];
    }
  | undefined;

export function resolveResourceKeys(
  type: 'request' | 'collection',
  {
    accumulateIds,
    collectionKey,
    id,
    name,
  }: {
    collectionKey?: string;
  } & Args,
) {
  let resolvedId = stringFromStringOrNumber(id);
  const resolvedName = stringFromStringOrNumber(name);

  if (!resolvedId) {
    resolvedId = resolvedName
      ? resolvedName
          .trim()
          .replaceAll(/\s+/g, '_')
          .replaceAll(/-+/g, '_')
          .toLocaleLowerCase()
      : undefined;
  }

  if (!resolvedId) {
    return undefined;
  }

  const existingTotal = accumulateIds.filter(e => e === resolvedId).length;
  if (existingTotal > 0) {
    accumulateIds.push(resolvedId);
    resolvedId = `${resolvedId}_${existingTotal}`;
  }

  const resultCommon = { name: resolvedName, id: resolvedId };

  if (type === 'collection') {
    return { ...resultCommon, key: resolvedId };
  }

  return { ...resultCommon, key: [resolvedId, collectionKey] };
}
