export function normalizePath(input: string) {
  const trimmed = input.replace(/\/+/g, '/').replace(/^\/+|\/+$/g, '');
  return {
    path: trimmed,
    segments: trimmed.split('/'),
  };
}
