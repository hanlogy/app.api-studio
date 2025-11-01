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
