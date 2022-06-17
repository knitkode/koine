/**
 * @category security
 * @see https://stackoverflow.com/a/22405578/9122820
 */
export function encode(str: string) {
  return str.replace(/./g, function (c) {
    return ("00" + c.charCodeAt(0)).slice(-3);
  });
}

export default encode;
