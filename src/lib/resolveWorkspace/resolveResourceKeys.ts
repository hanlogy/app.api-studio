import type { JsonValue, RequestResourceKey } from '@/definitions';
import { stringFromStringOrNumber } from '@/helpers/filterValues';
import { toSafeId } from '@/helpers/toSafeId';

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
      key: RequestResourceKey;
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
    resolvedId = resolvedName ? toSafeId(resolvedName) : undefined;
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
