/**
 * @file
 *
 * Inspired and adapted from
 *
 * - [js-cookie](https://github.com/js-cookie/js-cookie)
 * @see https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/js-cookie/index.d.ts
 * - [cookie](https://github.com/jshttp/cookie)
 *
 */

import { isNumber } from "./is";

/**
 * RegExp to match field-content in RFC 7230 sec 3.2
 *
 * field-content = field-vchar [ 1*( SP / HTAB ) field-vchar ]
 * field-vchar   = VCHAR / obs-text
 * obs-text      = %x80-FF
 */
// eslint-disable-next-line no-control-regex
const fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;

/**
 * Parse a cookie header.
 *
 * Parse the given cookie header string into an object
 * The object has the various cookies as keys(names) => values
 */
export function parseCookie<
  T extends Record<string, unknown> = Record<string, string>
>(str: string, attributes: CookieAttributesServer = {}) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }

  const obj = {} as T;
  const pairs = str.split(";");
  const { decode = decodeURIComponent } = attributes;

  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    const index = pair.indexOf("=");

    // skip things that don't look like key=value
    if (index < 0) {
      continue;
    }

    const key = pair.substring(0, index).trim() as keyof T;

    // only assign once
    if (undefined == obj[key]) {
      let val = pair.substring(index + 1, pair.length).trim();

      // quoted values
      if (val[0] === '"') {
        val = val.slice(1, -1);
      }

      obj[key] = tryDecode(val, decode) as T[keyof T];
    }
  }

  return obj;
}

/**
 * Serialize data into a cookie header.
 *
 * Serialize the a name value pair into a cookie string suitable for
 * http headers. An optional attributes object specified cookie parameters.
 *
 * serialize('foo', 'bar', { httpOnly: true })
 *   => "foo=bar; httpOnly"
 */
export function serializeCookie(
  name: string,
  val: string,
  attributes: CookieAttributesServer = {}
) {
  const {
    encode = encodeURIComponent,
    domain,
    path,
    httpOnly,
    secure,
    sameSite,
  } = attributes;
  let { maxAge, expires } = attributes;

  const value = encode(val);

  if (process.env["NODE_ENV"] !== "production") {
    if (!fieldContentRegExp.test(name)) {
      throw new TypeError("argument name is invalid");
    }
    if (typeof attributes.encode !== "function") {
      throw new TypeError("option encode is invalid");
    }
    if (value && !fieldContentRegExp.test(value)) {
      throw new TypeError("argument val is invalid");
    }
  }

  let str = name + "=" + value;

  if (null != maxAge) {
    maxAge = maxAge - 0;

    if (isNaN(maxAge) || !isFinite(maxAge)) {
      throw new TypeError("option maxAge is invalid");
    }

    str += "; Max-Age=" + Math.floor(maxAge);
  }

  if (domain) {
    if (process.env["NODE_ENV"] !== "production") {
      if (!fieldContentRegExp.test(domain)) {
        throw new TypeError("option domain is invalid");
      }
    }

    str += "; Domain=" + domain;
  }

  if (path) {
    if (process.env["NODE_ENV"] !== "production") {
      if (!fieldContentRegExp.test(path)) {
        throw new TypeError("option path is invalid");
      }
    }

    str += "; Path=" + path;
  }

  if (expires) {
    if (isNumber(expires)) {
      expires = new Date(Date.now() + expires * 864e5);
    }

    str += "; Expires=" + expires.toUTCString();
  }

  if (httpOnly) {
    str += "; HttpOnly";
  }

  if (secure) {
    str += "; Secure";
  }

  if (sameSite) {
    switch (sameSite.toLowerCase()) {
      case "lax":
        str += "; SameSite=Lax";
        break;
      case "strict":
        str += "; SameSite=Strict";
        break;
      case "none":
        str += "; SameSite=None";
        break;
      //  default:
      //    throw new TypeError('option sameSite is invalid');
    }
  }

  return str;
}

/**
 * Try decoding a string using a decoding function.
 */
function tryDecode(str: string, decode: (input: string) => string) {
  try {
    return decode(str);
  } catch (e) {
    return str;
  }
}

function converterRead(value: string) {
  if (value[0] === '"') {
    value = value.slice(1, -1);
  }
  return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
}

function converterWrite(value: string) {
  return encodeURIComponent(value).replace(
    /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
    decodeURIComponent
  );
}

type CookieAttributes = {
  /**
   * Define when the cookie will be removed. Value can be a Number
   * which will be interpreted as days from time of creation or a
   * Date instance. If omitted, the cookie becomes a session cookie.
   */
  expires?: number | Date | undefined;

  /**
   * Define the path where the cookie is available. Defaults to '/'
   *
   * @default "/"
   */
  path?: string | undefined;

  /**
   * Define the domain where the cookie is available. Defaults to
   * the domain of the page where the cookie was created.
   */
  domain?: string | undefined;

  /**
   * A Boolean indicating if the cookie transmission requires a
   * secure protocol (https).
   *
   * @default "true"
   */
  secure?: boolean | undefined;

  /**
   * Asserts that a cookie must not be sent with cross-origin requests,
   * providing some protection against cross-site request forgery
   * attacks (CSRF)
   *
   * @default "strict"
   */
  sameSite?: "strict" | "Strict" | "lax" | "Lax" | "none" | "None" | undefined;

  /**
   * An attribute which will be serialized, conformably to RFC 6265
   * section 5.2.
   */
  // [property: string]: any;
};

type CookieAttributesServer = CookieAttributes & {
  maxAge?: number;
  httpOnly?: boolean;
  encode?: (input: string) => string;
  decode?: (input: string) => string;
};
type CookieAttributesClient = CookieAttributes;

export function readCookie<
  T extends Record<string, unknown> = Record<string, string>
>(name?: null): T;
export function readCookie<
  T extends Record<string, unknown> = Record<string, string>,
  N extends keyof T = keyof T
>(name: N): T[N];
export function readCookie<
  T extends Record<string, unknown> = Record<string, string>,
  N extends string = string
>(name?: N | null): T[N] | T {
  if (typeof document === "undefined") {
    if (process.env["NODE_ENV"] !== "production") {
      console.warn("@koine/utils:cookie readCookie, document is undefined");
    }
    return name ? ("" as T[N]) : ({} as T);
  }

  const cookies = document.cookie ? document.cookie.split("; ") : [];
  const all = {} as T;

  for (let i = 0; i < cookies.length; i++) {
    const parts = cookies[i].split("=");
    const value = parts.slice(1).join("=");

    try {
      const found = decodeURIComponent(parts[0]) as keyof T;
      all[found] = converterRead(value) as T[keyof T];

      if (name === found) {
        break;
      }
    } catch (e) {
      if (process.env["NODE_ENV"] !== "production") {
        console.warn("@koine/utils:cookie readCookie, failed to decode", value);
      }
    }
  }

  return name ? all[name] : all;
}

const defaultAttributesClient = { path: "/" };

export function setCookie<T extends string = string>(
  name: string,
  value: string | T,
  attributes: CookieAttributesClient = {}
): string | undefined {
  // eslint-disable-next-line prefer-const
  let { expires, ...restAttrs } = attributes;
  const cleanedAttrs = {
    expires: "",
    ...defaultAttributesClient,
    ...restAttrs,
  };

  if (typeof document === "undefined") {
    if (process.env["NODE_ENV"] !== "production") {
      console.warn("@koine/utils:cookie setCookie, document is undefined");
    }
    return;
  }

  if (isNumber(expires)) {
    expires = new Date(Date.now() + expires * 864e5);
  }
  if (expires) {
    cleanedAttrs.expires = expires.toUTCString();
  }

  name = encodeURIComponent(name)
    .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
    .replace(/[()]/g, escape);

  let stringifiedAttributes = "";
  for (const name in attributes) {
    const attrName = name as keyof CookieAttributesClient;
    if (!attributes[attrName]) {
      continue;
    }

    stringifiedAttributes += "; " + attrName;

    if (attributes[attrName] === true) {
      continue;
    }

    // Considers RFC 6265 section 5.2:
    // ...
    // 3.  If the remaining unparsed-attributes contains a %x3B (";")
    //     character:
    // Consume the characters of the unparsed-attributes up to,
    // not including, the first %x3B (";") character.
    // ...
    stringifiedAttributes +=
      "=" + (attributes[attrName] as string).split(";")[0];
  }

  return (document.cookie =
    name + "=" + converterWrite(value) + stringifiedAttributes);
}

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
