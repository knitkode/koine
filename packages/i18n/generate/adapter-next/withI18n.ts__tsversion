import type { I18nGenerate } from "../../types";

export default (data: I18nGenerate.Data) => `
import withTranslate from "next-translate-plugin";
import type { NextConfig } from "next";
import type { Redirect, Rewrite } from "next/dist/lib/load-custom-routes";
import redirects from "./next-redirects.json";
import rewrites from "./next-rewrites.json";

interface I18nNextConfig {
  /**
   * Whether the routes redirecting should be permanent. Switch this on once you
   * go live and the routes structure is stable.
   */
  permanent?: boolean;
  localeParam?: string;
}

interface MergedConfig extends I18nNextConfig, Omit<NextConfig, "i18n"> {}

/**
 * Get Next.js config with some basic opinionated defaults
 */
export function withI18n(
  { permanent, localeParam, ...nextConfig }: MergedConfig = {
    i18n: {
      locales: [${data.locales.map((l) => `"${l}"`).join(", ")}],
      defaultLocale: "${data.defaultLocale}",
      hideDefaultLocaleInUrl: ${data.hideDefaultLocaleInUrl ? "true" : "false"},
    },
  },
) {

  if (nextConfig.i18n) {
    const { locales, defaultLocale } = nextConfig.i18n;
    if (localeParam) {
      // app router:
      // NOTE: after thousands attempts turns out that passing the i18n settings
      // to the app router messes up everything, just rely on our internal i18n
      // mechanisms
      delete nextConfig.i18n;
    } else {
      // pages routes:
      nextConfig.i18n = { locales, defaultLocale };
    }
  }

  const newNextConfig = {
    ...nextConfig,
    async redirects() {
      const defaults = [...(redirects as Redirect[])];
      if (nextConfig.redirects) {
        const customs = await nextConfig.redirects();
        return [...defaults, ...customs];
      }
      return defaults;
    },
    async rewrites() {
      const defaults = [...(rewrites as Rewrite[])];

      if (nextConfig.rewrites) {
        const customs = await nextConfig.rewrites();

        if (Array.isArray(customs)) {
          return {
            beforeFiles: defaults,
            afterFiles: customs,
            fallback: [],
          };
        }

        return {
          ...customs,
          beforeFiles: [...defaults, ...(customs.beforeFiles || [])],
        };
      }
      return {
        beforeFiles: defaults,
        afterFiles: [],
        fallback: [],
      };
    },
  };

  // return newNextConfig as Omit<NextConfig, "i18n"> & { i18n: Required<NextConfig["i18n"]> };
  return withTranslate(newNextConfig) as Omit<NextConfig, "i18n"> & { i18n: Required<NextConfig["i18n"]> };
}

export default withI18n;
`;
