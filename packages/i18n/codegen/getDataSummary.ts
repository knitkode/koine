import { arraySum, forin, objectSortByKeysMatching } from "@koine/utils";
import type { I18nCodegen } from "./types";

export const dataSummaryConfig = {
  /**
   * @default "/" Usually this should be an absolute URL
   */
  sourceUrl: "/",
};

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

const getDataSummaryEntry = (
  sourceUrl: string,
  file: I18nCodegen.DataFsTranslationFile,
): I18nCodegen.DataSummaryFile => {
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

export let getDataSummary = (
  config: I18nCodegen.Config,
  { translationFiles }: I18nCodegen.DataFs,
) => {
  const { defaultLocale } = config;
  let dataSummary: I18nCodegen.DataSummary = {};

  for (let i = 0; i < translationFiles.length; i++) {
    const file = translationFiles[i];
    const { locale } = file;
    const entry = getDataSummaryEntry(config.summary.sourceUrl, file);

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
    ) as I18nCodegen.DataSummary[I18nCodegen.Locale];
  });

  return dataSummary;
};
