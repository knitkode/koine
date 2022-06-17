import { isUndefined } from "./isUndefined";

declare let __webpack_nonce__: string;

/**
 * @category security
 * @see https://github.com/styled-components/styled-components/blob/main/packages/styled-components/src/utils/nonce.ts
 */
export function getNonce() {
  return isUndefined(__webpack_nonce__) ? null : __webpack_nonce__;
}

export default getNonce;
