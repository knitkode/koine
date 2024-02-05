import {
  capitalize,
  changeCaseCamel,
  forin,
  objectFlat,
  objectSortByKeysMatching,
} from "@koine/utils";
import { formatRoutePathname, routeHasDynamicPortion } from "../index";
// import { formatRoutePathname } from "../client/formatRoutePathname";
// import { routeHasDynamicPortion } from "../client/routeHasDynamicPortion";
import type { I18nCodegen } from "./types";

/**
 * Normalise user defined route id
 *
 * 1) remove ending `.index`
 */
const normaliseUserDefinedRouteId = (routeId: string) =>
  routeId.replace(/\.index$/, "");

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
const normaliseUserDefinedRoutePathname = (routePathname: string) =>
  formatRoutePathname(
    routePathname
      .replace(/\*/g, "")
      .replace(
        /[[{]{1,2}(.*?)[\]}]{1,2}/g,
        (_search, replaceValue) => `[${replaceValue.trim()}]`,
      ),
  );

/**
 * Route id to TypeScript valid type/interface name
 */
const routeIdToTypeName = (routeId: string) =>
  capitalize(changeCaseCamel(routeId));

/**
 * Recursively replace `/^` references with the parent route value
 */
const replaceRouteParentTokens = (
  config: Pick<I18nCodegen.Config, "tokenParentRouteReference">,
  dataRoutes: I18nCodegen.DataRoutes,
  locale: I18nCodegen.Locale,
  id: I18nCodegen.RouteId,
) => {
  let pathname = dataRoutes[id].pathnames[locale];

  // beginning slash is always present here as the route value is already
  // normalised at this point
  if (pathname.startsWith(`/${config.tokenParentRouteReference}`)) {
    const regex = new RegExp(`^\\/\\${config.tokenParentRouteReference}`);
    // removes the slash + token
    pathname = pathname.replace(regex, "");
    // grab the parent id
    const parentId = id.split(".").slice(0, -1).join(".");
    if (parentId) {
      pathname =
        replaceRouteParentTokens(config, dataRoutes, locale, parentId) +
        pathname;
    } else {
      throw Error(
        "Used a parent route token reference without a matching parent route",
      );
    }
  }
  return pathname;
};

/**
 * Mutate the routes data replacing the parent route tokens
 * NB: it mutates the data
 */
const replaceRoutesPathnamesParentTokens = (
  config: Pick<I18nCodegen.Config, "tokenParentRouteReference">,
  dataRoutes: I18nCodegen.DataRoutes,
) => {
  forin(dataRoutes, (id, routeData) => {
    forin(routeData.pathnames, (locale) => {
      dataRoutes[id].pathnames[locale] = replaceRouteParentTokens(
        config,
        dataRoutes,
        locale,
        id,
      );
    });
  });
};

/**
 * Gathers a dictionary with the params extracted from the given (normalised)
 * route id
 */
const extractRouteParamsFromRouteId = (routeId: string) => {
  const matches = routeId.match(/\[.*?\]/g);
  if (matches) {
    const paramsNames = matches.map((match) => match.slice(1, -1).trim());
    const params = paramsNames.reduce((map, paramName) => {
      // TODO: maybe determine the more specific type with some kind of special
      // token used in the route id `[dynamicParam]` portion
      map[paramName] = "stringOrNumber";
      return map;
    }, {} as I18nCodegen.DataRoutesParams);
    return { paramsNames, params };
  }
  return {};
};

/**
 * Optimize the route map by collapsing pathnames that are shared among all the
 * locales.
 *
 * NB: It mutates the data
 *
 * ```js
 * // from
 * "about": {
 *   "en": "/about",
 *   "nl": "/about"
 * },
 * "account.user.[id]": {
 *   "en": "/account/user/{{ id }}",
 *   "fi": "/account/user/{{ id }}",
 *   "nl": "/rekening/gebruiker/{{ id }}"
 * },
 * // to
 * "about": "/about",
 * "account.user.[id]": {
 *   "en": "/account/user/{{ id }}",
 *   "nl": "/rekening/gebruiker/{{ id }}"
 * },
 * ```
 */
const addRoutesOptimizedPathnames = (
  config: Pick<I18nCodegen.Config, "defaultLocale">,
  dataRoutes: I18nCodegen.DataRoutes,
) => {
  const { defaultLocale } = config;

  for (const routeId in dataRoutes) {
    const pathnamesPerLocale = dataRoutes[routeId].pathnames;
    const defaultLocalePathname = pathnamesPerLocale[defaultLocale];
    const optimizedPathnames: Record<
      I18nCodegen.Locale,
      I18nCodegen.RoutePathname
    > = {};

    for (const locale in pathnamesPerLocale) {
      const url = pathnamesPerLocale[locale];

      if (url !== defaultLocalePathname) {
        optimizedPathnames[locale] = url;
      }
    }

    if (Object.keys(optimizedPathnames).length >= 1) {
      optimizedPathnames[defaultLocale] = defaultLocalePathname;
      dataRoutes[routeId].optimizedPathnames = optimizedPathnames;
    } else {
      dataRoutes[routeId].optimizedPathnames = defaultLocalePathname;
    }
  }
};

/**
 * Get {@link I18nCodegen.DataRoutes} routes data
 */
export let getDataRoutes = (
  config: I18nCodegen.Config,
  files: I18nCodegen.TranslationFile[],
) => {
  const { defaultLocale } = config;
  const wildcardRoutesIds: string[] = [];
  let dataRoutes: I18nCodegen.DataRoutes = {};

  for (let i = 0; i < files.length; i++) {
    const { path, locale, data } = files[i];

    if (path === config.routesTranslationJsonFileName) {
      const routes = objectFlat<Record<I18nCodegen.RouteId, string>>(
        data,
        config.tokenRouteIdDelimiter,
      );

      for (const _key in routes) {
        const key = _key as keyof typeof routes;
        const routePathname = routes[key]; // as I18nCodegen.RoutePathname;
        const routeId = normaliseUserDefinedRouteId(key);

        // if is the first pass for this routeId
        if (!dataRoutes[routeId]) {
          dataRoutes[routeId] = dataRoutes[routeId] || {};
          const typeName = routeIdToTypeName(routeId);
          const { paramsNames, params } =
            extractRouteParamsFromRouteId(routeId);
          const wildcard = routePathname.includes(
            config.tokenRoutePathnameWildcard,
          );
          if (wildcard) wildcardRoutesIds.push(routeId);
          dataRoutes[routeId].id = routeId;
          dataRoutes[routeId].typeName = typeName;
          dataRoutes[routeId].paramsNames = paramsNames;
          dataRoutes[routeId].params = params;
          dataRoutes[routeId].dynamic = routeHasDynamicPortion(routeId);
          dataRoutes[routeId].wildcard = wildcard;
        }

        dataRoutes[routeId].pathnames = dataRoutes[routeId].pathnames || {};
        dataRoutes[routeId].pathnames[locale] =
          normaliseUserDefinedRoutePathname(routePathname);
        dataRoutes[routeId].pathnames = objectSortByKeysMatching(
          dataRoutes[routeId].pathnames,
          defaultLocale,
        );
        // dataRoutes[routeId].optimizedPathnames
      }
    }
  }

  replaceRoutesPathnamesParentTokens(config, dataRoutes);
  addRoutesOptimizedPathnames(config, dataRoutes);

  // add `inWildcard` flag
  if (wildcardRoutesIds.length) {
    for (const routeId in dataRoutes) {
      dataRoutes[routeId].inWildcard = wildcardRoutesIds.some(
        (wildcardRouteId) =>
          routeId.startsWith(wildcardRouteId) && wildcardRouteId !== routeId,
      );
    }
  }

  // sort by route name
  dataRoutes = Object.fromEntries(Object.entries(dataRoutes).sort());

  return dataRoutes;
};
