import { createGenerator } from "../../compiler/createAdapter";

export default createGenerator("next-translate", (_arg) => {
  return {
    I18nProvider: {
      name: "I18nProvider",
      ext: "tsx",
      index: true,
      content: () => /* js */ `
"use client";

import _I18nProvider from "next-translate/I18nProvider";

export const I18nProvider = _I18nProvider;

export default I18nProvider;
`,
    },
  };
});
