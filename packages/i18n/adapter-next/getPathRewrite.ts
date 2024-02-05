import type { Rewrite as _Rewrite } from "next/dist/lib/load-custom-routes";
import { formatRoutePathname } from "../client";
import type { I18nCodegen } from "../codegen";

export type Rewrite = Omit<_Rewrite, "locale"> & { locale?: boolean };

/**
 * Get path rewrite
 */
export function getPathRewrite(arg: {
  localeSource?: I18nCodegen.Locale;
  localeDestination?: I18nCodegen.Locale;
  route: I18nCodegen.DataRoute;
  template: string;
  pathname: string;
  localeParam?: string;
}) {
  const { localeSource, localeDestination, localeParam, template, pathname } =
    arg;

  let sourcePrefix = "";
  if (localeSource) sourcePrefix = `/${localeSource}`;
  else if (localeParam) sourcePrefix = `/:${localeParam}`;

  const source = formatRoutePathname(sourcePrefix + pathname);

  let destinationPrefix = "";
  if (localeDestination) destinationPrefix = `/${localeDestination}`;
  else if (localeParam) destinationPrefix = `/:${localeParam}`;

  const destination = formatRoutePathname(destinationPrefix + template);
  // console.log(`rewrite pathname "${source}" to template "${destination}"`);

  if (source === destination) return;

  return {
    source,
    destination,
  } as Rewrite;
}
