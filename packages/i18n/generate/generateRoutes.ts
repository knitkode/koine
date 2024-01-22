import { sortObjectKeysMatching } from "./sortObjectKeysMatching";
import type { I18nIndexedFile, I18nLocale } from "./types";

export type I18nGenerateRoutesConfig = {
  defaultLocale: string;
};

type I18nRouteName = string & { route: true };

type I18nGenerateRoutesOptions = I18nGenerateRoutesConfig & {
  defaultLocale: I18nLocale;
  files: I18nIndexedFile[];
};

function flattenObject(obj: object, parent = "") {
  return Object.keys(obj).reduce(
    (acc, _key) => {
      const key = _key as keyof typeof obj;
      const propName = (parent ? `${parent}.${key}` : key) as I18nRouteName;
      if (typeof obj[key] === "object") {
        acc = { ...acc, ...flattenObject(obj[key], propName) };
      } else {
        acc[propName] = obj[key];
      }
      return acc;
    },
    {} as Record<I18nRouteName, string>,
  );
}

const getRoutesData = (options: I18nGenerateRoutesOptions) => {
  const { defaultLocale, files } = options;
  // const routesByLocale: Record<I18nLocale, Record<I18nRouteName, string>> = {};
  let output: Record<I18nRouteName, Record<I18nLocale, string>> = {};

  for (let i = 0; i < files.length; i++) {
    const { path, locale, data } = files[i];

    if (path === "~.json") {
      // routesByLocale[locale] = flattenObject(data);
      const routes = flattenObject(data);

      for (const _routeName in routes) {
        const routeName = _routeName as keyof typeof routes;
        const routeValue = routes[routeName];

        output[routeName] = output[routeName] || {};
        output[routeName][locale] = routeValue;
        output[routeName] = sortObjectKeysMatching(
          output[routeName],
          defaultLocale,
        );
      }
    }
  }

  // sort by route name
  output = Object.fromEntries(Object.entries(output).sort());

  return output;
};

export async function generateRoutes(options: I18nGenerateRoutesOptions) {
  // const { defaultLocale, files } = options;
  // const defaultLocaleFiles = files.filter((f) => f.locale === defaultLocale);

  const data = getRoutesData(options);

  // console.log("generateRoutes: outputDir", outputDir, "outputPath", outputPath);
  return { data };
}
