import { decode } from "./decode";
import { encode } from "./encode";
import { isBrowser } from "./isBrowser";
import { isNullOrUndefined } from "./isNullOrUndefined";
import { isString } from "./isString";

export type CreateStorageConfig = Record<string, any>;

/**
 * Utility to create a storage instance to interact with `localStorage` using
 * encrypted (encoded) key/values.
 */
export const createStorage = <T extends CreateStorageConfig>(
  config: Partial<T>
) => {
  const methodsMap = { g: "getItem", s: "setItem", r: "removeItem" };
  /**
   * Super minifiable localStorage wrapper with SSR safety
   */
  const ls = <T extends "g" | "s" | "r">(
    method: T,
    key: string,
    value?: T extends "s" ? string : undefined
  ) =>
    isBrowser
      ? localStorage[methodsMap[method]](key, value)
      : () => {
          if (process.env["NODE_ENV"] !== "production") {
            console.warn(
              `[@koine/utils] createStorage: localStorage does not exists in this environment.`
            );
          }
        };

  const keys = Object.keys(config).reduce(
    (map, key) => ({ ...map, [key]: encode(key) }),
    {} as Record<keyof T, string>
  );

  return {
    /**
     * Get all storage value (it uses `localStorage.get()`).
     *
     * Unparseable values with `JSON.parse()` return their value as it is.
     * If the given `key` argument is not found `null` is returned.
     */
    get<TKey extends keyof T>(key: TKey): T[TKey] | null {
      let stored = ls("g", keys[key]);
      if (stored) {
        stored = decode(stored);
        try {
          return JSON.parse(stored);
        } catch (_e) {
          return stored as T[TKey];
        }
      }
      return null;
    },
    /**
     * Get all storage values (it uses `localStorage.get()`).
     *
     * `undefined` and `null` values are not returned.
     */
    getAll(): T {
      const all = {} as T;
      for (const key in keys) {
        const value = this.get(key);

        if (!isNullOrUndefined(value)) {
          all[key] = value;
        }
      }
      return all;
    },
    /**
     * Set a storage value (it uses `localStorage.set()`).
     *
     * Non-string values are stringified with `JSON.stringify()`
     */
    set<TKey extends keyof T>(key: TKey, value: T[TKey]) {
      ls(
        "s",
        keys[key],
        isString(value) ? encode(value) : encode(JSON.stringify(value))
      );
    },
    /**
     * Set all given storage values (it uses `localStorage.set()`).
     *
     * Non-string values are stringified with `JSON.stringify()`, `undefined`
     * and `null` values are removed from the storage
     */
    setMany(newValues: Partial<T>) {
      for (const key in newValues) {
        const value = newValues[key];
        if (!isNullOrUndefined(value)) {
          this.set(key, value as T[Extract<keyof T, string>]);
        } else {
          this.remove(key);
        }
      }
    },
    /**
     * Check if a storage value is _truthy_ (it uses `localStorage.get()`).
     */
    has<TKey extends keyof T>(key: TKey) {
      const stored = ls("g", keys[key]);
      return !!stored;
    },
    /**
     * Remove a storage value (it uses `localStorage.remove()`).
     */
    remove<TKey extends keyof T>(key: TKey) {
      ls("r", keys[key]);
    },
    /**
     * Clear all storage values (it uses `localStorage.remove()`).
     */
    clear() {
      for (const key in keys) {
        ls("r", keys[key]);
      }
    },
    /**
     * Watch a storage value changes, this needs to be executed only in browser
     * context (it uses `window.addEventListener("storage")`).
     *
     * Inspiration from [Multi Tab Logout in React — Redux](https://medium.com/front-end-weekly/multi-tab-logout-in-react-redux-4715f071c7fa)
     */
    watch: <TKey extends keyof T>(
      keyToWatch: TKey,
      onRemoved?: () => void,
      onAdded?: () => void
    ) => {
      const handler = (event: StorageEvent) => {
        const { key, oldValue, newValue } = event;
        if (key === keys[keyToWatch]) {
          if (oldValue && !newValue) {
            onRemoved?.();
          } else if (!oldValue && newValue) {
            onAdded?.();
          }
        }
      };

      if (!isBrowser) return () => void 0;

      window.addEventListener("storage", handler);
      return () => {
        window.removeEventListener("storage", handler);
      };
    },
  };
};

export default createStorage;
