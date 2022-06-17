import isBrowser from "./isBrowser";

/**
 * Get pathname parts
 *
 * First clean the pathname from the first slash if any then split the pathname
 * in parts,
 * Given a pathname like: `"/en/{prefix}/{collection}/{slug}"` we obtain
 * `[locale, prefix, collection, slug]`
 *
 * @category location
 */
export function getUrlPathnameParts(pathname = "") {
  pathname = pathname || isBrowser ? location.pathname : "";

  return pathname
    .replace(/^\//, "")
    .split("/")
    .filter((part) => part);
}

export default getUrlPathnameParts;
