import type { I18nConfig } from "next-translate";

export const adapterNextTranslateOptions: AdapterNextTranslateOptions = {};

export type AdapterNextTranslateOptions = Partial<Pick<I18nConfig, "loader">>;
