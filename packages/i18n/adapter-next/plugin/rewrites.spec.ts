import type { Rewrite } from "next/dist/lib/load-custom-routes";
import { describe, expect, it } from "vitest";
import type { I18nCompiler } from "../../compiler";
import type { CodeDataRoutesOptions } from "../../compiler/code/data-routes";
import {
  // private but we can still test
  generatePathRewrite,
  generateRewriteForPathname,
  generateRewrites,
} from "./rewrites";

const config = {
  baseUrl: "https://example.com",
  locales: ["en", "it"],
  defaultLocale: "en",
  hideDefaultLocaleInUrl: true,
  trailingSlash: false,
  logLevel: 3,
  debug: false,
  single: false,
} satisfies I18nCompiler.Config;

const sharedOptions = {
  permanentRedirects: false,
  localeParamName: "lang",
  translationJsonFileName: "~.json",
  functions: {
    dir: "$to",
    prefix: "$to_",
  },
  tokens: {
    parentReference: "^",
    idDelimiter: ".",
    catchAll: {
      start: "[...",
      end: "]",
    },
    optionalCatchAll: {
      start: "[[...",
      end: "]]",
    },
  },
} satisfies CodeDataRoutesOptions;

const routes = {
  byId: {
    about: {
      id: "about",
      fnName: "$to_about",
      pathnames: {
        en: "/about",
        it: "/chi-siamo",
      },
    },
    cookies: {
      id: "cookies",
      fnName: "$to_cookies",
      pathnames: {
        en: "/cookies",
        it: "/cookies",
      },
      pathnamesSlim: "/cookies",
      equalValues: true,
    },
    "pages.[slug]": {
      id: "pages.[slug]",
      fnName: "$to_pages_slug",
      pathnames: {
        en: "/[slug]",
        it: "/[slug]",
      },
      pathnamesSlim: "/[slug]",
      equalValues: true,
      params: {
        slug: "stringOrNumber",
      },
    },
    "pages.home": {
      id: "pages.home",
      fnName: "$to_pages_home",
      pathnames: {
        en: "/",
        it: "/",
      },
      pathnamesSlim: "/",
      equalValues: true,
    },
  },
  wildcardIds: [],
  onlyStaticRoutes: false,
  dynamicRoutes: ["pages.[slug]"],
  staticRoutes: ["about", "cookies", "pages.home"],
  haveSpaRoutes: false,
} satisfies I18nCompiler.DataRoutes;

describe("rewrites", () => {

  describe("generateRewrites", () => {
    it("should generate rewrites for multiple locales", () => {
      const rewrites = generateRewrites(config, sharedOptions, routes.byId);

      expect(rewrites).toContainEqual({
        source: "/it",
        destination: "/it/pages/home",
        locale: false,
      });

      expect(rewrites).toContainEqual({
        source: "/:slug",
        destination: "/en/pages/:slug",
        locale: false,
      });

      expect(rewrites).toContainEqual({
        source: "/it/:slug",
        destination: "/it/pages/:slug",
        locale: false,
      });
    });

    it("should keep seemingly pointless rewrite when dynamic and static paths collide", () => {
      const rewrites = generateRewrites(config, sharedOptions, routes.byId);

      expect(rewrites).toContainEqual({
        source: "/cookies",
        destination: "/en/cookies",
        locale: false,
      });

      expect(rewrites).toContainEqual({
        source: "/it/cookies",
        destination: "/it/cookies",
        locale: false,
      });
    });

    it("should order static paths first, dynamic ones later, to allow template overriding", () => {
      const rewrites = generateRewrites(config, sharedOptions, routes.byId);

      expect(rewrites.map((r) => r.destination)).toEqual([
        "/en/pages/home",
        "/it/pages/home",
        "/en/about",
        "/en/cookies",
        "/it/about",
        "/it/cookies",
        "/en/pages/:slug",
        "/it/pages/:slug",
      ]);
    });
  });

  describe("generatePathRewrite", () => {
    it("should generate a rewrite with source and destination", () => {
      const rewrite = generatePathRewrite({
        localeSource: "en",
        localeDestination: "",
        template: "/about",
        pathname: "/about",
      });

      expect(rewrite).toEqual<Rewrite>({
        source: "/en/about",
        destination: "/about",
      });
    });

    it("should set locale=false if passLocale is false", () => {
      const rewrite = generatePathRewrite({
        localeSource: "en",
        localeDestination: "fr",
        template: "/about",
        pathname: "/about",
        passLocale: false,
      });

      expect(rewrite?.locale).toBe(false);
    });
  });

  describe("generateRewriteForPathname", () => {
    const config = {
      defaultLocale: "en",
      hideDefaultLocaleInUrl: false,
      trailingSlash: false,
      localeParamName: "lng",
    };

    it("should push a rewrite for non-default locale", () => {
      const rewrites: (Rewrite | undefined)[] = [];
      generateRewriteForPathname(config, "fr", "/about", "/a-propos", rewrites);

      expect(rewrites[0]).toMatchObject({
        source: "/fr/a-propos",
        destination: "/fr/about",
      });
    });

    // it("should not push rewrite if pathname === template for pages router", () => {
    //   const rewrites: (Rewrite | undefined)[] = [];
    //   generateRewriteForPathname(config, "fr", "/about", "/about", rewrites);

    //   expect(rewrites).toHaveLength(0);
    // });

    it("should push rewrite without locale when hideDefaultLocaleInUrl is true", () => {
      const rewrites: (Rewrite | undefined)[] = [];
      generateRewriteForPathname(
        { ...config, hideDefaultLocaleInUrl: true },
        "en",
        "/about",
        "/about-en",
        rewrites,
      );

      expect(rewrites[0]).toMatchObject({
        source: "/about-en",
        destination: "/en/about",
      });
    });

    it("should handle app router case (localeParamName present)", () => {
      const rewrites: (Rewrite | undefined)[] = [];
      generateRewriteForPathname(
        { ...config, localeParamName: "lang" },
        "fr",
        "/about",
        "/a-propos",
        rewrites,
      );

      expect(rewrites[0]).toMatchObject({
        source: "/fr/a-propos",
        destination: "/fr/about",
        locale: false,
      });
    });
  });

  describe("generateRewrites", () => {
    const config = {
      defaultLocale: "en",
      hideDefaultLocaleInUrl: false,
      trailingSlash: false,
      baseUrl: "https://example.com",
      locales: ["en", "fr"],
      logLevel: 0 as const,
      debug: false,
      single: false,
    };

    const options = {
      ...sharedOptions,
      tokens: { ...sharedOptions.tokens, idDelimiter: "__" },
      localeParamName: "lng",
      permanentRedirects: false,
    };

    // it("should generate rewrites for multiple locales", () => {
    //   const routes = {
    //     about: {
    //       id: "about",
    //       fnName: "$to_about",
    //       pathnames: {
    //         en: "/about",
    //         fr: "/a-propos",
    //       },
    //       inWildcard: false,
    //     },
    //   };

    //   const rewrites = generateRewrites(config, options, routes);

    //   expect(rewrites).toContainEqual([
    //     {
    //       destination: "/en/about",
    //       source: "/en/about",
    //       locale: false,
    //     },
    //     {
    //       source: "/fr/a-propos",
    //       destination: "/fr/about",
    //       locale: false,
    //     },
    //   ]);
    // });

    it("should not generate rewrites for wildcard children", () => {
      const routes = {
        blog__slug: {
          id: "blog.slug",
          fnName: "$to_blog_slug",
          pathnames: {
            en: "/blog/[slug]",
          },
          inWildcard: true,
          wildcard: undefined,
        },
      };

      const rewrites = generateRewrites(config, options, routes);

      expect(rewrites).toEqual([]);
    });

    it("should generate both normal and wildcard rewrites", () => {
      const routes = {
        docs__path: {
          id: "docs.path",
          fnName: "$to_docs_path",
          pathnames: {
            en: "/docs/[[...path]]",
            fr: "/docs-fr/[[...path]]",
          },
          inWildcard: false,
          wildcard: true,
        },
      };

      const rewrites = generateRewrites(config, options, routes);

      const sources = rewrites.map((r) => r.source);

      expect(sources).toContain("/fr/docs-fr/:path/:wildcard*");
    });

    it("should deduplicate rewrites", () => {
      const routes = {
        about: {
          id: "about",
          fnName: "$to_about",
          pathnames: {
            en: "/about",
            en2: "/about", // duplicate
          },
          inWildcard: false,
          wildcard: undefined,
        },
      };

      const rewrites = generateRewrites(config, options, routes);

      // Should only keep one rewrite
      const destinations = rewrites.map((r) => r.destination);
      expect(new Set(destinations).size).toBe(destinations.length);
    });
  });
});
