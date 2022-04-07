import { isUndefined } from "./is";

declare let __webpack_nonce__: string;

/**
 * @see https://github.com/styled-components/styled-components/blob/main/packages/styled-components/src/utils/nonce.ts
 */
export function getNonce() {
  return isUndefined(__webpack_nonce__) ? null : __webpack_nonce__;
}

/**
 * @see https://stackoverflow.com/a/22405578/9122820
 */
export function encode(str: string) {
  return str.replace(/./g, function (c) {
    return ("00" + c.charCodeAt(0)).slice(-3);
  });
}

/**
 * @see https://stackoverflow.com/a/22405578/9122820
 */
export function decode(str: string) {
  return str.replace(/.{3}/g, function (c) {
    return String.fromCharCode(parseInt(c, 10));
  });
}
