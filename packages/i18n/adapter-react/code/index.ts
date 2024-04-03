import { createAdapter } from "../../compiler/createAdapter";
import { adapterReactOptions } from "../options";
import I18nContext from "./I18nContext";
import I18nEffects from "./I18nEffects";
import I18nHeadTags from "./I18nHeadTags";
import I18nMetadataContext from "./I18nMetadataContext";
import I18nMetadataProvider from "./I18nMetadataProvider";
import I18nMetadataSetter from "./I18nMetadataSetter";
import I18nProvider from "./I18nProvider";
import I18nRouteContext from "./I18nRouteContext";
import I18nRouteProvider from "./I18nRouteProvider";
import I18nRouteSetter from "./I18nRouteSetter";
import T from "./T";
import TransText from "./TransText";
import formatElements from "./formatElements";
import useI18nSwitch from "./useI18nSwitch";
import useLocale from "./useLocale";
import useRouteId from "./useRouteId";
import useT from "./useT";

export default createAdapter(adapterReactOptions, ({}) => {
  return {
    dependsOn: ["js"],
    files: [
      { name: "formatElements", fn: formatElements, ext: "tsx" },
      { name: "I18nContext", fn: I18nContext, ext: "tsx" },
      { name: "I18nEffects", fn: I18nEffects, ext: "tsx" },
      { name: "I18nHeadTags", fn: I18nHeadTags, ext: "tsx", index: true },
      { name: "I18nMetadataContext", fn: I18nMetadataContext, ext: "tsx" },
      { name: "I18nMetadataProvider", fn: I18nMetadataProvider, ext: "tsx" },
      { name: "I18nMetadataSetter", fn: I18nMetadataSetter, ext: "tsx" },
      { name: "I18nProvider", fn: I18nProvider, ext: "tsx", index: true },
      { name: "I18nRouteContext", fn: I18nRouteContext, ext: "tsx" },
      { name: "I18nRouteProvider", fn: I18nRouteProvider, ext: "tsx" },
      { name: "I18nRouteSetter", fn: I18nRouteSetter, ext: "tsx" },
      { name: "T", fn: T, ext: "tsx", index: true },
      { name: "TransText", fn: TransText, ext: "tsx", index: true },
      { name: "useI18nSwitch", fn: useI18nSwitch, ext: "ts", index: true },
      { name: "useLocale", fn: useLocale, ext: "ts", index: true },
      { name: "useRouteId", fn: useRouteId, ext: "ts", index: true },
      { name: "useT", fn: useT, ext: "ts", index: true },
    ],
  };
});
