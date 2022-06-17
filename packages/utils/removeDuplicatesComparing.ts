import { removeIndexesFromArray } from "./removeIndexesFromArray";
import { findDuplicatedIndexes } from "./findDuplicatedIndexes";

/**
 * @category array
 */
export function removeDuplicatesComparing<T>(from: any[], to: T[]) {
  const indexes = findDuplicatedIndexes(from);
  return removeIndexesFromArray<T>(to, indexes);
}

export default removeDuplicatesComparing;
