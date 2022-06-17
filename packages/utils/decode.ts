/**
 * @category security
 * @see https://stackoverflow.com/a/22405578/9122820
 */
export function decode(str: string) {
  return str.replace(/.{3}/g, function (c) {
    return String.fromCharCode(parseInt(c, 10));
  });
}

export default decode;
