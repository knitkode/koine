import { createAdapter } from "../compiler/createAdapter";
import config from "./generators/config";
import createT from "./generators/createT";
import dictionary from "./generators/dictionary";
import formatTo from "./generators/formatTo";
import formatUrl from "./generators/formatUrl";
// import getI18nAlternatesFromDom from "./generators/getI18nAlternatesFromDom";
import getI18nDictionaries from "./generators/getI18nDictionaries";
import getI18nMetadata from "./generators/getI18nMetadata";
import getT from "./generators/getT";
import interpolate from "./generators/interpolate";
import isLocale from "./generators/isLocale";
import loadTranslations from "./generators/loadTranslations";
import pathnameToRouteId from "./generators/pathnameToRouteId";
import routes from "./generators/routes";
import setLocale from "./generators/setLocale";
import t from "./generators/t";
import tPluralise from "./generators/tPluralise";
import to from "./generators/to";
import types from "./generators/types";

export type Options = {
  /**
   * A valid JavaScript object key identifier on whc
   *
   * @default "__i18n_locale"
   */
  // globalize: {
  //   locale: string;
  // };
  /**
   * - When `true` it outpus each function in a separate file with a `named` and a
   * `default` export in order to fully support SWC transforms optimization (see
   * _Next.js_ **modularizeImports** option).
   * You will use these functions with named exports from `@/i18n/$t`, e.g.
   * ```ts
   * import { $t_myMessage_key } from "@/i18n/$t";
   *
   * $t_myMessage_key();
   * ```
   * This import is transformed into `import $t_myMessage_key from "@/i18n/$t/$t_myMessage_key";`
   *
   * - When `false` usage is:
   * ```ts
   * import * as $t from "@/i18n/$t";
   *
   * $t.myMessage_key();
   * ```
   * or using a named export
   * ```ts
   * import { myMessage_key } from "@/i18n/$t";
   *
   * myMessage_key();
   * ```
   *
   * @default true
   */
  modularize: boolean;
};

export const adapterJs = createAdapter({
  name: "js",
  defaultOptions: {
    // globalize: {
    //   locale: "__i18n_locale",
    // },
    modularize: true,
  } satisfies Options,
  getGenerators: (_data) => {
    return [
      config,
      createT,
      dictionary,
      formatTo,
      formatUrl,
      getI18nDictionaries,
      getI18nMetadata,
      // TODO: probably remove it or move it to `i18n/client` public utils
      // getI18nAlternatesFromDom,
      getT,
      interpolate,
      isLocale,
      loadTranslations,
      pathnameToRouteId,
      routes,
      setLocale,
      t,
      tPluralise,
      to,
      types,
    ];
  },
  getTransformers: () => {
    return {};
  },
});

export type Adapter = typeof adapterJs;

export default adapterJs;
