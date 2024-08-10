import { isPrimitive } from "@koine/utils";
import {
  getFunctionBodyWithLocales,
  getTranslationValueOutput,
} from "../../adapter-js/generators/t";
import { tInterpolateParams } from "../../adapter-js/generators/tInterpolateParams";
import { tPluralise } from "../../adapter-js/generators/tPluralise";
import { createGenerator } from "../../compiler/createAdapter";
import type { I18nCompiler } from "../../compiler/types";

const getTLookup = (
  translations: I18nCompiler.DataTranslations,
  options: {
    defaultLocale: string;
    namespaceDelimiter: string;
  },
) => {
  const { defaultLocale, namespaceDelimiter } = options;
  const lines = [];

  for (const translationId in translations) {
    let { namespace, path, values, params, plural } =
      translations[translationId];

    if (plural) {
      if (params) {
        params["count"] = "number";
      } else {
        params = { count: "number" };
      }
    }
    const args: string[] = [];
    if (params) {
      args.push("params");
    }

    let body = "";

    if (isPrimitive(values)) {
      body += getTranslationValueOutput(values);
    } else {
      body += getFunctionBodyWithLocales(defaultLocale, values);
    }
    if (plural) {
      body = `tPluralise(${body}, params.count)`;
    }
    if (params) {
      body = `tInterpolateParams(${body}, params)`;
    }

    lines.push(
      `"${namespace}${namespaceDelimiter}${path}": (${args.join(", ")}) => ${body}`,
    );
  }

  return lines.join(",\n  ");
};

export default createGenerator("next", (arg) => {
  const { config, options, translations } = arg;
  const { defaultLocale } = config;
  const { namespaceDelimiter, dynamicDelimiters } = options.translations.tokens;
  const { globalName } = options.adapter;

  return {
    webpackDefineT: {
      name: "webpack-define-t",
      ext: "js",
      index: false,
      content: () => {
        // const { functions } = getTFunctions(translations, {
        //   defaultLocale,
        //   fnPrefix: "",
        // });

        // ${FunctionsCompiler.outMany("cjs", functions, {
        //   imports: false,
        //   exports: false,
        // })}
        return /* j s */ `
const locale = global.__i18n_locale;

${tPluralise().$out("cjs", {
  exports: false,
  imports: false,
  comments: false,
})}

${tInterpolateParams(dynamicDelimiters).$out("cjs", {
  exports: false,
  imports: false,
  comments: false,
})}

const lookup = {
  ${getTLookup(translations, { defaultLocale, namespaceDelimiter })}
};

module.exports = (i18nKey, params) => {
  const fn = lookup[i18nKey];
  if (fn) return fn(params);

  return "Unexisting translation key!";
};
`;
      },
    },
    webpackGlobalDefinition: {
      name: "i18n-globals",
      ext: "d.ts",
      index: false,
      content: () => {
        return `
export {};

declare global {
  // type I18n = import("./types").I18n;

  /**
   * Global Translate function it allows to select any of the all available
   * strings in _all_ namespaces.
   */
  export type GlobalTranslate = <
    TPath extends import("./types").I18n.TranslationsAllPaths,
    TReturn = import("./types").I18n.TranslationAtPath<TPath>,
  >(
    path: TPath,
    query?: object,
  ) => TReturn;

  var ${globalName}: {
    t: GlobalTranslate;
    // t: import("./types").I18n.TranslateDefault;
  }
}
`;
      },
    },
  };
});
