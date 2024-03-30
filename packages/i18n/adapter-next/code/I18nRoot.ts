import type { I18nCompiler } from "../../compiler/types";

export default ({
  options: {
    routes: { localeParamName },
  },
}: I18nCompiler.AdapterArg<"next">) => `
import { I18nProvider } from "./I18nProvider";
import { I18nAlternatesProvider } from "./I18nAlternatesProvider";
import { I18nRouteProvider } from "./I18nRouteProvider";
import { defaultLocale } from "./defaultLocale";
import { getI18nDictionaries } from "./getI18nDictionaries";
import type { I18n } from "./types";

export type I18nRootProps = React.PropsWithChildren;

const alternates = {};

/**
 * Use this _only once_ in the root \`layout.tsx\` at root folder of your app
 * directory (one up than the \`[${localeParamName}]\` folder).
 * 
 * **For App Router only**
 */
export const I18nRoot = ({ children }: I18nRootProps) => {

  return (
    <I18nRouteProvider id="">
      <I18nAlternatesProvider alternates={alternates}>
        {children}
      </I18nAlternatesProvider>
    </I18nRouteProvider>
  );
};

export default I18nRoot;
`;
