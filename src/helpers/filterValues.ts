export function pickWhenString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

export function removeUndefined<T extends object>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined),
  ) as {[K in keyof T as T[K] extends undefined ? never : K]: T[K]};
}
