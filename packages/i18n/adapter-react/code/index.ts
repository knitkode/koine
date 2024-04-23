import { createAdapter } from "../../compiler/createAdapter";
import { adapterReactOptions } from "../options";
import I18nEffects from "./I18nEffects";
import I18nHeadTags from "./I18nHeadTags";
import I18nLocaleContext from "./I18nLocaleContext";
import I18nMetadataContext from "./I18nMetadataContext";
import I18nMetadataProvider from "./I18nMetadataProvider";
import I18nMetadataSetter from "./I18nMetadataSetter";
import I18nRouteContext from "./I18nRouteContext";
import I18nRouteProvider from "./I18nRouteProvider";
import I18nRouteSetter from "./I18nRouteSetter";
import I18nTranslateContext from "./I18nTranslateContext";
import I18nTranslateProvider from "./I18nTranslateProvider";
import T from "./T";
import TransText from "./TransText";
import formatElements from "./formatElements";
import getLocale from "./getLocale";
import getT from "./getT";
import getTo from "./getTo";
import useI18nSwitch from "./useI18nSwitch";
import useLocale from "./useLocale";
import useRouteId from "./useRouteId";
import useT from "./useT";

export default createAdapter(adapterReactOptions, ({}) => {
  return {
    dependsOn: ["js"],
    files: [
      { name: "I18nEffects", fn: I18nEffects, ext: "tsx" },
      { name: "I18nHeadTags", fn: I18nHeadTags, ext: "tsx", index: true },
      { name: "I18nLocaleContext", fn: I18nLocaleContext, ext: "tsx" },
      { name: "I18nMetadataContext", fn: I18nMetadataContext, ext: "tsx" },
      { name: "I18nMetadataProvider", fn: I18nMetadataProvider, ext: "tsx" },
      { name: "I18nMetadataSetter", fn: I18nMetadataSetter, ext: "tsx" },
      { name: "I18nRouteContext", fn: I18nRouteContext, ext: "tsx" },
      { name: "I18nRouteProvider", fn: I18nRouteProvider, ext: "tsx" },
      { name: "I18nRouteSetter", fn: I18nRouteSetter, ext: "tsx" },
      { name: "I18nTranslateContext", fn: I18nTranslateContext, ext: "tsx" },
      {
        name: "I18nTranslateProvider",
        fn: I18nTranslateProvider,
        ext: "tsx",
        index: true,
      },
      { name: "T", fn: T, ext: "tsx", index: true },
      { name: "TransText", fn: TransText, ext: "tsx", index: true },
      { name: "formatElements", fn: formatElements, ext: "tsx" },
      { name: "getLocale", fn: getLocale, ext: "ts", index: true },
      { name: "getT", fn: getT, ext: "ts", index: true },
      { name: "getTo", fn: getTo, ext: "ts", index: true },
      { name: "useI18nSwitch", fn: useI18nSwitch, ext: "ts", index: true },
      { name: "useLocale", fn: useLocale, ext: "ts", index: true },
      { name: "useRouteId", fn: useRouteId, ext: "ts", index: true },
      { name: "useT", fn: useT, ext: "ts", index: true },
    ],
  };
});
