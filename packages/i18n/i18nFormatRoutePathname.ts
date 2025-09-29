const REGEX_CONSECUTIVE_SLASHES = /\/+/g;
const REGEX_TRAILING_SLASH = /\/*$/;

export let i18nFormatRoutePathname = (
  pathname = "",
  options?: {
    trailingSlash?: boolean;
  },
) => {
  const { trailingSlash } = options || {};
  // first ensure initial and trailing slashes then replaces consecutive slashes
  pathname = ("/" + pathname + "/").replace(REGEX_CONSECUTIVE_SLASHES, "/");

  // eventually remove the trailing slash
  if (!trailingSlash) {
    pathname = pathname.replace(REGEX_TRAILING_SLASH, "");
  }
  return pathname || "/";
};

export default i18nFormatRoutePathname;
