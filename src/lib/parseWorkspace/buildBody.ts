import {isPlainObject} from '@/helpers/isPlainObject';
import {resolveStringSource} from './resolveStringSource';
import type {RequestBody, Variables} from '@/definitions/types';

export const buildBody = (
  rawBody: RequestBody,
  variables: Variables = {},
): RequestBody => {
  if (!rawBody) {
    return rawBody;
  }

  if (Array.isArray(rawBody)) {
    return rawBody.map(item => buildBody(item, variables));
  }

  if (isPlainObject(rawBody)) {
    const result: {[key: string]: RequestBody} = {};
    for (const [key, value] of Object.entries(rawBody)) {
      result[key] = buildBody(value, variables);
    }

    return result;
  }

  if (typeof rawBody === 'string') {
    return resolveStringSource(rawBody, variables);
  }

  return rawBody;
};
