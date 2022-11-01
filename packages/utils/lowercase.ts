/**
 * Replacement for native `toLowercase` tyescript ready (type narrowing ready)
 *
 * @category native
 */
export const lowercase = <T extends string>(str?: null | T) =>
  (str || "").toLowerCase() as Lowercase<T>;

export default lowercase;
