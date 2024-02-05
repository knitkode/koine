import type { I18nGenerate } from "../types";
import DynamicNamespaces from "./DynamicNamespaces";
import T from "./T";
import TransText from "./TransText";
import getT from "./getT";
import nextTranslateI18n from "./nextTranslateI18n";
import useT from "./useT";

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
      { name: "nextTranslateI18n", fn: nextTranslateI18n, ext: "js" },
      { name: "T", fn: T, ext: "tsx", index: true },
      { name: "TransText", fn: TransText, ext: "tsx", index: true },
      { name: "useT", fn: useT, ext: "ts", index: true },
    ],
  };
};

export default adapter;
