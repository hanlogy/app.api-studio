export function toSafeId(input: string): string {
  return input
    .trim()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_]/g, c => {
      if (c.charCodeAt(0) < 128) {
        return '_';
      }
      const encoder = new TextEncoder();
      const bytes = encoder.encode(c);
      return (
        '_' +
        Array.from(bytes)
          .map(b => b.toString(16))
          .join('') +
        '_'
      );
    })
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .toLowerCase();
}
