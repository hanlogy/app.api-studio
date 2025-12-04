import type { RequestQuery } from '@/definitions';

const encode = (value: string): string =>
  encodeURIComponent(value).replace(/%20/g, '+');

export function buildQueryString(params: RequestQuery): string {
  const parts: string[] = [];

  const push = (key: string, value: string) => {
    parts.push(`${encode(key)}=${encode(value)}`);
  };

  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      for (const e of value) {
        push(key, e);
      }
    } else {
      push(key, value);
    }
  }

  return parts.length ? parts.join('&') : '';
}
