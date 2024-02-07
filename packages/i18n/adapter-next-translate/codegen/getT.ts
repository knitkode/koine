// import type { I18nCodegen } from "../../types";

export default (/* {}: I18nCodegen.AdapterArg, */) => `
import _getT from "next-translate/getT";
import type { I18n } from "./types";

export type GetT = <
  TNamespace extends I18n.TranslateNamespace | undefined = undefined,
>(
  locale?: I18n.Locale,
  namespace?: TNamespace,
) => Promise<I18n.Translate<TNamespace>>;

export const getT = _getT as GetT;

export default getT;
`;
