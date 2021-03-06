import Trans from "next-translate/Trans";
import type { TransProps } from "next-translate";
import type {
  TranslateNamespace,
  TranslationsPaths,
  TranslationsAllPaths,
} from "./types-i18n";

export type TProps<
  TNamespace extends TranslateNamespace | undefined = undefined
> =
  | (Omit<TransProps, "i18nKey" | "ns"> & {
      i18nKey: TranslationsAllPaths;
    })
  | (Omit<TransProps, "i18nKey" | "ns"> & {
      ns: TNamespace;
      i18nKey: TranslationsPaths<TNamespace>;
    });

/**
 * **NOTE**: To make typescript work nicely here make sure to enable
 * [`resolveJsonModule`](https://www.typescriptlang.org/tsconfig#resolveJsonModule)
 * in your `tsconfig.json` file.
 */
export const T = (props: TProps) => <Trans {...props} />;

// export type TProps = Omit<TransProps, "i18nKey" | "ns"> & {
//     i18nKey: TranslationsAllPaths;
// };

// export type TPropsNamespaced<
//     TNamespace extends TranslateNamespace
// > = Omit<TransProps, "i18nKey" | "ns"> & {
//     i18nKey: TranslationsPaths<Translations[TNamespace]>;
//     ns?: TNamespace;
// };

// export function T(props: TProps): JSX.Element;
// export function T<TNamespace extends TranslateNamespace>(props: TPropsNamespaced<TNamespace>): JSX.Element;
// export function T<TNamespace extends TranslateNamespace>(
//   props: TProps<TNamespace>
// ) {
//   return <Trans {...props} />;
// }

// export { default as T } from "next-translate/Trans";
