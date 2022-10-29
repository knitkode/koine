/**
 * Ensure an array contains all deisred values
 *
 * @category array
 * @borrows [SO comment by `CertainPerformance`](https://stackoverflow.com/a/60132060/1938970)
 *
 * @usage
 *
 * ```
 * import { arrayOfAll } from "@koine/utils";
 *
 * type Fruit = "pear" | "apple" | "orange";
 *
 * const arrayOfAllFruits = arrayOfAll<Fruit>();
 *
 * const allFruits = arrayOfAllFruits([
 *  "pear",
 *  "apple",
 *  "orange"
 * ]); // ts compiler ok
 *
 * const allFruits = arrayOfAllFruits([
 *  "pear",
 *  "apple",
 * ]); // ts compiler fails
 * ```
 *
 */
export const arrayOfAll =
  <T>() =>
  <U extends T[]>(array: U & ([T] extends [U[number]] ? unknown : "Invalid")) =>
    array;

export default arrayOfAll;
