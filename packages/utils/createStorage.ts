import { decode } from "./decode";
import { encode } from "./encode";
import isBrowser from "./isBrowser";
import { isString } from "./isString";

export type CreateStorageConfig = Record<string, any>;

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
    set<TKey extends keyof T>(key: TKey, value: T[TKey]) {
      ls(
        "s",
        keys[key],
        isString(value) ? encode(value) : encode(JSON.stringify(value))
      );
    },
    has<TKey extends keyof T>(key: TKey) {
      const stored = ls("g", keys[key]);
      return !!stored;
    },
    remove<TKey extends keyof T>(key: TKey) {
      ls("r", keys[key]);
    },
    clear() {
      for (const key in keys) {
        ls("r", keys[key]);
      }
    },
    /**
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

      window.addEventListener("storage", handler);
      return () => {
        window.removeEventListener("storage", handler);
      };
    },
  };
};

export default createStorage;
