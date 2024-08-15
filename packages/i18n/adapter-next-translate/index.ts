import type { I18nConfig } from "next-translate";
import {
  type Options as AdapterNextOptions,
  adapterNext,
} from "../adapter-next";
import { createAdapter } from "../compiler/createAdapter";
import type { I18nCompiler } from "../compiler/types";
import DynamicNamespaces from "./generators/DynamicNamespaces";
import I18nProvider from "./generators/I18nProvider";
import Trans from "./generators/Trans";
import TransText from "./generators/TransText";
import getT from "./generators/getT";
import nextTranslateI18n from "./generators/nextTranslateI18n";
import useLocale from "./generators/useLocale";
import useT from "./generators/useT";

export type Options = typeof adapterNext.defaultOptions &
  Partial<Pick<I18nConfig, "loader">>;
// export type Options = AdapterNextOptions & Partial<Pick<I18nConfig, "loader">>;

export const adapterNextTranslate = createAdapter({
  name: "next-translate",
  defaultOptions: {
    ...adapterNext.defaultOptions,
  } satisfies Options,
  getGenerators: (data) => {
    const { loader } = data.options.adapter;
    return [
      ...adapterNext.getGenerators(
        data as unknown as I18nCompiler.DataCode<"next">,
      ),
      getT,
      nextTranslateI18n,
      Trans,
      TransText,
      useT,
      ...(loader === false ? [useLocale] : []),
      ...(loader === false ? [I18nProvider] : []),
      // TODO: check, probably DynamicNamespaces does not work without the automatic loader?
      ...(loader === true ? [DynamicNamespaces] : []),
    ];
  },
  getTransformers: () => {
    return {};
  },
});

export type Adapter = typeof adapterNextTranslate;

export default adapterNextTranslate;
