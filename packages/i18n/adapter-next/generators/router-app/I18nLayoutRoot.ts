import { createGenerator } from "../../../compiler/createAdapter";

export default createGenerator("next", (arg) => {
  const {
    options: {
      routes: { localeParamName },
    },
  } = arg;

  return {
    I18nLayoutRoot: {
      dir: createGenerator.dirs.server,
      name: "I18nLayoutRoot",
      ext: "tsx",
      index: false,
      content: () => /* j s */ `
import React from "react";
import { i18nDefaultMetadata } from "@koine/i18n";
import { I18nMetadataProvider } from "../internal/I18nMetadataProvider";
import { I18nRouteProvider } from "../internal/I18nRouteProvider";
import type { I18n } from "../types";

type I18nLayoutRootProps = React.PropsWithChildren;

/**
 * Use this _only once_ in the root \`layout.tsx\` at root folder of your app
 * directory (one up than the \`[${localeParamName}]\` folder).
 *
 * **For App Router only**
 */
export const I18nLayoutRoot = ({ children }: I18nLayoutRootProps) => {
  return (
    <I18nRouteProvider id={"" as I18n.RouteId}>
      <I18nMetadataProvider metadata={i18nDefaultMetadata}>
        {children}
      </I18nMetadataProvider>
    </I18nRouteProvider>
  );
};
`,
    },
  };
});
