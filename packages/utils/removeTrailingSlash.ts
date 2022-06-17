/**
 * Strips out the trailing slash
 *
 * @category location
 */
export function removeTralingSlash(urlLike = "") {
  return urlLike.replace(/\/*$/, "");
}

export default removeTralingSlash;
