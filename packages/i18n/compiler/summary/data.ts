import { arraySum, forin, objectSortByKeysMatching } from "@koine/utils";
import type { I18nCompiler } from "../types";

export const summaryDataOptions = {
  /**
   * @default "/" Usually this should be an absolute URL
   */
  sourceUrl: "/",
};

export type SummaryDataOptions = typeof summaryDataOptions;

const getWords = (
  value: string | string[] | object | object[],
  options: {} = {},
) => {
  let out = "";

  if (value && typeof value === "string") {
    out += " " + value.trim();
  } else if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      out += getWords(value[i], options);
    }
  } else if (typeof value === "object") {
    for (const _key in value) {
      const key = _key as keyof typeof value;
      const single = value[key];
      out += getWords(single, options);
    }
  }

  return out;
};

const getSummaryDataEntry = (
  sourceUrl: string,
  file: I18nCompiler.DataInputTranslationFile,
): I18nCompiler.DataSummaryFile => {
  const { locale, path } = file;
  const url = `${sourceUrl}/${locale}/${path}`;
  const words = getWords(file.data);
  const wordsCount = words.split(" ").filter(Boolean).length;
  const characters = words.split(" ").filter(Boolean).join("").length;

  return {
    characters,
    locale: locale,
    path,
    url,
    words: wordsCount,
  };
};

export let getSummaryData = (
  config: I18nCompiler.SharedConfig,
  options: SummaryDataOptions,
  { translationFiles }: I18nCompiler.DataInput,
) => {
  const { defaultLocale } = config;
  let dataSummary: I18nCompiler.DataSummary = {};

  for (let i = 0; i < translationFiles.length; i++) {
    const file = translationFiles[i];
    const { locale } = file;
    const entry = getSummaryDataEntry(options.sourceUrl, file);

    dataSummary[locale] = dataSummary[locale] || {};
    dataSummary[locale].files = dataSummary[locale].files || [];
    dataSummary[locale].files.push(entry);
  }

  // sort by default locale
  dataSummary = objectSortByKeysMatching(dataSummary, defaultLocale);

  forin(dataSummary, (locale, dataPerLocale) => {
    dataSummary[locale].characters = arraySum(
      dataPerLocale.files.map((f) => f.characters),
    );

    // sort files by path
    dataSummary[locale].files = dataSummary[locale].files.sort((a, b) =>
      a.path.localeCompare(b.path),
    );

    dataSummary[locale].words = arraySum(
      dataPerLocale.files.map((f) => f.words),
    );

    // sort object keys
    dataSummary[locale] = Object.fromEntries(
      Object.entries(dataSummary[locale]).sort(),
    ) as I18nCompiler.DataSummary[I18nCompiler.Locale];
  });

  return dataSummary;
};
