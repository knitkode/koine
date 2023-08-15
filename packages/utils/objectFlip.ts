/**
 * @category object
 * @borrows [jacobparis.com](https://www.jacobparis.com/content/reversing-a-record-in-typescript#typescript)
 */
export function objectFlip<T extends PropertyKey, U extends PropertyKey>(
  input: Record<T, U>,
  keyTransformer?: (key: string) => T,
) {
  return Object.fromEntries(
    Object.entries(input).map(([key, value]) => [
      value,
      keyTransformer ? keyTransformer(key) : key,
    ]),
  ) as Record<U, T>;
}

export default objectFlip;
