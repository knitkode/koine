import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"react">) => `
import React from "react";
import { AsyncLocalStorage } from "async_hooks";
import { defaultLocale } from "./defaultLocale";
import type { I18n } from "./types";

function createServerContext() {
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-extra-boolean-cast
    if (Boolean(React.useState)) {
      throw new Error("I18nLocaleContext only works in RSC");
    }
  }

  let current = defaultLocale;
  const storage = new AsyncLocalStorage<I18n.Locale>();

  return {
    Provider: async ({
      children,
      value,
    }: React.PropsWithChildren<{ value: I18n.Locale }>) => {
      storage.enterWith(value);
      current = value;
      
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-extra-boolean-cast
        if (Boolean(React.useState)) {
          throw new Error("I18nLocaleContext.Provider only works in RSC");
        }
      }

      return (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>{children}</>
      );
    },
    set: (value: I18n.Locale) => {
      current = value;
      return current;
    },
    get: () => storage.getStore() || defaultLocale,
  };
}

/**
 * **For React RSC only**
 * 
 * @internal
 */
export const I18nLocaleContext = createServerContext();

// export default I18nLocaleContext;
`;
