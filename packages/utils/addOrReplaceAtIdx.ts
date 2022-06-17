/**
 * @category array
 */
export function addOrReplaceAtIdx<T>(
  list: T[],
  newItem: T,
  newIdx?: number
): T[] {
  if (list.length === 0) {
    return [newItem];
  }

  if (typeof newIdx === "undefined" || list.length - 1 < newIdx) {
    return [...list, newItem];
  }

  return list.map((item, idx) => {
    if (idx === newIdx) {
      return newItem;
    }
    return item;
  });
}

export default addOrReplaceAtIdx;
