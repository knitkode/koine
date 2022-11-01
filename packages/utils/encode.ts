/**
 * @category security
 * @see https://stackoverflow.com/a/22405578/9122820
 */
export function encode<TReturn extends string>(str: string) {
  return str.replace(/./g, function (c) {
    return ("00" + c.charCodeAt(0)).slice(-3);
  }) as TReturn;
}

export default encode;
