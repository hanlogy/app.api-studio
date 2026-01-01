import type { AppError } from '@/definitions';
import { isPlainObject } from '@/helpers/checkTypes';

function getPath({ meta }: AppError) {
  if (!isPlainObject(meta)) {
    return;
  }
  const { path } = meta;
  return typeof path === 'string' ? path : undefined;
}

export function isSameError(errorA: AppError | null, errorB: AppError | null) {
  if (!errorA || !errorB) {
    return errorA === errorB;
  }
  return errorA.sameAs(errorB) && getPath(errorA) === getPath(errorB);
}
