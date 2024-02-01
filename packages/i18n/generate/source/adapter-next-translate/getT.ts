// import type { I18nGenerate } from "../../types";

export default (/* data: I18nGenerate.Data, */) => `
import _getT from "next-translate/getT";
import type { I18n } from "./types";

export type GetT = <
  TNamespace extends I18n.TranslateNamespace | undefined = undefined,
>(
  locale?: string,
  namespace?: TNamespace,
) => Promise<I18n.Translate<TNamespace>>;

export const getT = _getT as GetT;

export default getT;
`;
