const API_ID_PREFIX = 'API_ID_';
const COLLECTION_ID_PREFIX = 'COLLECTION_ID_';

const TEMPORARY_API_ID_PREFIX = `TEMPORARY_${API_ID_PREFIX}`;
const TEMPORARY_COLLECTION_ID_PREFIX = `TEMPORARY_${COLLECTION_ID_PREFIX}`;

let count = 0;
export function generateKey(type: 'api' | 'collection', id?: string | number) {
  const prefix =
    type === 'api'
      ? id
        ? API_ID_PREFIX
        : TEMPORARY_API_ID_PREFIX
      : id
      ? COLLECTION_ID_PREFIX
      : TEMPORARY_COLLECTION_ID_PREFIX;

  return `${prefix}${id || count++}`;
}
