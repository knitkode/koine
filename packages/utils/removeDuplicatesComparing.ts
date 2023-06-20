import { findDuplicatedIndexes } from "./findDuplicatedIndexes";
import { removeIndexesFromArray } from "./removeIndexesFromArray";

/**
 * @category array
 */
export function removeDuplicatesComparing<T>(from: any[], to: T[]) {
  const indexes = findDuplicatedIndexes(from);
  return removeIndexesFromArray<T>(to, indexes);
}

export default removeDuplicatesComparing;
