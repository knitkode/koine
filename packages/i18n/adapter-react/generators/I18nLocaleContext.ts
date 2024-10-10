import { createGenerator } from "../../compiler/createAdapter";
import { GLOBAL_I18N_IDENTIFIER } from "../../compiler/helpers";

export default createGenerator("react", (_arg) => {
  return {
    I18nLocaleContext: {
      dir: createGenerator.dirs.server,
      name: "I18nLocaleContext",
      ext: "tsx",
      index: false,
      content: () => /* j s */ `
import React from "react";
import { AsyncLocalStorage } from "async_hooks";
import { defaultLocale } from "../defaultLocale";
import { setGlobalLocale } from "../internal/setGlobalLocale";
import type { I18n } from "../types";

function createServerContext() {
  if (process.env.NODE_ENV !== "production") {
    if (Boolean(React.useState)) {
      throw new Error("I18nLocaleContext only works in RSC");
    }
  }

  let current: I18n.Locale | undefined;
  const storage = new AsyncLocalStorage<I18n.Locale>();

  return {
    Provider: async ({
      children,
      value,
    }: React.PropsWithChildren<{ value: I18n.Locale }>) => {
      // not sure about this mechanism, but we set it to 'undefined' here to
      // make sure that in the 'get' method the value from 'storage.getStorage'
      // is used as soon as available and with higher priority compared to 
      // this closure based 'current' value.
      current = undefined;
      setGlobalLocale(value);
      storage.enterWith(value);
      
      if (process.env.NODE_ENV !== "production") {
        if (Boolean(React.useState)) {
          throw new Error("I18nLocaleContext.Provider only works in RSC");
        }
      }

      return children as Promise<React.AwaitedReactNode>;
    },
    set: (value: I18n.Locale) => {
      setGlobalLocale(value);
      current = value;
      return current;
    },
    get: () => globalThis.${GLOBAL_I18N_IDENTIFIER} || current || storage.getStore() || defaultLocale,
  };
}

/**
 * **For React RSC only**
 * 
 * @internal
 */
export const I18nLocaleContext = createServerContext();
`,
    },
  };
});
