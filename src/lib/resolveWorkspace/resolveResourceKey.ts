let count = 0;

export function resolveResourceKey(
  type: 'collection',
  args?: { id?: string; name?: string },
): string;

export function resolveResourceKey(
  type: 'request',
  args: {
    collectionKey: string;
    id?: string;
    name?: string;
  },
): [string, string];

export function resolveResourceKey(
  type: 'request' | 'collection',
  {
    collectionKey,
    id,
    name,
  }: {
    collectionKey?: string;
    id?: string;
    name?: string;
  } = {},
) {
  name = name
    ? name.trim().replaceAll(/\s+/g, '_').toLocaleLowerCase()
    : undefined;

  const key = id ?? name ?? String(count++);

  if (type === 'collection') {
    return key;
  }

  return [key, collectionKey];
}
