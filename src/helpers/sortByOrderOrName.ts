export function sortByOrderOrName<T extends { order: number; name?: string }>(
  data: T[],
): T[] {
  const MAX = Number.MAX_SAFE_INTEGER;

  return data.sort((a, b) => {
    if (a.order === MAX && b.order === MAX) {
      return (a.name ?? '').localeCompare(b.name ?? '');
    } else if (a.order === MAX) {
      return 1;
    } else if (b.order === MAX) {
      return -1;
    } else {
      return a.order - b.order;
    }
  });
}
