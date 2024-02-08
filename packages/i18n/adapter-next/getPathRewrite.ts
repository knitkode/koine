import type { Rewrite as _Rewrite } from "next/dist/lib/load-custom-routes";
import { formatRoutePathname } from "../client";
import type { I18nCompiler } from "../compiler";

export type Rewrite = Omit<_Rewrite, "locale"> & { locale?: boolean };

/**
 * Get path rewrite
 */
export function getPathRewrite(arg: {
  localeSource?: I18nCompiler.Locale;
  localeDestination?: I18nCompiler.Locale;
  route: I18nCompiler.DataRoute;
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
