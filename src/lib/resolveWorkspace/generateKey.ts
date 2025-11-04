const REQUEST_ID_PREFIX = 'REQUEST_ID_';
const COLLECTION_ID_PREFIX = 'COLLECTION_ID_';

const TEMPORARY_REQUEST_ID_PREFIX = `TEMPORARY_${REQUEST_ID_PREFIX}`;
const TEMPORARY_COLLECTION_ID_PREFIX = `TEMPORARY_${COLLECTION_ID_PREFIX}`;

let count = 0;
export function generateKey(
  type: 'request' | 'collection',
  id?: string | number,
) {
  const prefix =
    type === 'request'
      ? id
        ? REQUEST_ID_PREFIX
        : TEMPORARY_REQUEST_ID_PREFIX
      : id
      ? COLLECTION_ID_PREFIX
      : TEMPORARY_COLLECTION_ID_PREFIX;

  return `${prefix}${id || count++}`;
}
