/**
 * Next utility types
 */
declare type PageServer<P> = import("next").InferGetServerSidePropsType<P>;
declare type PageStatic<P> = import("next").InferGetStaticPropsType<P>;
declare type DataServer<P, T> = import("next").GetServerSideProps<P, T>;
declare type DataStatic<P, T> = import("next").GetStaticProps<P, T>;
declare type DataStaticPaths<P> = import("next").GetStaticPaths<P>;
declare type DataStaticPathsResult<P> = import("next").GetStaticPathsResult<P>;

/**
 * Nx types
 *
 * Allow to embed SVGs as both URLs string and as React components
 */
declare module "*.svg" {
  const content: unknown;
  export const ReactComponent: import("react").FC<
    import("react").ComponentProps<"svg">
  >;
  export default content;
}

/**
 * Extend NodeJS `process.env` with variables used by @koine
 */
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_APP_URL: string;
    AUTH_ROUTE_LOGIN: string;
    AUTH_ROUTE_PROFILE: string;
    AUTH_ROUTE_REGISTER: string;
    AUTH_ROUTES_SECURED: string;
  }
}

/**
 * Types specifically related to `@koine/next` exposed on the global unique
 * namespace `Koine`. Most of the types here should be prefixed by `Next`, e.g.
 * `NextSomeFeature` accessible anywhere from `Koine.NextSomeFeature`
 */
declare namespace Koine {
  /**
   * Default SEO data structure expected by the `<Seo>` component's prop `seo`
   */
  type NextSeo = import("./Seo").SeoData;

  /**
   * Next auth routes configurable map
   *
   * @see next/auth `pages` mapping: https://next-auth.js.org/configuration/pages`
   */
  type NextAuthRoutesMap = {
    login: string;
    profile: string;
    register: string;
    /** Array of regexes to match pathnames of protected routes */
    secured: RegExp[];
  };

  /**
   * Translations dictionary extracted from JSON files. You need to extend this
   * type with something like:
   *
   * ```ts
   * declare namespace Koine {
   *   interface NextTranslations {
   *     "~": typeof import("./public/locales/en/~.json");
   *     _: typeof import("./public/locales/en/_.json");
   *     $team: typeof import("./public/locales/en/$team.json");
   *     home: typeof import("./public/locales/en/home.json");
   *     Footer: typeof import("./public/locales/en/Footer.json");
   *     Header: typeof import("./public/locales/en/Header.json");
   *   }
   * }
   * ```
   */
  interface NextTranslations {
    /** Convention for app wide `common` translations */
    _: Record<string, string>;
    /** Convention for app wide `routes` translated definitions */
    "~": Record<string, string>;
  }
}

/**
 * List here the global variables used by third party scripts supported within
 * the `koine` ecosystem. For instance Google Analytics globally available
 * variables.
 */

declare const gtag: (
  ...args: Record<string, unknown>[]
) => Record<string, unknown>;
