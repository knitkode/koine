import {
  type JsonObject,
  areEqual,
  changeCaseSnake,
  escapeRegExp,
  objectFlat,
  objectSort,
  objectSortByKeysMatching,
} from "@koine/utils";
import { i18nFormatRoutePathname } from "../../i18nFormatRoutePathname";
import type { I18nCompiler } from "../types";

/**
 * Options for `routes` code data generation handling
 */
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
   * Functions generation options
   */
  functions: {
    /**
     * The directory name relative within the code `output` path where the
     * generated functions are written.
     *
     * @default "$to"
     */
    dir: "$to",
    /**
     * Generated `route_id()` functions prefix, prepended to the automatically
     * generated function names.
     *
     * @default "$to_"
     */
    prefix: "$to_",
  },
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

function getCodeDataRoutesUtils(
  config: I18nCompiler.Config,
  options: CodeDataRoutesOptions,
) {
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
}

/**
 * Normalise user defined route id
 *
 * 1) remove ending `.index`
 */
function parseUserDefinedRouteId(
  userRouteId: string,
  { reg }: CodeDataRoutesUtils,
) {
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
}

/**
 * Normalise user defined route pathname
 *
 * - ensures beginning slash
 * - replaces too many consecutive slashes
 * - removes the trailing slash
 * - removes `*` wildcard token
 * - normalises to `/my/[id]` dynamic params defined in any of these shapes:
 *   - `/my/:id`
 *   - `/my/{{id}}`
 *   - `/my/{{ id }}`
 *   - `/my/[id]`
 *   - `/my/[ id ]`
 *   - `/my/{id}`
 *   - `/my/{ id }`
 */
function normaliseUserDefinedRoutePathname(
  routePathname: string,
  options: Pick<I18nCompiler.Config, "trailingSlash">,
) {
  return i18nFormatRoutePathname(
    routePathname
      .replace(/\*/g, "")
      // manage `:id` syntax
      .replace(
        /:(.*?)?(\/|$)/g,
        (_search, firstGroup, secondGroup) =>
          `[${firstGroup.trim()}]${secondGroup}`,
      )
      // manage brackets syntax
      .replace(
        /[[{]{1,2}(.*?)[\]}]{1,2}/g,
        (_search, replaceValue) => `[${replaceValue.trim()}]`,
      ),
    options,
  );
}

/**
 * Gathers a dictionary with the params extracted from the given (normalised)
 * route id
 */
function extractRouteParamsFromRouteId(routeId: string) {
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
}

/**
 * Recursively replace `/^` references with the parent route value
 */
function replaceRouteParentTokens(
  dataRoutes: I18nCompiler.DataRoutes,
  utils: CodeDataRoutesUtils,
  locale: I18nCompiler.Locale,
  id: I18nCompiler.RouteId,
  continueWhen?: (
    currentRoute: I18nCompiler.DataRoute,
    parentRouteId: I18nCompiler.RouteId,
  ) => boolean | undefined,
) {
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
}

/**
 * Flag routes that are children of wildcards, a.k.a. child SPA routes
 *
 * NB: It mutates the data
 */
function addInWildcardFlags(dataRoutes: I18nCompiler.DataRoutes) {
  if (dataRoutes.wildcardIds.length) {
    for (const routeId in dataRoutes.byId) {
      const inWildcard = dataRoutes.wildcardIds.some(
        (wildcardRouteId) =>
          routeId.startsWith(wildcardRouteId) && wildcardRouteId !== routeId,
      );
      if (inWildcard) dataRoutes.byId[routeId].inWildcard = true;
    }
  }
}

/**
 * Mutate the routes data replacing the parent route tokens
 * NB: it mutates the data
 */
function manageRoutesSpaPathnames(
  dataRoutes: I18nCompiler.DataRoutes,
  utils: CodeDataRoutesUtils,
) {
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
}

/**
 * Mutate the routes data replacing the parent route tokens
 * NB: it mutates the data
 */
function replaceRoutesPathnamesParentTokens(
  dataRoutes: I18nCompiler.DataRoutes,
  utils: CodeDataRoutesUtils,
) {
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
}

/**
 * Optimize the route map by collapsing pathnames that are equal to the one for
 * the default locale
 *
 * NB: It mutates the data
 *
 * ```js
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
function addRoutesSlimPathnames(
  dataRoutes: I18nCompiler.DataRoutes,
  utils: CodeDataRoutesUtils,
) {
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
}

/**
 * We flag routes that have always the same output to optimize the
 * `to` functions implementation since in those cases we do not need to check
 * the current locale.
 *
 * NB: it mutates the data
 */
function flagDataRoutesEqualValues(dataRoutes: I18nCompiler.DataRoutes) {
  for (const key in dataRoutes.byId) {
    const route = dataRoutes.byId[key];
    let lastCompared: (typeof route.pathnames)[string] | null = null;
    let areAllEqual = true;

    for (const locale in route.pathnames) {
      if (lastCompared) {
        if (!areEqual(lastCompared, route.pathnames[locale])) {
          areAllEqual = false;
          break;
        }
      }
      lastCompared = route.pathnames[locale];
    }

    if (areAllEqual) dataRoutes.byId[key].equalValues = true;
  }
}

function getRouteFunctionName(
  utils: Pick<CodeDataRoutesUtils, "functions">,
  id: string,
) {
  return utils.functions.prefix + changeCaseSnake(id);
}

function createRouteEntry(
  utils: CodeDataRoutesUtils,
  {
    value,
    locale,
    routeId,
    isCatchAll,
    isOptionalCatchAll,
  }: {
    value: I18nCompiler.RoutePathname;
    locale: I18nCompiler.Locale;
  } & ReturnType<typeof parseUserDefinedRouteId>,
  existing?: I18nCompiler.DataRoute,
) {
  const pathnames = objectSortByKeysMatching(
    {
      ...(existing?.pathnames || {}),
      [locale]: normaliseUserDefinedRoutePathname(value, utils),
    },
    utils.defaultLocale,
  );
  const route: I18nCompiler.DataRoute = {
    ...(existing || {}),
    id: routeId,
    fnName: getRouteFunctionName(utils, routeId),
    pathnames,
    // just copy them for now, the difference treatment happens when resolving
    // the parent tokens
    pathnamesSpa: { ...pathnames },
  };

  // if is the first pass for this routeId
  if (!existing) {
    const params = extractRouteParamsFromRouteId(routeId);
    if (params) {
      route.params = params;
    }
    if (isCatchAll || isOptionalCatchAll) {
      route.wildcard = true;
    }
  }

  return route;
}

function buildDataRoutesFromJsonData(
  data: I18nCompiler.DataRoutes,
  utils: CodeDataRoutesUtils,
  json: JsonObject,
  locale: I18nCompiler.Locale,
) {
  const routes = objectFlat<Record<I18nCompiler.RouteId, string>>(
    json,
    utils.tokens.idDelimiter,
  );

  for (const key in routes) {
    const parsed = parseUserDefinedRouteId(key, utils);
    const existing = data.byId[parsed.routeId];
    const route = createRouteEntry(
      utils,
      { value: routes[key], locale, ...parsed },
      existing,
    );

    data.byId[route.id] = route;

    // if is the first pass for this route
    if (!existing) {
      if (route.params) {
        data.dynamicRoutes.push(route.id);
        data.onlyStaticRoutes = false;
      } else {
        data.staticRoutes.push(route.id);
      }
      if (route.wildcard) {
        data.wildcardIds.push(route.id);
      }
    }
  }

  // sort by route name
  data.byId = objectSort(data.byId);
}

/**
 * Get routes data
 */
export let getCodeDataRoutes = (
  config: I18nCompiler.Config,
  options: CodeDataRoutesOptions,
  { translationFiles, routes }: I18nCompiler.DataInput,
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

  let localesAnalysed = 0;
  for (let i = 0; i < translationFiles.length; i++) {
    const { path, locale, data } = translationFiles[i];

    if (path === options.translationJsonFileName) {
      localesAnalysed++;
      buildDataRoutesFromJsonData(dataRoutes, utils, data, locale);

      if (config.locales.length === localesAnalysed) {
        break;
      }
    }
  }

  // custom input routes (outside of translation files)
  if (routes) {
    for (const routeId in routes) {
      const pathnames = routes[routeId];
      for (const locale in pathnames) {
        const pathname = pathnames[locale];

        buildDataRoutesFromJsonData(
          dataRoutes,
          utils,
          { [routeId]: pathname },
          locale,
        );
      }
    }
  }

  // the order in which these mutations run matters!
  addInWildcardFlags(dataRoutes);
  manageRoutesSpaPathnames(dataRoutes, utils);
  replaceRoutesPathnamesParentTokens(dataRoutes, utils);
  addRoutesSlimPathnames(dataRoutes, utils);
  flagDataRoutesEqualValues(dataRoutes);

  return dataRoutes;
};

// /**
//  * Route id to TypeScript valid type/interface name
//  *
//  * @deprecated
//  */
// const routeIdToTypeName = (routeId: string) =>
//   capitalize(changeCaseCamel(routeId));
