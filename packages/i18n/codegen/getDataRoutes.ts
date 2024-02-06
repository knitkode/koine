import {
  capitalize,
  changeCaseCamel,
  forin,
  objectFlat,
  objectSortByKeysMatching,
} from "@koine/utils";
import { formatRoutePathname } from "../index";
// import { formatRoutePathname } from "../client/formatRoutePathname";
import type { I18nCodegen } from "./types";

export const dataRoutesConfig = {
  /** @default  "~.json" */
  translationJsonFileName: "~.json",
  tokens: {
    /** @default  "^" */
    parentReference: "^",
    /** @default  "." */
    idDelimiter: ".",
    /** @default  "*" */
    pathnameWildcard: "*",
  },
};

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
  config: I18nCodegen.Config,
  dataRoutes: I18nCodegen.DataRoutes,
  locale: I18nCodegen.Locale,
  id: I18nCodegen.RouteId,
) => {
  let pathname = dataRoutes[id].pathnames[locale];

  // beginning slash is always present here as the route value is already
  // normalised at this point
  if (pathname.startsWith(`/${config.routes.tokens.parentReference}`)) {
    const regex = new RegExp(`^\\/\\${config.routes.tokens.parentReference}`);
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
  config: I18nCodegen.Config,
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
    return matches
      .map((match) => match.slice(1, -1).trim())
      .reduce((map, paramName) => {
        // TODO: maybe determine the more specific type with some kind of special
        // token used in the route id `[dynamicParam]` portion
        map[paramName] = "stringOrNumber";
        return map;
      }, {} as I18nCodegen.DataParams);
  }
  return;
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
const addRoutesOptimizedPathnames = (
  config: Pick<I18nCodegen.Config, "defaultLocale" | "locales">,
  dataRoutes: I18nCodegen.DataRoutes,
) => {
  const { defaultLocale, locales } = config;

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

    if (Object.keys(optimizedPathnames).length === locales.length - 1) {
      // if we have the same number of optimized/non-optimized pathnames we do
      // not add the data
    } else if (Object.keys(optimizedPathnames).length >= 1) {
      // if we have more than one optimized pathnames we do add the default locale one
      optimizedPathnames[defaultLocale] = defaultLocalePathname;
      dataRoutes[routeId].optimizedPathnames = objectSortByKeysMatching(
        optimizedPathnames,
        defaultLocale,
      );
    } else {
      // otherwise it means that the pathname is the same for all locales
      dataRoutes[routeId].optimizedPathnames = defaultLocalePathname;
    }
  }
};

/**
 * Get routes data
 */
export let getDataRoutes = (
  config: I18nCodegen.Config,
  { translationFiles }: I18nCodegen.DataFs,
) => {
  const { defaultLocale } = config;
  const wildcardRoutesIds: string[] = [];
  let dataRoutes: I18nCodegen.DataRoutes = {};

  for (let i = 0; i < translationFiles.length; i++) {
    const { path, locale, data } = translationFiles[i];

    if (path === config.routes.translationJsonFileName) {
      const routes = objectFlat<Record<I18nCodegen.RouteId, string>>(
        data,
        config.routes.tokens.idDelimiter,
      );

      for (const _key in routes) {
        const key = _key as keyof typeof routes;
        const routePathname = routes[key]; // as I18nCodegen.RoutePathname;
        const routeId = normaliseUserDefinedRouteId(key);

        // if is the first pass for this routeId
        if (!dataRoutes[routeId]) {
          dataRoutes[routeId] = dataRoutes[routeId] || {};
          const typeName = routeIdToTypeName(routeId);
          const params = extractRouteParamsFromRouteId(routeId);
          const wildcard = routePathname.includes(
            config.routes.tokens.pathnameWildcard,
          );
          dataRoutes[routeId].id = routeId;
          dataRoutes[routeId].typeName = typeName;
          if (params) dataRoutes[routeId].params = params;
          if (wildcard) {
            dataRoutes[routeId].wildcard = true;
            wildcardRoutesIds.push(routeId);
          }
        }

        dataRoutes[routeId].pathnames = dataRoutes[routeId].pathnames || {};
        dataRoutes[routeId].pathnames[locale] =
          normaliseUserDefinedRoutePathname(routePathname);
        dataRoutes[routeId].pathnames = objectSortByKeysMatching(
          dataRoutes[routeId].pathnames,
          defaultLocale,
        );
      }
    }
  }

  replaceRoutesPathnamesParentTokens(config, dataRoutes);
  addRoutesOptimizedPathnames(config, dataRoutes);

  // add `inWildcard` flag
  if (wildcardRoutesIds.length) {
    for (const routeId in dataRoutes) {
      const inWildcard = wildcardRoutesIds.some(
        (wildcardRouteId) =>
          routeId.startsWith(wildcardRouteId) && wildcardRouteId !== routeId,
      );
      if (inWildcard) dataRoutes[routeId].inWildcard = true;
    }
  }

  // sort by route name
  dataRoutes = Object.fromEntries(Object.entries(dataRoutes).sort());

  return dataRoutes;
};
