export function pickWhenString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

export function pickWhenNumber(value: unknown): number | undefined {
  return typeof value === 'number' ? value : undefined;
}

export function stringFromStringOrNumber(value: unknown) {
  const result = pickWhenString(value) ?? pickWhenNumber(value);
  if (result === undefined) {
    return result;
  }

  return String(result);
}

export function numberFromStringOrNumber(value: unknown) {
  const result = pickWhenNumber(value) ?? pickWhenString(value);
  if (result === undefined) {
    return result;
  }

  const parsed = Number(result);
  return Number.isNaN(parsed) ? undefined : parsed;
}

export function removeUndefined<T extends object>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined),
  ) as { [K in keyof T as T[K] extends undefined ? never : K]: T[K] };
}
