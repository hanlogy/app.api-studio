export type QueryValue = string | string[];
export type QueryObject = Record<string, QueryValue>;

const decode = (value: string): string =>
  decodeURIComponent(value.replace(/\+/g, ' '));

// Do not use `URLSearchParams`
export const parseQueryString = (query?: string): QueryObject => {
  const queryString = query?.startsWith('?') ? query.slice(1) : query;
  if (!queryString) {
    return {};
  }

  return queryString
    .split('&')
    .filter(Boolean)
    .reduce<QueryObject>((acc, part) => {
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
