/**
 * Capitalize first letter of the given string.
 *
 * @category text
 * @see https://stackoverflow.com/a/11409944/1938970
 */
export function capitalize<T extends string>(text?: null | T) {
  return text
    ? ((text.charAt(0).toUpperCase() + text.slice(1)) as Capitalize<T>)
    : "";
}

export default capitalize;
