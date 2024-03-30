import { createAdapter } from "../../compiler/createAdapter";
import { adapterReactOptions } from "../options";
import I18nAlternatesContext from "./I18nAlternatesContext";
import I18nAlternatesProvider from "./I18nAlternatesProvider";
import I18nAlternatesSetter from "./I18nAlternatesSetter";
import I18nContext from "./I18nContext";
import I18nEffects from "./I18nEffects";
import I18nProvider from "./I18nProvider";
import I18nRouteContext from "./I18nRouteContext";
import I18nRouteProvider from "./I18nRouteProvider";
import I18nRouteSetter from "./I18nRouteSetter";
import T from "./T";
import TransText from "./TransText";
import formatElements from "./formatElements";
import useAlternates from "./useAlternates";
import useLocale from "./useLocale";
import useRouteId from "./useRouteId";
import useT from "./useT";

export default createAdapter(adapterReactOptions, ({}) => {
  return {
    dependsOn: ["js"],
    files: [
      { name: "formatElements", fn: formatElements, ext: "tsx" },
      {
        name: "I18nAlternatesProvider",
        fn: I18nAlternatesProvider,
        ext: "tsx",
      },
      { name: "I18nAlternatesContext", fn: I18nAlternatesContext, ext: "tsx" },
      { name: "I18nAlternatesSetter", fn: I18nAlternatesSetter, ext: "tsx" },
      { name: "I18nContext", fn: I18nContext, ext: "tsx" },
      { name: "I18nEffects", fn: I18nEffects, ext: "tsx" },
      { name: "I18nProvider", fn: I18nProvider, ext: "tsx", index: true },
      { name: "I18nRouteContext", fn: I18nRouteContext, ext: "tsx" },
      { name: "I18nRouteProvider", fn: I18nRouteProvider, ext: "tsx" },
      { name: "I18nRouteSetter", fn: I18nRouteSetter, ext: "tsx" },
      { name: "T", fn: T, ext: "tsx", index: true },
      { name: "TransText", fn: TransText, ext: "tsx", index: true },
      { name: "useAlternates", fn: useAlternates, ext: "ts", index: true },
      { name: "useLocale", fn: useLocale, ext: "ts", index: true },
      { name: "useRouteId", fn: useRouteId, ext: "ts", index: true },
      { name: "useT", fn: useT, ext: "ts", index: true },
    ],
  };
});
