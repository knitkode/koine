/**
 * Replacement for native `toUpperCase` tyescript ready (type narrowing ready)
 *
 * @category native
 * @category text
 */
export const uppercase = <T extends string>(str?: null | T) =>
  (str || "").toUpperCase() as Uppercase<T>;

export default uppercase;
