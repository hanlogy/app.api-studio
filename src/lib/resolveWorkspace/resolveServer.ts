import type { JsonValue, MockServer } from '@/definitions';
import { isPlainObject } from '@/helpers/checkTypes';
import { resolveOrder, resolveStringRecord } from './simpleResolvers';
import {
  numberFromStringOrNumber,
  removeUndefined,
  stringFromStringOrNumber,
} from '@/helpers/filterValues';
import { sortByOrder } from '@/helpers/sortByOrder';
import { resolveRouteSource } from './resolveRoute';

export function resolveServerSource({
  source,
}: {
  readonly source: JsonValue;
}): MockServer | undefined {
  if (!isPlainObject(source)) {
    return undefined;
  }

  const { name, order, port, https, headers, routes } = source;

  const resolvedName = stringFromStringOrNumber(name);
  if (!resolvedName) {
    return undefined;
  }
  const resolvedPort = numberFromStringOrNumber(port);

  if (!resolvedPort) {
    return undefined;
  }

  let resolvedHttps:
    | {
        readonly p12File: string;
        readonly p12Password?: string;
      }
    | undefined;

  if (https && isPlainObject(https)) {
    const p12File = 'p12File' in https ? String(https.p12File) : undefined;
    if (p12File) {
      resolvedHttps = {
        p12File: p12File,
        p12Password: String(https.p12Password),
      };
    }
  }

  return removeUndefined({
    name: resolvedName,
    order: resolveOrder(order),
    port: resolvedPort,
    https: resolvedHttps,
    headers: resolveStringRecord({ source: headers }),
    routes: Array.isArray(routes)
      ? sortByOrder(
          routes
            .map(item => resolveRouteSource({ source: item }))
            .filter(e => e !== undefined),
        )
      : [],
  });
}
