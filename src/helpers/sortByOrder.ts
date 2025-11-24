export function sortByOrder<T extends { order: number }>(data: T[]): T[] {
  const MAX = Number.MAX_SAFE_INTEGER;

  // Attach original index to preserve order for MAX items, and remove index
  // wrapper later.
  return data
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      if (a.item.order === MAX && b.item.order === MAX) {
        // preserve original order
        return a.index - b.index;
      } else if (a.item.order === MAX) {
        return 1;
      } else if (b.item.order === MAX) {
        return -1;
      } else {
        return a.item.order - b.item.order;
      }
    })
    .map(({ item }) => item);
}
