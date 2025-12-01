import type { MockServerCase } from '@/definitions';
import type { ParsedRequest } from './requestChunkParser';
import { compilePattern, matchValue } from '../matcher';

export function matchRequestCase({
  request,
  requestPattern,
}: {
  request: ParsedRequest & { parthParams?: Record<string, string> };
  requestPattern?: MockServerCase['request'];
}) {
  if (!requestPattern) {
    return true;
  }

  for (const [section, rawPattern] of Object.entries(requestPattern)) {
    if (
      section === 'body' ||
      section === 'headers' ||
      section === 'query' ||
      section === 'parthParams'
    ) {
      if (!matchValue(request[section], compilePattern(rawPattern))) {
        return false;
      }
    }

    if (section === 'method' || section === 'path') {
      if (
        request[section]?.toLowerCase() !== String(rawPattern).toLowerCase()
      ) {
        return false;
      }
    }
  }

  return true;
}
