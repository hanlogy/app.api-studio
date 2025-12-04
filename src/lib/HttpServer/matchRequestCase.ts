import type { MockServerCase } from '@/definitions';
import { compilePattern, matchValue } from '../matcher';
import type { ServerRequest } from './definitions';

export function matchRequestCase({
  request,
  requestPattern,
}: {
  request: ServerRequest;
  requestPattern?: MockServerCase['request'];
}): boolean {
  if (!requestPattern) {
    return true;
  }

  for (const [section, rawPattern] of Object.entries(requestPattern)) {
    if (
      section === 'body' ||
      section === 'headers' ||
      section === 'query' ||
      section === 'pathParams'
    ) {
      if (!matchValue(request[section], compilePattern(rawPattern))) {
        return false;
      }
    } else if (section === 'method' || section === 'path') {
      if (request[section] !== rawPattern) {
        return false;
      }
    }
  }

  return true;
}
