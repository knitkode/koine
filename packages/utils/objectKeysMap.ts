/**
 * A simple shortcut for `Object.keys(object).map((key) => ...)` with typed
 * `key/value`.
 * 
 * @category object
 */
export let objectKeysMap = <T extends object>(
  object: T,
  callback: (key: keyof T, value: T[keyof T], index: number) => any,
) =>
  Object.keys(object).map((key, index) =>
    callback(
      key as keyof typeof object,
      object[key as keyof typeof object],
      index,
    ),
  );

export default objectKeysMap;
