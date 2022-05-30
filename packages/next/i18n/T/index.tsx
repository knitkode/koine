import Trans from "next-translate/Trans";
import type { TransProps } from "next-translate";
import type { TranslationsPaths, TranslationsAllPaths } from "../useT";

export type TProps<
  TNamespace extends keyof Koine.NextTranslations | undefined = undefined
> = Omit<TransProps, "i18nKey" | "ns"> & {
  i18nKey: TNamespace extends keyof Koine.NextTranslations
    ? TranslationsPaths<Koine.NextTranslations[TNamespace]>
    : TranslationsAllPaths;
  ns?: TNamespace;
};

export function T(props: TProps): JSX.Element;
export function T<TNamespace extends keyof Koine.NextTranslations>(
  props: TProps<TNamespace>
) {
  return <Trans {...props} />;
}

// export { default as T } from "next-translate/Trans";
