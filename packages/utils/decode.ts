/**
 * @category security
 * @see https://stackoverflow.com/a/22405578/9122820
 */
export function decode<TReturn extends string>(str: string) {
  return str.replace(/.{3}/g, function (c) {
    return String.fromCharCode(parseInt(c, 10));
  }) as TReturn;
}

export default decode;
