import isString from "./isString";

/**
 * Transform string in a URL pathname (relative URL)
 *
 * - adds an initial slash
 * - encode the string
 * - replaces whitespaces with dashes
 *
 * @category location
 */
export function transformToUrlPathname(toPathname?: string) {
  return isString(toPathname)
    ? `/${encodeURIComponent(toPathname.replace(/\s/g, "-").toLowerCase())}`
    : "";
}

export default transformToUrlPathname;
