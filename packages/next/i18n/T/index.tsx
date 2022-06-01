import Trans from "next-translate/Trans";
import type { TransProps } from "next-translate";
import type { /* TranslationsPaths, */ TranslationsAllPaths } from "../useT";

export type TProps = Omit<TransProps, "i18nKey" | "ns"> & {
  i18nKey: TranslationsAllPaths;
};

export const T = (props: TProps) => <Trans {...props} />;

// export type TProps = Omit<TransProps, "i18nKey" | "ns"> & {
//     i18nKey: TranslationsAllPaths;
// };

// export type TPropsNamespaced<
//     TNamespace extends keyof Koine.NextTranslations
// > = Omit<TransProps, "i18nKey" | "ns"> & {
//     i18nKey: TranslationsPaths<Koine.NextTranslations[TNamespace]>;
//     ns?: TNamespace;
// };

// export function T(props: TProps): JSX.Element;
// export function T<TNamespace extends keyof Koine.NextTranslations>(props: TPropsNamespaced<TNamespace>): JSX.Element;
// export function T<TNamespace extends keyof Koine.NextTranslations>(
//   props: TProps<TNamespace>
// ) {
//   return <Trans {...props} />;
// }

// export { default as T } from "next-translate/Trans";
