import type {PrimitiveValue} from '@/definitions';

export function isPrimitive(value: unknown): value is PrimitiveValue {
  return (
    value === null || ['string', 'number', 'boolean'].includes(typeof value)
  );
}

export function isPlainObject(
  value: unknown,
): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/*
export function isJsonRecord(value: unknown): value is JsonRecord {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  return Object.values(value).every(v =>
    v === null ||
    typeof v === 'string' ||
    typeof v === 'number' ||
    typeof v === 'boolean' ||
    Array.isArray(v)
      ? v.every(isJsonValue)
      : typeof v === 'object'
      ? isJsonRecord(v)
      : false,
  );
}

export function isJsonValue(value: unknown): value is JsonValue {
  return (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    (Array.isArray(value) && value.every(isJsonValue)) ||
    (typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value) &&
      isJsonRecord(value))
  );
}
*/
