import { arraySum, forin, objectSortByKeysMatching } from "@koine/utils";
import type { I18nCodegen } from "./types";

type I18nSummary = Record<
  I18nCodegen.Locale,
  {
    words: number;
    characters: number;
    files: I18nSummaryFile[];
  }
>;

type I18nSummaryByPath = Record<
  string,
  Record<I18nCodegen.Locale, I18nSummaryFile>
>;

type I18nSummaryFile = {
  locale: I18nCodegen.Locale;
  path: string;
  url: string;
  words: number;
  characters: number;
};

function getWords(
  value: string | string[] | object | object[],
  options: {} = {},
) {
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
}

function getSummaryDataEntry(
  options: I18nCodegenSummaryOptions,
  file: I18nCodegen.TranslationFile,
): I18nSummaryFile {
  const { locale, path } = file;
  const url = `${options.sourceUrl}/${locale}/${path}`;
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
}

function getSummaryData(
  data: I18nCodegen.Data,
  options: I18nCodegenSummaryOptions,
) {
  const {
    files,
    config: { defaultLocale },
  } = data;
  let dataSummary: I18nSummary = {};

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const { locale } = file;
    const entry = getSummaryDataEntry(options, file);

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
    ) as I18nSummary[I18nCodegen.Locale];
  });

  return dataSummary;
}

function getSummaryDataByPath(data: I18nSummary) {
  let out: I18nSummaryByPath = {};

  forin(data, (locale, dataPerLocale) => {
    const { files } = dataPerLocale;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const { path } = file;

      out[path] = out[path] || {};
      out[path][locale] = file;
    }
  });

  out = Object.fromEntries(Object.entries(out).sort());

  return out;
}

function generateSummaryMarkdownByPath(data: I18nSummary) {
  const dataByPath = getSummaryDataByPath(data);
  let output = "";
  let body = "";
  const locales: I18nCodegen.Locale[] = [];
  const styleBorder = `style="border-right:1px solid grey"`;

  forin(dataByPath, (path, dataPerPath) => {
    body += `<tr>`;
    body += `<td ${styleBorder}>${path}</td>`;

    forin(dataPerPath, (locale, file) => {
      const { characters, words, url } = file;

      if (!locales.includes(locale)) locales.push(locale);

      body += `<td><a href="${url}">${locale}</a></td>`;
      body += `<td>${words}</td>`;
      body += `<td ${styleBorder}>${characters}</td>`;
    });

    body += `</tr>`;
  });

  output += `<table><thead><tr>`;
  output += `<th ${styleBorder}>file path</th>`;
  output += locales
    .map(() => `<th>lang</th><th>words</th><th ${styleBorder}>chars</th>`)
    .join("");
  output += `</tr></thead><tbody>${body}</tbody></table>\n`;

  return output;
}

function generateSummaryMarkdownByLocale(
  data: I18nSummary,
  options: I18nCodegenSummaryOptions,
) {
  let output = "";
  let body = "";

  forin(data, (locale, dataPerLocale) => {
    const { files, characters, words } = dataPerLocale;
    const url = `${options.sourceUrl}/${locale}`;
    body += `<tr>`;
    body += `<th><a href="${url}">${locale}</a></th>`;
    body += `<td>${files.length}</td>`;
    body += `<td>${words}</td>`;
    body += `<td>${characters}</td>`;
    body += `</tr>`;
  });

  output += `<table><thead><tr>`;
  output += `<th>locale</th><th>files</th><th>words</th><th>chars</th>`;
  output += `</tr></thead><tbody>${body}</tbody></table>\n`;

  return output;
}

function generateSummaryMarkdown(
  data: I18nSummary,
  options: I18nCodegenSummaryOptions,
) {
  let output = "# Summary\n";

  output += "\n### By locale\n\n";
  output += generateSummaryMarkdownByLocale(data, options);
  output += "\n### By file path\n\n";
  output += generateSummaryMarkdownByPath(data);

  return output;
}

export type I18nCodegenSummaryOptions = {
  /**
   * @default "/" Usually this should be an absolute URL
   */
  sourceUrl: string;
};

export let generateSummary = async (
  data: I18nCodegen.Data,
  options: I18nCodegenSummaryOptions = {
    sourceUrl: "/",
  },
) => {
  const summaryData = getSummaryData(data, options);
  const md = generateSummaryMarkdown(summaryData, options);
  return { data, md };
};
