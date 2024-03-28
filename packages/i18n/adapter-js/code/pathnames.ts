import { forin } from "@koine/utils";
import type { I18nCompiler } from "../../compiler/types";

export default ({ routes }: I18nCompiler.AdapterArg<"js">) => {
  const all: Record<string, [string, string]> = {};
  forin(routes.byId, (id, data) => {
    forin(data.pathnames, (locale, pathname) => {
      all[pathname] = [locale, id];
    });
  });
  const value = JSON.stringify(
    Object.fromEntries(
      Object.entries(all)
        // .map(([pathname, [locale, id]]) => [
        //   pathname,
        //   [locale, id],
        // ])
        .sort(),
    ),
    null,
    2,
  );
  return `
export const pathnames = ${value} as const;

export default pathnames;
`;
};
