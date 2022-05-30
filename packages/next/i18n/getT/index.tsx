/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */

/**
 * @file
 *
 * About the typescript support for translation strings @see:
 * - https://github.com/vinissimus/next-translate/issues/721
 */
import getTranslation from "next-translate/getT";
import type { Translate } from "../useT";

export type GetT = <
  TNamespace extends keyof Koine.NextTranslations | undefined
>(
  locale?: string,
  namespace?: TNamespace
) => Promise<Translate<TNamespace>>;

export const getT = getTranslation as GetT;
