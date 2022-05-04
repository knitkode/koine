import { isObject } from "./is.js";

/**
 * Type safe replacement for `Object.keys(myObject)` to iterate over a record
 * without loosing the key's types in simple `string`s.
 *
 * @see https://stackoverflow.com/a/59459000/1938970
 */
export const getKeys = Object.keys as <T extends object>(
  obj: T
) => Array<keyof T>;

/**
 * Merge two or more objects together. It mutates the target object.
 *
 * @see https://stackoverflow.com/a/46973278/1938970
 */
export const mergeObjects = <T extends object = object>(
  target: T,
  ...sources: T[]
): T => {
  if (!sources.length) {
    return target;
  }
  const source = sources.shift();
  if (source === undefined) {
    return target;
  }

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((_key) => {
      const key = _key as keyof T;
      if (isObject(source[key])) {
        if (!target[key]) {
          // @ts-expect-error FIXME: ...
          target[key] = {} as Record<string, unknown>;
        }
        mergeObjects(target[key] as unknown as T, source[key] as unknown as T);
      } else {
        target[key] = source[key];
      }
    });
  }

  return mergeObjects(target, ...sources);
};

/**
 * Swap object map key/value
 */
export function swapMap<
  T extends Record<string, string | number | symbol> = Record<
    string,
    string | number | symbol
  >
>(map = {} as T) {
  const output = {} as Record<T[keyof T], keyof T>;
  for (const key in map) {
    output[map[key]] = key;
  }
  return output;
}
