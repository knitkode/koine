import type { I18nCompiler } from "../../compiler/types";
import { getI18nDictionaries_inline } from "./getI18nDictionaries_inline";

export default ({}: I18nCompiler.AdapterArg<"js">) => `
import { defaultLocale } from "./defaultLocale";
import type { I18n } from "./types";

${getI18nDictionaries_inline(true)}

// export default getI18nDictionaries;
`;
