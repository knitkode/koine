import { isBrowser } from "./ssr";
import { isString, isNull, isUndefined } from "./is";

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
export function getUrlQueryParams<T extends Record<string, string>>(
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
 * TODO: at some point replace with `URLSearchParams`, @see [caniuse](https://caniuse.com/?search=URLSearchParams)
 */
export function buildUrlQueryString(
  params: Record<string | number, unknown> = {}
) {
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
 * consecutive slashes.
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
 * Change current URL query parameters
 *
 * @param replace Replace URL instead of pushing it in the history stack. By default it pushes it.
 */
export function changeUrlParams(
  params: string | Record<string, string> = {},
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
 * Merge query parameters objects, it *mutates* the first given object argument
 */
export function mergeUrlQueryParams<T extends Record<string, string>>(
  oldParams: Record<string, string> = {},
  newParams: Record<string, string> = {}
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
 * Merge current URL query parameters with the given ones
 *
 * @param replace Replace URL instead of pushing it in the history stack. By default it pushes it.
 */
export function mergeUrlParams(
  params: Record<string, string> = {},
  replace?: boolean
) {
  return changeUrlParams(
    mergeUrlQueryParams(getUrlQueryParams(), params),
    replace
  );
}

/**
 * Remove URL query parameter
 *
 * @param replace Replace URL instead of pushing it in the history stack. By default it pushes it.
 */
export function removeUrlParam(paramName?: string, replace?: boolean) {
  const params: Record<string, string> = {};
  const currentParams = getUrlQueryParams();
  for (const key in currentParams) {
    if (key !== paramName) {
      params[key] = currentParams[key];
    }
  }

  return changeUrlParams(params, replace);
}

/**
 * Redirect to url with params {optionally}, removes eventual trailing question
 * marks from the given URL.
 */
export function redirectTo(url: string, params?: Record<string, string>) {
  if (isBrowser) {
    const queryString = buildUrlQueryString(params);
    location.href = url.replace(/\?+$/g, "") + queryString;
  }
}

/**
 * Is external url
 */
export function isExternalUrl(url: string) {
  const reg = /https?:\/\/((?:[\w\d-]+\.)+[\w\d]{2,})/i;
  const urlMatches = reg.exec(url);

  // if no matches are found it means we either have an invalid URL, a relative
  // URL or a hash link, and those are not considered externals
  if (!urlMatches) {
    return false;
  }

  return isBrowser ? reg.exec(location.href)?.[1] !== urlMatches[1] : true;
}

/**
 * Update link `<a href="">` query parameters, it returns the newly created `href`
 * URL value
 */
export function updateLinkParams(
  $anchor: HTMLAnchorElement,
  newParams: Record<string, string> = {}
) {
  const { href } = $anchor;
  const parts = href.split("?");
  const pre = parts[0];
  const queryString = parts[1];
  const allParams = queryString
    ? mergeUrlQueryParams(getUrlQueryParams(`?${queryString}`), newParams)
    : newParams;
  const newHref = pre + buildUrlQueryString(allParams);

  $anchor.href = newHref;

  return newHref;
}
