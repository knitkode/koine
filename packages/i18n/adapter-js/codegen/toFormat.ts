import type { I18nCodegen } from "../../codegen";

export default ({ config }: I18nCodegen.AdapterArg) =>
  `
export function toFormat(
  locale: string | undefined,
  pathname: string,
  params?: object,
) {
  locale = locale || "${config.defaultLocale}";
  if (process.env["NODE_ENV"] === "development") {
    if (params) {
      pathname.replace(/\\[(.*?)\\]/g, (_, dynamicKey) => {
        const key = dynamicKey as Extract<keyof typeof params, string>;

        if (!(key in params)) {
          console.warn(
            "[@koine/i18n]::interpolateTo, using '" +
              pathname +
              "' without param '" +
              key +
              "'",
              { params }
          );
        }

        if (!["string", "number"].includes(typeof params[key])) {
          console.warn(
            "[@koine/i18n]::toFormat, using '" +
              pathname +
              "' with unserializable param  '" +
              key +
              "' (type '" +
              Object.prototype.toString.call((params[key])).slice(8, -1) +
              "')",
          );
        }
        return "";
      });
    }
  }

  if (params) {
    pathname = pathname.replace(
        /\\[(.*?)\\]/g,
        (_, key) =>
          params[key as keyof typeof params] + "",
      )
  }
  ${
    config.hideDefaultLocaleInUrl
      ? `
  if (locale !== "${config.defaultLocale}") {
    return "/" + locale + pathname;
  }
  `
      : ``
  }
  return pathname;
}

export default toFormat;
`;
