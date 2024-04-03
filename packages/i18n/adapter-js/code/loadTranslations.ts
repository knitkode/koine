import type { I18nCompiler } from "../../compiler/types";
import { loadTranslations_inline } from "./loadTranslations_inline";

export default ({}: I18nCompiler.AdapterArg<"js">) => `
import type { I18n } from "./types";

/**
 * @internal
 */
export ${loadTranslations_inline()}
`;
