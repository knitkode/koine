/**
 * @see https://github.com/blakeembrey/change-case/blob/master/packages/title-case/src/index.ts
 * @author Blake Embrey (hello@blakeembrey.com)
 */
export const titleCase = (input?: null | string) =>
  input
    ? input.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
      )
    : "";

/**
 * Truncate string
 */
export const truncate = (
  input: undefined | null | string,
  length: number
): string =>
  input
    ? input.length > length
      ? input.substring(0, length) + "..."
      : input
    : "";
