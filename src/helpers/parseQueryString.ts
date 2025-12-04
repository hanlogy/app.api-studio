import type { RequestQuery } from '@/definitions';

const decode = (value: string): string =>
  decodeURIComponent(value.replace(/\+/g, ' '));

// Do not use `URLSearchParams`
export const parseQueryString = (query?: string): RequestQuery => {
  const queryString = query?.startsWith('?') ? query.slice(1) : query;
  if (!queryString) {
    return {};
  }

  return queryString
    .split('&')
    .filter(Boolean)
    .reduce<RequestQuery>((acc, part) => {
      const [rawKey, rawValue = ''] = part.split('=');
      if (!rawKey) {
        return acc;
      }

      const key = decode(rawKey);
      const value = decode(rawValue);

      const existing = acc[key];
      if (existing === undefined) {
        acc[key] = value;
      } else if (Array.isArray(existing)) {
        existing.push(value);
      } else {
        acc[key] = [existing, value];
      }

      return acc;
    }, {});
};
