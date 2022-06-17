import removeTralingSlash from "./removeTrailingSlash";

/**
 * Normalise URL pathname (relative URL)
 *
 * - replaces too many consecutive slashes
 * - removes the trailing slash
 *
 * @category location
 */
export function normaliseUrlPathname(pathname = "") {
  return removeTralingSlash(pathname.replace(/\/+/g, "/"));
}

export default normaliseUrlPathname;
