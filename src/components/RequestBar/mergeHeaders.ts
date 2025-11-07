import type {
  CollectionResource,
  RequestHeaders,
  WorkspaceEnvironment,
} from '@/definitions';

export function mergeHeaders({
  environments = [],
  collection = {},
  headers: localHeaders = {},
}: {
  environments?: Pick<WorkspaceEnvironment, 'headers' | 'isGlobal'>[];
  collection?: Pick<CollectionResource, 'headers'>;
  headers?: RequestHeaders;
}) {
  const mergedEnvHeaders = [...environments]
    .sort(({ isGlobal }) => (isGlobal ? -1 : 1))
    .map(e => e.headers || {})
    .reduce((acc, cur) => ({ ...acc, ...cur }), {});

  return {
    ...mergedEnvHeaders,
    ...(collection.headers ?? {}),
    ...localHeaders,
  };
}
