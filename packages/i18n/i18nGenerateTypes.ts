import { forin, isNumericLiteral, objectPick, split } from "@koine/utils";
import type { I18nIndexedFile } from "./types";

type PluralKey = `${string}_${PluralSuffix}`;

type PluralSuffix = `${number}` | PluralSuffixNamed;

type PluralSuffixNamed = (typeof pluralSuffixes)[number];

/**
 * @see https://github.com/aralroca/next-translate?tab=readme-ov-file#5-plurals
 */
const pluralSuffixes = ["zero", "one", "two", "few", "many", "other"] as const;

const requiredPluralSuffix: PluralSuffixNamed = "other";

const isPluralSuffix = (suffix: string): suffix is PluralSuffix => {
  return suffix
    ? isNumericLiteral(suffix) ||
        pluralSuffixes.includes(suffix as PluralSuffixNamed)
    : false;
};

const isPluralKey = (key: string): key is PluralKey => {
  const [, suffix] = split(key as PluralKey, "_");
  return isPluralSuffix(suffix);
};

const groupPluralsKeysByRoot = (pluralKeys: PluralKey[]) => {
  const map: Record<string, PluralKey[]> = {};

  pluralKeys.forEach((key) => {
    const [root] = split(key, "_");

    map[root] = map[root] || [];
    map[root].push(key);
  });

  return map;
};

/**
 * Some translations keys won't be used directly and should be omitted
 * from the generated types, e.g. the plural versions of the same string.
 */
const transformKeysForPlurals = (keys: string[]) => {
  const pluralKeys = keys.filter(isPluralKey);

  if (pluralKeys.length) {
    let transformedKeys: string[] = [...keys];
    const groupedPlurals = groupPluralsKeysByRoot(pluralKeys);

    forin(groupedPlurals, (pluralRoot, pluralKeys) => {
      // add the plural root
      if (!keys.includes(pluralRoot)) {
        transformedKeys.push(pluralRoot);
      }
      // remove the plurals variations
      pluralKeys.forEach((pluralKey) => {
        if (keys.includes(pluralKey)) {
          transformedKeys = transformedKeys.filter((k) => k !== pluralKey);
        }
      });
    });
    return transformedKeys;
  }

  return keys;
};

const analyseObjectPlurals = (obj: object) => {
  const keys = Object.keys(obj);
  const hasPlurals = keys.includes(requiredPluralSuffix);
  let hasOnlyPluralKeys = false;
  let newValue = obj;

  if (hasPlurals) {
    const nonPluralKeys = keys.filter((k) => !isPluralSuffix(k));
    hasOnlyPluralKeys = nonPluralKeys.length === 0;
    newValue = objectPick(obj, nonPluralKeys as (keyof typeof obj)[]);
  }

  return {
    hasPlurals,
    hasOnlyPluralKeys,
    newValue,
  };
};

const getTypeForObjectEntry = (
  key: string,
  value: string | string[] | object | object[],
) => {
  if (typeof value === "object") {
    const { hasPlurals, hasOnlyPluralKeys, newValue } =
      analyseObjectPlurals(value);
    if (hasOnlyPluralKeys) {
      return `'${key}': string;`;
    }
    if (hasPlurals) {
      return `'${key}': string | ${getType(newValue)}`;
    }
  }
  return `'${key}': ${getType(value)}`;
};

function getType(value: string | string[] | object | object[]) {
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
    out += `${getType(firstValue)}[];`;
  } else if (typeof value === "object") {
    out += "{";
    const keys = transformKeysForPlurals(Object.keys(value));

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i] as keyof typeof value;
      // fallback to a string as plurals without root definition would not get a
      // type otherwise, e.g. ` pluralNoDefault_...` in __mocks__
      const single = value[key] || "";
      out += getTypeForObjectEntry(key, single);
    }
    // for (const _key in value) {
    //   const key = _key as keyof typeof value;
    //   if (!filterTranslationKey(key)) {
    //     const single = value[key];
    //     out += `'${key}': ${getType(single, options)}`;
    //   }
    // }
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
    const { format } = await import("prettier");
    out = await format(out, {
      parser: "typescript",
    });
  }

  // console.log("i18nGenerateTypes: outputDir", outputDir, "outputPath", outputPath);
  return out;
}
