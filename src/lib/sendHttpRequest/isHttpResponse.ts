import { isPlainObject } from '@/helpers/checkTypes';
import type { HttpResponse } from './types';

export function isHttpResponse(value: unknown): value is HttpResponse {
  if (!isPlainObject(value)) {
    return false;
  }

  const { headers, status, requestTime, responseTime } = value;

  if (
    status === undefined ||
    status === null ||
    !requestTime ||
    !responseTime ||
    typeof requestTime !== 'number' ||
    typeof responseTime !== 'number'
  ) {
    return false;
  }

  if (headers) {
    if (!isPlainObject(headers)) {
      return false;
    }
    for (const [headerKey, headerValue] of Object.entries(headers)) {
      if (typeof headerKey !== 'string' || typeof headerValue !== 'string') {
        return false;
      }
    }
  }

  return true;
}
