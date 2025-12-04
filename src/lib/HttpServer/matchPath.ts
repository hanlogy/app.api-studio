import { parsePath } from './simpleHelpers';

type MatchResult = {
  path: string;
  params: Record<string, string>;
};

export function matchPath({
  path = '',
  pattern = '',
}: {
  path?: string;
  pattern?: string;
} = {}): MatchResult | undefined {
  const { segments: patternSegments } = parsePath(pattern);
  const { path: normalizedPath, segments: pathSegments } = parsePath(path);
  const params: Record<string, string> = {};

  let patternPointer = 0;
  let pathPointer = 0;

  while (patternPointer < patternSegments.length) {
    const patternSegment = patternSegments[patternPointer];

    // trailing wildcard: /files/*
    if (patternSegment === '*') {
      if (patternPointer !== patternSegments.length - 1) {
        return undefined;
      }
      const rest = pathSegments.slice(pathPointer).join('/');
      params['*'] = decodeURIComponent(rest);
      pathPointer = pathSegments.length;
      patternPointer++;
      break;
    }

    if (pathPointer >= pathSegments.length) {
      return undefined;
    }

    const pathSegment = pathSegments[pathPointer];

    // path params
    if (patternSegment.startsWith(':')) {
      const name = patternSegment.slice(1);
      if (!name) {
        return undefined;
      }
      params[name] = decodeURIComponent(pathSegment);
      patternPointer++;
      pathPointer++;
      continue;
    }

    // literal match
    if (patternSegment !== pathSegment) {
      return undefined;
    }

    patternPointer++;
    pathPointer++;
  }

  const lastPatternIsWildcard =
    patternSegments[patternSegments.length - 1] === '*';

  if (!lastPatternIsWildcard && pathPointer !== pathSegments.length) {
    return undefined;
  }

  return {
    path: normalizedPath,
    params,
  };
}
