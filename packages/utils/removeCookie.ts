import { type CookieAttributesClient, defaultAttributesClient } from "./cookie";
import { setCookie } from "./setCookie";

/**
 * @category cookie
 *
 * All cookie related code is inspired and adapted from:
 * - [js-cookie](https://github.com/js-cookie/js-cookie)
 * - [cookie](https://github.com/jshttp/cookie)
 */
export function removeCookie(
  name: string,
  attributes: CookieAttributesClient = {}
) {
  setCookie(name, "", {
    ...defaultAttributesClient,
    ...attributes,
    expires: -1,
  });
}

export default removeCookie;
