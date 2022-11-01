import { isBrowser, isString } from "@koine/utils";

const methodsMap = { g: "getItem", s: "setItem", r: "removeItem" };

/**
 * Super minifiable `local/session Storage` client creator with SSR safety
 */
export const storageClient = (useSessionStorage?: boolean) => {
  const nativeMethod = <T extends "g" | "s" | "r">(
    method: T,
    key: string,
    value?: T extends "s" ? string : undefined
  ) =>
    isBrowser
      ? window[useSessionStorage ? "sessionStorage" : "localStorage"][
          methodsMap[method]
        ](key, value)
      : () => {
          if (process.env["NODE_ENV"] !== "production") {
            console.warn(
              `[@koine/utils:storage]:ls localStorage does not exists outside of browser.`
            );
          }
        };

  const get = <TValue>(
    key: string,
    transform?: (value: string) => TValue,
    defaultValue?: null | TValue
  ) => {
    let value = defaultValue ?? null;

    if (process.env["NODE_ENV"] !== "production") {
      if (!isBrowser) {
        console.log(
          `[@koine/utils:storage] called 'get' outside of browser with default value '${JSON.stringify(
            defaultValue
          )}'.`
        );
      }
    }

    if (isBrowser) {
      let stored = nativeMethod("g", key);

      if (stored) {
        stored = transform ? transform(stored) : stored;
        try {
          const parsed = JSON.parse(stored);
          if (parsed) value = parsed;
        } catch (_e) {
          value = stored;

          if (process.env["NODE_ENV"] !== "production") {
            console.warn(
              `[@koine/utils:storage]: 'get' failed to parse stored value as JSON. Plain '${stored}' value is returned.`
            );
          }
        }
      }
    }
    return value;
  };

  const set = <TValue>(
    key: string,
    value?: TValue,
    transform: (value: any) => string = (value) => value
  ) => {
    if (process.env["NODE_ENV"] !== "production") {
      if (!isBrowser) {
        console.log(
          `[@koine/utils:storage] called 'set' outside of browser does not work.`
        );
      }
    }

    if (isBrowser) {
      try {
        const transformedValue = isString(value)
          ? transform(value)
          : transform(JSON.stringify(value));

        nativeMethod("s", key, transformedValue);
      } catch (_e) {
        if (process.env["NODE_ENV"] !== "production") {
          console.warn(`[@koine/utils:createStorage]: 'set' error.`, _e);
        }
      }
    }
  };

  const remove = (key: string) => {
    if (process.env["NODE_ENV"] !== "production") {
      if (!isBrowser) {
        console.log(
          `[@koine/utils:storage] called 'remove' outside of browser does not work.`
        );
      }
    }

    if (isBrowser) {
      try {
        nativeMethod("r", key);
      } catch (_e) {
        if (process.env["NODE_ENV"] !== "production") {
          console.warn(`[@koine/utils:createStorage]: 'remove' error.`, _e);
        }
      }
    }
  };

  const has = (key: string, defaultValue?: boolean) => {
    let value = defaultValue ?? false;

    if (process.env["NODE_ENV"] !== "production") {
      if (!isBrowser) {
        console.log(
          `[@koine/utils:storage] called 'has' outside of browser with default value '${JSON.stringify(
            defaultValue
          )}'.`
        );
      }
    }

    if (isBrowser) {
      const stored = nativeMethod("g", key);

      value = stored ?? false;
    }
    return value;
  };

  return {
    get,
    set,
    remove,
    has,
  };
};

export default storageClient;