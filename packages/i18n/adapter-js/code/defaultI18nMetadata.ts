import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"js">) => `
import type { I18n } from "./types";

/**
 * @internal
 */
export const defaultI18nMetadata: I18n.Metadata = {
  canonical: "",
  alternates: {}
}
`;
