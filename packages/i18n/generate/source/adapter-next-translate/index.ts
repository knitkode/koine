import type { I18nGenerate } from "../../types";
import DynamicNamespaces from "./DynamicNamespaces";
import T from "./T";
import TransText from "./TransText";
import getT from "./getT";
import nextTranslateI18n from "./next-translate-i18n";
import useLocale from "./useLocale";
import useT from "./useT";
import useTo from "./useTo";

const adapter: I18nGenerate.Adpater = () => {
  return {
    dependsOn: ["next"],
    files: [
      {
        name: "DynamicNamespaces",
        fn: DynamicNamespaces,
        ext: "tsx",
        index: true,
      },
      { name: "getT", fn: getT, ext: "ts", index: true },
      { name: "nextTranslateI18n", fn: nextTranslateI18n, ext: "ts" },
      { name: "T", fn: T, ext: "tsx", index: true },
      { name: "TransText", fn: TransText, ext: "tsx", index: true },
      { name: "useLocale", fn: useLocale, ext: "ts", index: true },
      { name: "useT", fn: useT, ext: "ts", index: true },
      { name: "useTo", fn: useTo, ext: "ts", index: true },
    ],
  };
};

export default adapter;
