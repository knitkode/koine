// import type { ClassValue } from "clsx";
type ClassValue =
  | ClassArray
  | ClassDictionary
  | string
  | number
  | null
  | boolean
  | undefined;
type ClassDictionary = Record<string, any>;
type ClassArray = ClassValue[];

export type ClsxClassValue = ClassValue;

// import _clsx from "clsx";

// export const clsx = _clsx;
function toVal(mix: any) {
  let k,
    y,
    str = "";

  if (typeof mix === "string" || typeof mix === "number") {
    str += mix;
  } else if (typeof mix === "object") {
    if (Array.isArray(mix)) {
      for (k = 0; k < mix.length; k++) {
        if (mix[k]) {
          if ((y = toVal(mix[k]))) {
            str && (str += " ");
            str += y;
          }
        }
      }
    } else {
      for (k in mix) {
        if (mix[k]) {
          str && (str += " ");
          str += k;
        }
      }
    }
  }

  return str;
}

/**
 * Class names utility
 *
 * @borrows [lukeed/clsx](https://github.com/lukeed/clsx)
 * @license [MIT: Luke Edwards](https://github.com/lukeed/clsx/blob/master/license)
 */
export const clsx: (...args: ClassValue[]) => string = function () {
  let i = 0,
    tmp,
    x,
    str = "";
  while (i < arguments.length) {
    // eslint-disable-next-line prefer-rest-params
    if ((tmp = arguments[i++])) {
      if ((x = toVal(tmp))) {
        str && (str += " ");
        str += x;
      }
    }
  }
  return str;
};

export default clsx;
