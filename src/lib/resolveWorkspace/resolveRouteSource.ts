import type { JsonValue, MockServerCase, MockServerRoute } from '@/definitions';
import { isPlainObject } from '@/helpers/checkTypes';
import {
  numberFromStringOrNumber,
  removeUndefined,
  stringFromStringOrNumber,
} from '@/helpers/filterValues';
import { resolveOrder, resolveMethod } from './simpleResolvers';

export function resolveRouteSource({
  source,
}: {
  source: JsonValue;
}): MockServerRoute | undefined {
  if (!isPlainObject(source)) {
    return undefined;
  }

  const { name, order, method, path, delay, cases } = source;
  const resolvedName = stringFromStringOrNumber(name);
  if (!resolvedName) {
    return undefined;
  }
  const resolvedMethod = resolveMethod({ source: method, addtion: ['ALL'] });
  if (!resolvedMethod) {
    console.log(method);
    return undefined;
  }
  const resolvedPath = stringFromStringOrNumber(path);

  return removeUndefined({
    name: resolvedName,
    order: resolveOrder(order),
    method: resolvedMethod,
    path: resolvedPath ?? '',
    delay: numberFromStringOrNumber(delay),
    cases: Array.isArray(cases)
      ? cases.map(e => resolveCase({ source: e })).filter(e => e !== undefined)
      : [],
  });
}

function resolveCase({
  source,
}: {
  source: JsonValue;
}): MockServerCase | undefined {
  if (!isPlainObject(source)) {
    return undefined;
  }

  const { request, response, delay, forward } = source;

  const resolvedRequest = isPlainObject(request) ? request : undefined;

  const common = removeUndefined({
    delay: numberFromStringOrNumber(delay),
    request: resolvedRequest,
  });

  if (typeof forward === 'string') {
    return {
      ...common,
      forward,
    };
  }

  if (typeof response === 'string') {
    return {
      ...common,
      response,
    };
  }

  return removeUndefined({
    ...common,
    response: isPlainObject(response) ? response : undefined,
  });
}
