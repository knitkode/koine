// import { format } from "prettier";
import type { I18nIndexedFile } from "./types";

/**
 * @see https://github.com/sindresorhus/type-fest/blob/main/source/internal.d.ts#L120
 */
const pluralSuffixes = ["_zero", "_one", "_two", "_few", "_many", "_other"];

/**
 * Some translations keys won't be used directly and should be omitted
 * from the generated types, e.g. the plural versions of the same string.
 */
const filterTranslationKey = (key: string) => {
  const parts = key.split("_").filter(Boolean);
  if (parts.length > 1) {
    const lastPart = parts[parts.length - 1];
    return /^[0-9]+$/.test(lastPart) || pluralSuffixes.includes(lastPart);
  }
  return false;
};

function getType(
  value: string | string[] | object | object[],
  options: {} = {},
) {
  let out = "";
  let primitiveType = "";

  if (typeof value === "boolean") {
    primitiveType = "boolean";
  } else if (typeof value === "string") {
    primitiveType = "string";
  }

  if (primitiveType) {
    out += primitiveType + ";";
  } else if (!value) {
    out += "";
  } else if (Array.isArray(value)) {
    const firstValue = value[0];
    out += `${getType(firstValue, options)}[];`;
  } else if (typeof value === "object") {
    out += "{";
    for (const _key in value) {
      const key = _key as keyof typeof value;
      if (!filterTranslationKey(key)) {
        const single = value[key];
        out += `'${key}': ${getType(single, options)}`;
      }
    }
    out += "};";
  }

  // adjust syntax
  out = out.replace(/;\[\];/g, "[];");
  out = out.replace(/;+/g, ";");

  return out;
}

export async function i18nGenerateTypes(options: {
  defaultLocale: string;
  files: I18nIndexedFile[];
}) {
  const { defaultLocale, files } = options;
  const defaultLocaleFiles = files.filter((f) => f.locale === defaultLocale);
  const header = `
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-namespace */

declare namespace Koine {
  interface Translations {
`;
  const footer = `
  }
}
`;
  let out = header;

  for (let i = 0; i < defaultLocaleFiles.length; i++) {
    const { path, data } = defaultLocaleFiles[i];
    const namespace = path.replace(".json", "");

    out += `"${namespace}": ${getType(data)}\n`;
  }

  out += footer;

  // prettier breaks jest, @see https://jestjs.io/docs/ecmascript-modules
  // https://github.com/jestjs/jest/issues/14305
  if (!process.env["JEST_WORKER_ID"]) {
    // out = await format(out, {
    //   parser: "typescript",
    // });
  }

  // console.log("i18nGenerateTypes: outputDir", outputDir, "outputPath", outputPath);
  return out;
}
