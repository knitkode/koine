import { createGenerator } from "../../compiler/createAdapter";

export default createGenerator("react", (_arg) => {
  return {
    /**
     * In regards to singleton and shared data across modules in next.js, see:
     * - [Module imported in different files re-evaluated](https://github.com/vercel/next.js/issues/49309)
     * - [generateStaticParams globalThis (global) singleton problem](https://github.com/vercel/next.js/issues/69042)
     * - [Easy Context in React Server Components (RSC)](https://dev.to/jdgamble555/easy-context-in-react-server-components-rsc-1mdf)
     */
    localeServerContext: {
      dir: createGenerator.dirs.internal,
      name: "localeServerContext",
      ext: "ts",
      index: false,
      content: () => /* j s */ `
import React, { cache } from "react";
import { defaultLocale } from "../defaultLocale";
import { setGlobalLocale } from "./setGlobalLocale";

/**
 * @borrows [manvalls/server-only-context](https://github.com/manvalls/server-only-context)
 * @returns 
 */
function createServerContext<T>(
  defaultValue: T,
  onSet?: (value: T) => void,
): [() => T, (v: T) => void] {
  if (process.env.NODE_ENV !== "production") {
    if (Boolean(React.useState)) {
      throw new Error("createServerContext only works in RSC");
    }
  }

  const getRef = cache(() => ({ current: defaultValue }));
  const getValue = (): T => getRef().current;
  const setValue = (value: T) => {
    onSet?.(value);
    getRef().current = value;
  };

  return [getValue, setValue];
};

/**
 * **For React RSC only**
 * 
 * @internal
 */
export const localeServerContext = createServerContext(
  defaultLocale,
  setGlobalLocale,
);
`,
    },
    getLocale: {
      dir: createGenerator.dirs.server,
      name: "getLocale",
      ext: "ts",
      index: true,
      content: () => /* j s */ `
import React from "react";
import { localeServerContext } from "../internal/localeServerContext";

/**
 * **For React RSC only**
 * 
 * It gets the current locale
 */
export const getLocale = localeServerContext[0];

export default getLocale;
`,
    },
    setLocale: {
      dir: createGenerator.dirs.server,
      name: "setLocale",
      ext: "ts",
      index: true,
      content: () => /* j s */ `
import React from "react";
import { localeServerContext } from "../internal/localeServerContext";

/**
 * **For React RSC only**
 * 
 * It sets the current locale
 */
export const setLocale = localeServerContext[1];

export default setLocale;
`,
    },
  };
});
