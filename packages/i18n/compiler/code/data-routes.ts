import {
  type JsonObject,
  escapeRegExp,
  objectFlat,
  objectSort,
  objectSortByKeysMatching,
} from "@koine/utils";
import { formatRoutePathname } from "../../formatRoutePathname";
import type { I18nCompiler } from "../types";

export const codeDataRoutesOptions = {
  /**
   * Set this to true once your routing setup is ready for production.
   *
   * @default false
   */
  permanentRedirects: false as boolean,
  /**
   * The name of the locale dynamic segment in the URL usually represented as
   * `[lang]/my-slugs` but without neither brackets nor slashes, so just `lang`
   *
   * @default "lang"
   */
  localeParamName: "lang",
  /** @default  "~.json" */
  translationJsonFileName: "~.json",
  /**
   * Generated `route_id()` functions prefix, prepended to the automatically
   * generated function names.
   *
   * @default ""
   */
  fnsPrefix: "",
  tokens: {
    /** @default  "^" */
    parentReference: "^",
    /** @default  "." */
    idDelimiter: ".",
    /**
     * @see https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes#catch-all-segments
     */
    catchAll: {
      /** @default  "[..." */
      start: "[...",
      /** @default  "]" */
      end: "]",
    },
    /**
     * @see https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes#optional-catch-all-segments
     */
    optionalCatchAll: {
      /** @default  "[[..." */
      start: "[[...",
      /** @default  "]]" */
      end: "]]",
    },
  },
};

export type CodeDataRoutesOptions = typeof codeDataRoutesOptions;

type CodeDataRoutesUtils = ReturnType<typeof getCodeDataRoutesUtils>;

const getCodeDataRoutesUtils = (
  config: I18nCompiler.Config,
  options: CodeDataRoutesOptions,
) => {
  const { idDelimiter, parentReference, catchAll, optionalCatchAll } =
    options.tokens;
  return {
    ...config,
    ...options,
    reg: {
      trailingDelimiter: new RegExp(`${escapeRegExp(idDelimiter)}+$`),
      indexEnd: new RegExp(`${escapeRegExp(idDelimiter)}index$`),
      parentReference: new RegExp(`^/${escapeRegExp(parentReference)}`),
      catchAll: new RegExp(
        `${escapeRegExp(catchAll.start)}(.+)${escapeRegExp(catchAll.end)}$`,
      ),
      optionalCatchAll: new RegExp(
        `${escapeRegExp(optionalCatchAll.start)}(.+)${escapeRegExp(optionalCatchAll.end)}$`,
      ),
    },
  };
};

/**
 * Normalise user defined route id
 *
 * 1) remove ending `.index`
 */
const parseUserDefinedRouteId = (
  userRouteId: string,
  { reg }: CodeDataRoutesUtils,
) => {
  let routeId = userRouteId.replace(reg.indexEnd, "");
  const isOptionalCatchAll = reg.optionalCatchAll.test(userRouteId);
  const isCatchAll = reg.catchAll.test(userRouteId);

  if (isOptionalCatchAll) routeId = routeId.replace(reg.optionalCatchAll, "");
  if (isCatchAll) routeId = routeId.replace(reg.catchAll, "");

  routeId = routeId.replace(reg.trailingDelimiter, "");

  return {
    routeId,
    isCatchAll,
    isOptionalCatchAll,
  };
};

/**
 * Normalise user defined route pathname
 *
 * - ensures beginning slash
 * - replaces too many consecutive slashes
 * - removes the trailing slash
 * - removes `*` wildcard token
 * - normalises to `/my/[id]` dynamic params defined in any of these shapes:
 *   - `/my/{{id}}`
 *   - `/my/{{ id }}`
 *   - `/my/[id]`
 *   - `/my/[ id ]`
 *   - `/my/{id}`
 *   - `/my/{ id }`
 *
 * TODO: support also `/my/:id` syntax?
 */
const normaliseUserDefinedRoutePathname = (
  routePathname: string,
  options: Pick<I18nCompiler.Config, "trailingSlash">,
) =>
  formatRoutePathname(
    routePathname
      .replace(/\*/g, "")
      .replace(
        /[[{]{1,2}(.*?)[\]}]{1,2}/g,
        (_search, replaceValue) => `[${replaceValue.trim()}]`,
      ),
    options,
  );

/**
 * Gathers a dictionary with the params extracted from the given (normalised)
 * route id
 */
const extractRouteParamsFromRouteId = (routeId: string) => {
  const matches = routeId.match(/\[.*?\]/g);
  if (matches) {
    return matches
      .map((match) => match.slice(1, -1).trim())
      .reduce((map, paramName) => {
        // TODO: maybe determine the more specific type with some kind of special
        // token used in the route id `[dynamicParam]` portion
        map[paramName] = "stringOrNumber";
        return map;
      }, {} as I18nCompiler.DataParams);
  }
  return;
};

/**
 * Recursively replace `/^` references with the parent route value
 */
const replaceRouteParentTokens = (
  dataRoutes: I18nCompiler.DataRoutes,
  utils: CodeDataRoutesUtils,
  locale: I18nCompiler.Locale,
  id: I18nCompiler.RouteId,
  continueWhen?: (
    currentRoute: I18nCompiler.DataRoute,
    parentRouteId: I18nCompiler.RouteId,
  ) => boolean | undefined,
) => {
  const {
    tokens: { parentReference, idDelimiter },
    reg,
  } = utils;
  const route = dataRoutes.byId[id];
  let pathname = route.pathnames[locale];

  // beginning slash is always present here as the route value is already
  // normalised at this point
  if (pathname.startsWith(`/${parentReference}`)) {
    // removes the slash + token
    pathname = pathname.replace(reg.parentReference, "");
    // grab the parent id
    const parentId = id.split(idDelimiter).slice(0, -1).join(idDelimiter);

    if (!continueWhen || (continueWhen && continueWhen(route, parentId))) {
      if (parentId) {
        pathname =
          replaceRouteParentTokens(
            dataRoutes,
            utils,
            locale,
            parentId,
            continueWhen,
          ) + pathname;
      } else {
        throw Error(
          "Used a parent route token reference without a matching parent route",
        );
      }
    }
  }
  return pathname;
};

/**
 * Mutate the routes data replacing the parent route tokens
 * NB: it mutates the data
 */
const replaceRoutesPathnamesParentTokens = (
  dataRoutes: I18nCompiler.DataRoutes,
  utils: CodeDataRoutesUtils,
) => {
  for (const routeId in dataRoutes.byId) {
    for (const locale in dataRoutes.byId[routeId].pathnames) {
      dataRoutes.byId[routeId].pathnames[locale] = replaceRouteParentTokens(
        dataRoutes,
        utils,
        locale,
        routeId,
      );
    }
  }
};

/**
 * Mutate the routes data replacing the parent route tokens
 * NB: it mutates the data
 */
const manageRoutesSpaPathnames = (
  dataRoutes: I18nCompiler.DataRoutes,
  utils: CodeDataRoutesUtils,
) => {
  const continueWhen = (
    currentRoute: I18nCompiler.DataRoute,
    parentRouteId: I18nCompiler.RouteId,
  ) =>
    currentRoute.inWildcard && !dataRoutes.wildcardIds.includes(parentRouteId);
  for (const routeId in dataRoutes.byId) {
    const { inWildcard } = dataRoutes.byId[routeId];

    if (inWildcard && dataRoutes.byId[routeId].pathnamesSpa) {
      dataRoutes.haveSpaRoutes = true;

      for (const locale in dataRoutes.byId[routeId].pathnamesSpa) {
        dataRoutes.byId[routeId].pathnamesSpa![locale] =
          replaceRouteParentTokens(
            dataRoutes,
            utils,
            locale,
            routeId,
            continueWhen,
          );
      }
    } else {
      // discard unneeded data
      delete dataRoutes.byId[routeId].pathnamesSpa;
    }
  }
};

/**
 * Optimize the route map by collapsing pathnames that are equal to the one for
 * the default locale
 *
 * NB: It mutates the data
 *
 * ```json
 * {
 *   // from
 *   "about": {
 *     "en": "/about",
 *     "nl": "/about"
 *   },
 *   "account.user.[id]": {
 *     "en": "/account/user/{{ id }}",
 *     "fi": "/account/user/{{ id }}",
 *     "nl": "/rekening/gebruiker/{{ id }}"
 *   },
 *   // to
 *   "about": "/about",
 *   "account.user.[id]": {
 *     "en": "/account/user/{{ id }}",
 *     "nl": "/rekening/gebruiker/{{ id }}"
 *   }
 * }
 * ```
 */
const addRoutesSlimPathnames = (
  dataRoutes: I18nCompiler.DataRoutes,
  utils: CodeDataRoutesUtils,
) => {
  const { defaultLocale, locales } = utils;

  for (const routeId in dataRoutes.byId) {
    const pathnamesPerLocale = dataRoutes.byId[routeId].pathnames;
    const defaultLocalePathname = pathnamesPerLocale[defaultLocale];
    const pathnamesSlim: Record<
      I18nCompiler.Locale,
      I18nCompiler.RoutePathname
    > = {};

    for (const locale in pathnamesPerLocale) {
      const url = pathnamesPerLocale[locale];

      if (url !== defaultLocalePathname) {
        pathnamesSlim[locale] = url;
      }
    }

    if (Object.keys(pathnamesSlim).length === locales.length - 1) {
      // if we have the same number of optimized/non-optimized pathnames we do
      // not add the data
    } else if (Object.keys(pathnamesSlim).length >= 1) {
      // if we have more than one optimized pathnames we do add the default locale one
      pathnamesSlim[defaultLocale] = defaultLocalePathname;
      dataRoutes.byId[routeId].pathnamesSlim = objectSortByKeysMatching(
        pathnamesSlim,
        defaultLocale,
      );
    } else {
      // otherwise it means that the pathname is the same for all locales
      dataRoutes.byId[routeId].pathnamesSlim = defaultLocalePathname;
    }
  }
};

/**
 * Flag routes that are children of wildcards, a.k.a. child SPA routes
 *
 * NB: It mutates the data
 */
const addInWildcardFlags = (dataRoutes: I18nCompiler.DataRoutes) => {
  if (dataRoutes.wildcardIds.length) {
    for (const routeId in dataRoutes.byId) {
      const inWildcard = dataRoutes.wildcardIds.some(
        (wildcardRouteId) =>
          routeId.startsWith(wildcardRouteId) && wildcardRouteId !== routeId,
      );
      if (inWildcard) dataRoutes.byId[routeId].inWildcard = true;
    }
  }
};

const buildDataRoutesFromJsonData = (
  json: JsonObject,
  locale: I18nCompiler.Locale,
  utils: CodeDataRoutesUtils,
  data: I18nCompiler.DataRoutes,
) => {
  const routes = objectFlat<Record<I18nCompiler.RouteId, string>>(
    json,
    utils.tokens.idDelimiter,
  );

  for (const _key in routes) {
    const key = _key as keyof typeof routes;
    const routePathname = routes[key]; // as I18nCompiler.RoutePathname;
    const { routeId, isCatchAll, isOptionalCatchAll } = parseUserDefinedRouteId(
      key,
      utils,
    );

    // if (isCatchAll || isOptionalCatchAll) console.log({ routeId, key });

    // if is the first pass for this routeId
    if (!data.byId[routeId]) {
      data.byId[routeId] = data.byId[routeId] || {};
      const params = extractRouteParamsFromRouteId(routeId);
      data.byId[routeId].id = routeId;
      if (params) {
        data.byId[routeId].params = params;
        data.dynamicRoutes.push(routeId);
        data.onlyStaticRoutes = false;
      } else {
        data.staticRoutes.push(routeId);
      }
      if (isCatchAll || isOptionalCatchAll) {
        data.byId[routeId].wildcard = true;
        data.wildcardIds.push(routeId);
      }
    }

    data.byId[routeId].pathnames = data.byId[routeId].pathnames || {};
    // prettier-ignore
    data.byId[routeId].pathnames[locale] = normaliseUserDefinedRoutePathname(routePathname, utils);
    // prettier-ignore
    data.byId[routeId].pathnames = objectSortByKeysMatching(data.byId[routeId].pathnames, utils.defaultLocale);

    // just copy them for now, the difference treatment happens when resolving
    // the parent tokens
    data.byId[routeId].pathnamesSpa = { ...data.byId[routeId].pathnames };
  }

  // sort by route name
  data.byId = objectSort(data.byId);
};

/**
 * Get routes data
 */
export let getCodeDataRoutes = (
  config: I18nCompiler.Config,
  options: CodeDataRoutesOptions,
  { translationFiles }: I18nCompiler.DataInput,
) => {
  const dataRoutes: I18nCompiler.DataRoutes = {
    byId: {},
    wildcardIds: [],
    onlyStaticRoutes: true,
    dynamicRoutes: [],
    staticRoutes: [],
    haveSpaRoutes: false,
  };
  const utils = getCodeDataRoutesUtils(config, options);

  for (let i = 0; i < translationFiles.length; i++) {
    const { path, locale, data } = translationFiles[i];

    if (path === options.translationJsonFileName) {
      buildDataRoutesFromJsonData(data, locale, utils, dataRoutes);
    }
  }

  // the order in which these mutations run matters!
  addInWildcardFlags(dataRoutes);
  manageRoutesSpaPathnames(dataRoutes, utils);
  replaceRoutesPathnamesParentTokens(dataRoutes, utils);
  addRoutesSlimPathnames(dataRoutes, utils);

  return dataRoutes;
};

// /**
//  * Route id to TypeScript valid type/interface name
//  *
//  * @deprecated
//  */
// const routeIdToTypeName = (routeId: string) =>
//   capitalize(changeCaseCamel(routeId));
