import { adapterJs } from "../adapter-js";
import { createAdapter } from "../compiler/createAdapter";
import I18nEffects from "./generators/I18nEffects";
import I18nHeadTags from "./generators/I18nHeadTags";
import I18nLocaleContext from "./generators/I18nLocaleContext";
import I18nMetadata from "./generators/I18nMetadata";
import I18nRoute from "./generators/I18nRoute";
import I18nTranslate from "./generators/I18nTranslate";
import Trans from "./generators/Trans";
import TransText from "./generators/TransText";
import formatElements from "./generators/formatElements";
import getLocale from "./generators/getLocale";
import getT from "./generators/getT";
import getTo from "./generators/getTo";

// import packageJson from "./generators/packageJson";

export type Options = typeof adapterJs.defaultOptions & {};

export const adapterReact = createAdapter({
  name: "react",
  defaultOptions: {
    ...adapterJs.defaultOptions,
  } as Options,
  getGenerators: (data) => {
    return [
      ...adapterJs.getGenerators(data),
      I18nEffects,
      I18nHeadTags,
      I18nLocaleContext,
      I18nMetadata,
      I18nRoute,
      I18nTranslate,
      Trans,
      TransText,
      formatElements,
      getLocale,
      getT,
      getTo,
      // packageJson,
    ];
  },
  getTransformers: () => {
    return {};
  },
});

export type Adapter = typeof adapterReact;

export default adapterReact;
