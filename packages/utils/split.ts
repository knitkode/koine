export type Split<S extends string, D extends string> = string extends S
  ? string[]
  : S extends ""
  ? []
  : S extends `${infer T}${D}${infer U}`
  ? [T, ...Split<U, D>]
  : [S];

/**
 * @category native
 * @category text
 */
export function split<T extends string, D extends string>(
  str: T,
  delimiter: D
) {
  return str.split(delimiter) as Split<T, D>;
}

export default split;
