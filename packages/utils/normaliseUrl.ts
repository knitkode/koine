import removeTralingSlash from "./removeTrailingSlash";

/**
 * Normalise URL, it works both for absolute and relative URLs
 *
 * - replaces too many consecutive slashes (except `http{s}://`)
 * - removes the trailing slash
 *
 * @category location
 * @see https://stackoverflow.com/a/40649435/1938970
 */
export function normaliseUrl(absoluteUrl = "") {
  return removeTralingSlash(absoluteUrl.replace(/(:\/\/)|(\/)+/g, "$1$2"));
}

export default normaliseUrl;
