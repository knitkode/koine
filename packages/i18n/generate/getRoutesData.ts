import { capitalize, changeCaseCamel, forin, objectFlat } from "@koine/utils";
import { formatRoutePathname, routeHasDynamicPortion } from "../shared";
import { sortObjectKeysMatching } from "./sortObjectKeysMatching";
import type { I18nGenerate } from "./types";

const ROUTES_TRANSLATION_JSON_FILE_NAME = "~.json";
const TOKEN_PARENT_ROUTE_REFERENCE = "^";
const TOKEN_ROUTE_ID_DELIMITER = ".";
const TOKEN_ROUTE_PATHNAME_WILDCARD = "*";

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
  data: I18nGenerate.DataRoutes,
  locale: I18nGenerate.Locale,
  id: I18nGenerate.RouteId,
) => {
  let pathname = data[id].pathnames[locale];

  // beginning slash is always present here as the route value is already
  // normalised at this point
  if (pathname.startsWith(`/${TOKEN_PARENT_ROUTE_REFERENCE}`)) {
    const regex = new RegExp(`^\\/\\${TOKEN_PARENT_ROUTE_REFERENCE}`);
    // removes the slash + token
    pathname = pathname.replace(regex, "");
    // grab the parent id
    const parentId = id.split(".").slice(0, -1).join(".");
    if (parentId) {
      pathname = replaceRouteParentTokens(data, locale, parentId) + pathname;
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
const replaceRoutesPathnamesParentTokens = (data: I18nGenerate.DataRoutes) => {
  forin(data, (id, routeData) => {
    forin(routeData.pathnames, (locale) => {
      data[id].pathnames[locale] = replaceRouteParentTokens(data, locale, id);
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
    }, {} as I18nGenerate.DataRoutesParams);
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
  options: Pick<I18nGenerate.Config, "defaultLocale">,
  dataRoutes: I18nGenerate.DataRoutes,
) => {
  const { defaultLocale } = options;

  for (const routeId in dataRoutes) {
    const pathnamesPerLocale = dataRoutes[routeId].pathnames;
    const defaultLocalePathname = pathnamesPerLocale[defaultLocale];
    const optimizedPathnames: Record<
      I18nGenerate.Locale,
      I18nGenerate.RoutePathname
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
 * Get {@link I18nGenerate.DataRoutes} routes data
 */
export const getRoutesData = (
  options: Pick<I18nGenerate.Config, "defaultLocale"> & {
    defaultLocale: I18nGenerate.Locale;
    files: I18nGenerate.TranslationFile[];
  },
) => {
  const { defaultLocale, files } = options;
  const wildcardRoutesIds: string[] = [];
  let dataRoutes: I18nGenerate.DataRoutes = {};

  for (let i = 0; i < files.length; i++) {
    const { path, locale, data } = files[i];

    if (path === ROUTES_TRANSLATION_JSON_FILE_NAME) {
      const routes = objectFlat<Record<I18nGenerate.RouteId, string>>(
        data,
        TOKEN_ROUTE_ID_DELIMITER,
      );

      for (const _key in routes) {
        const key = _key as keyof typeof routes;
        const routePathname = routes[key]; // as I18nGenerate.RoutePathname;
        const routeId = normaliseUserDefinedRouteId(key);

        // if is the first pass for this routeId
        if (!dataRoutes[routeId]) {
          dataRoutes[routeId] = dataRoutes[routeId] || {};
          const typeName = routeIdToTypeName(routeId);
          const { paramsNames, params } =
            extractRouteParamsFromRouteId(routeId);
          const wildcard = routePathname.includes(
            TOKEN_ROUTE_PATHNAME_WILDCARD,
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
        dataRoutes[routeId].pathnames = sortObjectKeysMatching(
          dataRoutes[routeId].pathnames,
          defaultLocale,
        );
        // dataRoutes[routeId].optimizedPathnames
      }
    }
  }

  replaceRoutesPathnamesParentTokens(dataRoutes);
  addRoutesOptimizedPathnames(options, dataRoutes);

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
