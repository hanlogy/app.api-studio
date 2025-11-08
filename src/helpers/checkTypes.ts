import type { JsonRecord, JsonValue, PrimitiveValue } from '@/definitions';

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

export function isJsonRecord(value?: unknown): value is JsonRecord {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  return Object.values(value).every(isJsonValue);
}

export function isJsonValue(value: unknown): value is JsonValue {
  if (isPrimitive(value)) {
    return true;
  }

  return Array.isArray(value)
    ? value.every(isJsonValue)
    : typeof value === 'object'
    ? isJsonRecord(value)
    : false;
}
