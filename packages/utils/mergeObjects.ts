import { isObject } from "./isObject";

/**
 * Merge two or more objects together. It mutates the target object.
 *
 * @category objects
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
