export function routeSpecificityScore(path: string): number {
  const normalized = path.replace(/^\/+/, '');
  if (!normalized) {
    return 0;
  }

  const segments = normalized.split('/');

  // literals > params > wildcards
  let score = 0;
  for (const segment of segments) {
    if (segment === '*') {
      score += 1;
    } else if (segment.startsWith(':')) {
      score += 3;
    } else if (segment.includes('*')) {
      score += 2;
    } else {
      score += 4;
    }
  }

  // more segments = more specific
  return score * 10 + segments.length;
}
