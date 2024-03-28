import { createAdapter } from "../../compiler/createAdapter";
import { adapterReactOptions } from "../options";
import I18nContext from "./I18nContext";
import I18nProvider from "./I18nProvider";
import T from "./T";
import TransText from "./TransText";
import formatElements from "./formatElements";
import useLocale from "./useLocale";
import useT from "./useT";

export default createAdapter(adapterReactOptions, ({}) => {
  return {
    dependsOn: ["js"],
    files: [
      { name: "formatElements", fn: formatElements, ext: "tsx" },
      { name: "I18nContext", fn: I18nContext, ext: "tsx" },
      { name: "I18nProvider", fn: I18nProvider, ext: "tsx", index: true },
      { name: "T", fn: T, ext: "tsx", index: true },
      { name: "TransText", fn: TransText, ext: "tsx", index: true },
      { name: "useLocale", fn: useLocale, ext: "ts", index: true },
      { name: "useT", fn: useT, ext: "ts", index: true },
    ],
  };
});
