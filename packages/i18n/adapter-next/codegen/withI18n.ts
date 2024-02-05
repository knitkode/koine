import type { I18nCodegen } from "../../codegen";

export default (data: I18nCodegen.Data) => `
import withTranslate from "next-translate-plugin";
import defaultRedirects from "./next-redirects.js"
import defaultRewrites from "./next-rewrites.js"

/**
 * @typedef {import("next").NextConfig} NextConfig
 * 
 * @typedef {object} WithI18nOptions
 * @property {boolean} [permanent] Whether the routes redirecting should be permanent. Switch this on once you go live and the routes structure is stable.
 * @property {string} [localeParam]
 */

/**
 * Get Next.js config with some basic opinionated defaults
 * 
 * @param {WithI18nOptions} options
 */
export const withI18n = ({ permanent, localeParam } = {}) =>
  /**
   * @param {Omit<NextConfig, "i18n">} nextConfig
   * @returns {Omit<NextConfig, "i18n"> & { i18n: Required<NextConfig["i18n"]> }
   */
  (nextConfig) => {
    const locales = [${data.locales.map((l) => `"${l}"`).join(", ")}];
    const defaultLocale = "${data.defaultLocale}";
    // const hideDefaultLocaleInUrl = ${data.hideDefaultLocaleInUrl ? "true" : "false"};

    if (localeParam) {
      // app router:
      // NOTE: after thousands attempts turns out that passing the i18n settings
      // to the app router messes up everything, just rely on our internal i18n
      // mechanisms
      delete nextConfig.i18n;
    } else {
      // pages routes:
      nextConfig.i18n = nextConfig.i18n || {};
      nextConfig.i18n.locales = locales;
      nextConfig.i18n.defaultLocale = defaultLocale;
    }

    const newNextConfig = {
      ...nextConfig,
      async redirects() {
        if (nextConfig.redirects) {
          const custom = await nextConfig.redirects();
          return [...defaultRedirects, ...custom];
        }
        return defaultRedirects;
      },
      async rewrites() {
        if (nextConfig.rewrites) {
          const custom = await nextConfig.rewrites();

          if (Array.isArray(custom)) {
            return {
              beforeFiles: defaultRewrites,
              afterFiles: custom,
              fallback: [],
            };
          }

          return {
            ...custom,
            beforeFiles: [...defaultRewrites, ...(custom.beforeFiles || [])],
          };
        }
        return {
          beforeFiles: defaultRewrites,
          afterFiles: [],
          fallback: [],
        };
      },
    };

    return withTranslate(newNextConfig);
  }
`;
