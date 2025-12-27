export function getExtension(file: string): string | undefined {
  const index = file.lastIndexOf('.');
  return index > 0 && index < file.length - 1
    ? file.slice(index + 1).toLowerCase()
    : undefined;
}
