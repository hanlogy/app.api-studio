export const isPrimitive = (
  value: unknown,
): value is string | number | boolean | null => {
  return (
    value === null || ['string', 'number', 'boolean'].includes(typeof value)
  );
};
