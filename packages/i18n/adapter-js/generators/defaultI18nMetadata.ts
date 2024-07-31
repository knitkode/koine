import { createGenerator } from "../../compiler/createAdapter";

export default createGenerator("js", (_arg) => {
  return {
    defaultI18nMetadata: {
      // dir: createGenerator.dirs.internal,
      name: "defaultI18nMetadata",
      ext: "ts",
      content: () => /* js */ `
import type { I18n } from "./types";

/**
 * @internal
 */
export const defaultI18nMetadata: I18n.Metadata = {
  canonical: "",
  alternates: {}
}
`,
    },
  };
});
