import type { Redirect as _Redirect } from "next/dist/lib/load-custom-routes";
import { formatRoutePathname } from "../client";
import type { I18nCodegen } from "../codegen";

export type Redirect = Omit<_Redirect, "locale"> & { locale?: boolean };

/**
 * Get path redirect
 */
export function getPathRedirect(arg: {
  localeSource?: I18nCodegen.Locale;
  localeDestination?: I18nCodegen.Locale;
  template: string;
  pathname: string;
  localeParam?: string;
  permanent?: boolean;
}) {
  const { localeSource, localeDestination, template, pathname, permanent } =
    arg;

  const sourcePrefix = localeSource ? `${localeSource}/` : "";
  const source = formatRoutePathname(sourcePrefix + template);

  const destinationPrefix = localeDestination ? `${localeDestination}/` : "";
  const destination = formatRoutePathname(destinationPrefix + pathname);
  // console.log(`redirect template "${source}" to pathname "${destination}"`);

  if (source === destination) return;

  const redirect: Redirect = {
    source,
    destination,
    permanent: Boolean(permanent),
  };

  return redirect;
}
