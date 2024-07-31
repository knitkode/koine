import { createGenerator } from "../../compiler/createAdapter";

export default createGenerator("next", (arg) => {
  const {
    options: {
      adapter: { modularized },
    },
  } = arg;

  return {
    i18nServer: {
      dir: "server",
      name: "i18nServer",
      ext: "tsx",
      index: true,
      content: () => /* js */ `
import { defaultLocale } from "../defaultLocale";
import { locales } from "../locales";${
        modularized
          ? `
import * as $to from "../$to";
import * as $t from "../$t";`
          : ``
      }
import { getLocale } from "./getLocale";
import { getTo } from "./getTo";
import { getT } from "./getT";
import { I18nLayoutRoot } from "./I18nLayoutRoot";
import { createI18nLayout } from "./I18nLayout";
import { createI18nPage } from "./I18nPage";

export const i18nServer = {
  /**
   * {@link I18nLayoutRoot}
   * @example
   * 
   * \`\`\`
   * import { i18nServer } from "@/i18n/server";
   * 
   * // method 1)
   * export default i18nServer.LayoutRoot;
   * 
   * // method 2) if you need to wrap your app with other providers
   * const { LayoutRoot } = i18nServer;
   * 
   * export default (props: React.PropsWithChildren) => (
   *   <LayoutRoot>
   *     <MyProvider>{props.children}</MyProvider>
   *   </LayoutRoot>
   * );
   * \`\`\`
   */
  LayoutRoot: I18nLayoutRoot,
  /** {@link createI18nLayout} */
  layout: createI18nLayout,
  /** {@link createI18nPage} */
  page: createI18nPage,
  /** {@link defaultLocale} */
  defaultLocale,
  /** {@link locales} */
  locales,
  /** {@link getLocale} */
  getLocale,
  /** {@link getT} */
  getT,
  /** {@link getTo} */
  getTo,${
    modularized
      ? `
  /** {@link $t} */
  $t,
  /** {@link $to} */
  $to,`
      : ``
  }
};

export default i18nServer;
`,
    },
  };
});
