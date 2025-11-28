import type { MockServerRoute } from '@/definitions';
import { matchPath } from './matchPath';
import { routeSpecificityScore } from './routeSpecificityScore';

export function matchRoute(
  routes: readonly Pick<MockServerRoute, 'method' | 'path'>[],
  {
    method: requestMethod,
    path: requestPath,
  }: { readonly method: string; readonly path: string },
) {
  const matches = routes
    .map(route => {
      if (
        route.method !== 'ALL' &&
        route.method !== requestMethod.toUpperCase()
      ) {
        return undefined;
      }

      const match = matchPath({ pattern: route.path, path: requestPath });
      if (!match) {
        return undefined;
      }

      return { route, params: match.params };
    })
    .filter(e => e !== undefined);

  if (!matches.length) {
    return undefined;
  }

  return matches
    .slice()
    .sort(
      (A, B) =>
        routeSpecificityScore(B.route.path) -
        routeSpecificityScore(A.route.path),
    )[0];
}
