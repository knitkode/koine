/**
 * Capitalize first letter of the given string.
 *
 * @category text
 * @resources
 * - https://stackoverflow.com/a/11409944/1938970
 */
export function capitalize<T extends string>(string?: null | T) {
  const ensuredString = string || "";
  return (ensuredString.charAt(0).toUpperCase() +
    ensuredString.slice(1)) as Capitalize<T>;
}

export default capitalize;
