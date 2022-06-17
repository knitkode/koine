import removeTralingSlash from "./removeTrailingSlash";

/**
 * Normalise URL (absolute URL)
 *
 * - replaces too many consecutive slashes (except `http{s}://`)
 * - removes the trailing slash
 *
 * @category location
 */
export function normaliseUrl(absoluteUrl = "") {
  return removeTralingSlash(absoluteUrl.replace(/([^:]\/)\/+/g, "$1"));
}

export default normaliseUrl;
