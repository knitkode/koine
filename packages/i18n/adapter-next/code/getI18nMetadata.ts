import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"next">) => {
  return `
import type { I18n } from "./types";
import { getAlternates, type GetAlternatesOptions } from "./getAlternates";

export function getI18nMetadata<TRouteId extends I18n.RouteId>(
  options: GetAlternatesOptions<TRouteId>,
) {
  const languages = getAlternates(options);
  const canonical = languages["x-default"];
  return { alternates: { canonical, languages } };
}

export default getI18nMetadata;
`;
};
