export let formatRoutePathname = (
  pathname = "",
  options?: {
    trailingSlash?: boolean;
  },
) => {
  const { trailingSlash } = options || {};
  // first ensure initial and trailing slashes then replaces consecutive slashes
  pathname = ("/" + pathname + "/").replace(/\/+/g, "/");

  // eventually remove the trailing slash
  if (!trailingSlash) {
    pathname = pathname.replace(/\/*$/, "");
  }
  return pathname || "/";
};

export default formatRoutePathname;
