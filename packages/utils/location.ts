import { isBrowser } from "./ssr";
import { isString, isNull, isUndefined } from "./is";

export type AnyQueryParams =
  | undefined
  | null
  | Record<string | number, unknown>;

/**
 * Solution without DOM or specific env native methods
 *
 * @see https://stackoverflow.com/a/21553982/1938970
 */
export function parseURL(url: string) {
  const match = url.match(
    /^(https?:)\/\/(([^:/?#]*)(?::([0-9]+))?)([/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/
  );
  return (
    match && {
      href: url,
      protocol: match[1],
      host: match[2],
      hostname: match[3],
      port: match[4],
      pathname: match[5],
      search: match[6],
      hash: match[7],
    }
  );
}

/**
 * Strips out the trailing slash
 */
export function removeTralingSlash(urlLike = "") {
  return urlLike.replace(/\/*$/, "");
}

/**
 * Normalise URL (absolute URL)
 *
 * - replaces too many consecutive slashes (except `http{s}://`)
 * - removes the trailing slash
 */
export function normaliseUrl(absoluteUrl = "") {
  return removeTralingSlash(absoluteUrl.replace(/([^:]\/)\/+/g, "$1"));
}

/**
 * Normalise URL pathname (relative URL)
 *
 * - replaces too many consecutive slashes
 * - removes the trailing slash
 */
export function normaliseUrlPathname(pathname = "") {
  return removeTralingSlash(pathname.replace(/\/+/g, "/"));
}

/**
 * Transform string in a URL pathname (relative URL)
 *
 * - adds an initial slash
 * - encode the string
 * - replaces whitespaces with dashes
 */
export function transformToUrlPathname(toPathname?: string) {
  return isString(toPathname)
    ? `/${encodeURIComponent(toPathname.replace(/\s/g, "-").toLowerCase())}`
    : "";
}

/**
 * Get parsed query parameters as object dictionary (from URL or given query string)
 *
 * @param queryString A full query string that starts with a `?`, e.g. `?myparam=x`.
 *                    It defaults to reading the current URL query string with
 *                    `location.search`. Through this argument you can use this
 *                    same function to parse, for instance, the query params of
 *                    the `href` of a `<a href="...">` HTML tag.
 *
 */
export function getUrlQueryParams<T extends AnyQueryParams>(
  queryString?: string
) {
  let params = {};
  let search = queryString || isBrowser ? location.search : "";
  search = search.substring(1);

  if (!search) {
    return {} as T;
  }

  try {
    // @see https://stackoverflow.com/a/8649003/1938970
    const paramsAsObj = `{"${search
      .replace(/&/g, '","')
      .replace(/=/g, '":"')}"}`;
    params = JSON.parse(paramsAsObj, (key, value) => {
      return key === "" ? value : decodeURIComponent(value);
    });
  } catch (e) {
    // do nothing or warn on process.env["NODE_ENV"] !== "production"
  }

  return params as T;
}

/**
 * Get pathname parts
 *
 * First clean the pathname from the first slash if any then split the pathname
 * in parts,
 * Given a pathname like: `"/en/{prefix}/{collection}/{slug}"` we obtain
 * `[locale, prefix, collection, slug]`
 */
export function getUrlPathnameParts(urlPathname = "") {
  if (isBrowser && !urlPathname) {
    urlPathname = location.pathname;
  }
  return urlPathname
    .replace(/^\//, "")
    .split("/")
    .filter((part) => part);
}

/**
 * Get clean query string for URL
 *
 * It returns the query string **with** the initial `?`
 *
 * TODO: at some point replace with `URLSearchParams`, @see [caniuse](https://caniuse.com/?search=URLSearchParams)
 */
export function buildUrlQueryString(params: AnyQueryParams = {}) {
  let output = "";

  for (const key in params) {
    const value = params[key];
    if (!isNull(value) && !isUndefined(value)) {
      output += `${key}=${encodeURIComponent(value + "")}&`;
    }
  }

  // removes the last &
  return output ? `?${output.replace(/&+$/, "")}` : "";
}

/**
 * Change URL path, ensures initial and ending slashes and normalise eventual
 * consecutive slashes, it uses `history`.
 *
 * @param replace Replace URL instead of pushing it in the history stack. By default it pushes it.
 * @returns {string} The new cleaned pathname
 */
export function changeUrlPath(
  pathname: string,
  state?: object,
  replace?: boolean
) {
  const path = normaliseUrlPathname(`/${pathname}/`);

  if (isBrowser) {
    history[replace ? "replaceState" : "pushState"](state, "", path);
  }

  return path;
}

/**
 * Change current URL query parameters, it uses `history`.
 *
 * @param replace Replace URL instead of pushing it in the history stack. By default it pushes it.
 */
export function changeUrlParams(
  params: string | AnyQueryParams = {},
  replace?: boolean
) {
  const queryString =
    typeof params === "string" ? params : buildUrlQueryString(params);

  if (isBrowser) {
    history[replace ? "replaceState" : "pushState"](
      null,
      "",
      location.pathname + queryString
    );
  }

  return queryString;
}

/**
 * Merge current URL query parameters with the given ones, it uses `history`.
 *
 * @param replace Replace URL instead of pushing it in the history stack. By default it pushes it.
 */
export function mergeUrlParams(
  params: NonNullable<AnyQueryParams> = {},
  replace?: boolean
) {
  return changeUrlParams(
    mergeUrlQueryParams(getUrlQueryParams(), params),
    replace
  );
}

/**
 * Remove URL query parameter, it uses `history`
 *
 * @param replace Replace URL instead of pushing it in the history stack. By default it pushes it.
 */
export function removeUrlParam(paramName?: string, replace?: boolean) {
  const params: NonNullable<AnyQueryParams> = {};
  const currentParams = getUrlQueryParams();
  for (const key in currentParams) {
    if (key !== paramName) {
      params[key] = currentParams[key];
    }
  }

  return changeUrlParams(params, replace);
}

/**
 * Merge query parameters objects, it *mutates* the first given object argument
 *
 * @pure
 */
export function mergeUrlQueryParams<T extends AnyQueryParams>(
  oldParams: NonNullable<AnyQueryParams> = {},
  newParams: NonNullable<AnyQueryParams> = {}
) {
  for (const key in newParams) {
    const value = newParams[key];

    if (oldParams[key] && isNull(value)) {
      delete oldParams[key];
    } else {
      oldParams[key] = value;
    }
  }

  return oldParams as T;
}

/**
 * Update a URL string query parameters merging the given new query parameters
 *
 * @pure
 */
export function updateUrlQueryParams(
  url: string,
  newParams: NonNullable<AnyQueryParams> = {}
) {
  const parts = url.split("?");
  const allParams = parts[1]
    ? mergeUrlQueryParams(getUrlQueryParams(`?${parts[1]}`), newParams)
    : newParams;
  return parts[0] + buildUrlQueryString(allParams);
}

/**
 * Update link `<a href="">` merging the given new query parameters.
 * it returns the newly created `href` URL value
 *
 * @pure
 */
export function updateLinkParams(
  $anchor: HTMLAnchorElement,
  newParams: NonNullable<AnyQueryParams>
) {
  const href = updateUrlQueryParams($anchor.href, newParams);
  $anchor.href = href;
  return href;
}

/**
 * Redirect to url with params {optionally}, removes eventual trailing question
 * marks from the given URL, it uses `location`
 */
export function redirectTo(url: string, params?: AnyQueryParams) {
  if (isBrowser) {
    const queryString = buildUrlQueryString(params);
    location.href = url.replace(/\?+$/g, "") + queryString;
  }
}

/**
 * Is external url compared to the given current URL (if not provided it falls
 * back to `location.href`)
 *
 */
export function isExternalUrl(url: string, currentUrl?: string) {
  const reg = /https?:\/\/((?:[\w\d-]+\.)+[\w\d]{2,})/i;
  const urlMatches = reg.exec(url);

  // if no matches are found it means we either have an invalid URL, a relative
  // URL or a hash link, and those are not considered externals
  if (!urlMatches) {
    return false;
  }

  currentUrl = currentUrl || isBrowser ? location.href : "";

  return currentUrl ? reg.exec(currentUrl)?.[1] !== urlMatches[1] : true;
}

/**
 * It updates the `location.hash` with the given query params, it uses `location`
 */
export function changeUrlHashParams(params: string | AnyQueryParams = {}) {
  const hashQueryLess = getUrlHashPathname();
  const queryString =
    typeof params === "string" ? params : buildUrlQueryString(params);
  location.hash = "#/" + hashQueryLess + queryString;

  return queryString;
}

export function mergeUrlHashParams(params: NonNullable<AnyQueryParams> = {}) {
  return changeUrlHashParams(mergeUrlQueryParams(getUrlHashParams(), params));
}

/**
 * It reads the "query params" within the `location.hash`
 */
export function getUrlHashParams<T extends AnyQueryParams>() {
  const hashParts = location.hash.split("?");
  if (hashParts.length >= 1) {
    return Object.fromEntries(new URLSearchParams(hashParts[1])) as T;
  }
  return {} as never;
}

/**
 * It reads the "pathname" within the `location.hash`
 */
export function getUrlHashPathname() {
  return location.hash.split("?")[0].replace(/^#\//, "");
}
