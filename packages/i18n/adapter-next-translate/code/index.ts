import { createAdapter } from "../../compiler/createAdapter";
import type { I18nCompiler } from "../../compiler/types";
import { adapterNextTranslateOptions } from "../options";
import DynamicNamespaces from "./DynamicNamespaces";
import I18nProvider from "./I18nProvider";
import T from "./T";
import TransText from "./TransText";
import getT from "./getT";
import nextTranslateI18n from "./nextTranslateI18n";
import useLocale from "./useLocale";
import useT from "./useT";

export default createAdapter(
  adapterNextTranslateOptions,
  ({ adapterOptions }) => {
    const files: I18nCompiler.AdapterFile<"next-translate">[] = [
      { name: "getT", fn: getT, ext: "ts", index: true },
      { name: "nextTranslateI18n", fn: nextTranslateI18n, ext: "js" },
      { name: "T", fn: T, ext: "tsx", index: true },
      { name: "TransText", fn: TransText, ext: "tsx", index: true },
      { name: "useT", fn: useT, ext: "ts", index: true },
    ];

    if (adapterOptions.loader === false) {
      files.push({ name: "useLocale", fn: useLocale, ext: "ts", index: true });
      files.push({
        name: "I18nProvider",
        fn: I18nProvider,
        ext: "tsx",
        index: true,
      });
    } else {
      // TODO: check, probably DynamicNamespaces does not work without the automatic loader?
      files.push({
        name: "DynamicNamespaces",
        fn: DynamicNamespaces,
        ext: "tsx",
        index: true,
      });
    }

    return {
      dependsOn: ["next"],
      needsTranslationsFiles: true,
      files,
    };
  },
);
