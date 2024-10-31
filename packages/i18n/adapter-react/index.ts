import { type Options as AdapterJsOptions, adapterJs } from "../adapter-js";
import { createAdapter } from "../compiler/createAdapter";
import I18nEffects from "./generators/I18nEffects";
import I18nHeadTags from "./generators/I18nHeadTags";
import I18nMetadata from "./generators/I18nMetadata";
import I18nRoute from "./generators/I18nRoute";
import I18nTranslate from "./generators/I18nTranslate";
import Trans from "./generators/Trans";
import getT from "./generators/getT";
import getTo from "./generators/getTo";
import locale from "./generators/locale";
import useRouteId from "./generators/useRouteId";
import useTo from "./generators/useTo";
import useToSpa from "./generators/useToSpa";

// import packageJson from "./generators/packageJson";

// export type Options = typeof adapterJs.defaultOptions & {};
export type Options = AdapterJsOptions & {};

export const adapterReact = createAdapter({
  name: "react",
  defaultOptions: {
    ...adapterJs.defaultOptions,
  } satisfies Options,
  getGenerators: (data) => {
    return [
      ...adapterJs.getGenerators(data),
      I18nEffects,
      I18nHeadTags,
      I18nMetadata,
      I18nRoute,
      I18nTranslate,
      locale,
      Trans,
      getT,
      getTo,
      useRouteId,
      useTo,
      useToSpa,
      // packageJson,
    ];
  },
  getTransformers: () => {
    return {};
  },
});

export type Adapter = typeof adapterReact;

export default adapterReact;
